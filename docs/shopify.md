# Shopify Connector API Documentation

Complete reference for the Shopify Admin API connector used in Rior Systems.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Configuration](#configuration)
- [Endpoints](#endpoints)
- [Rate Limiting](#rate-limiting)
- [Webhook Setup](#webhook-setup)
- [Error Codes & Troubleshooting](#error-codes--troubleshooting)
- [Code Examples](#code-examples)

---

## Overview

The Shopify connector syncs store data (orders, products, customers, refunds) from the Shopify Admin API to BigQuery for analytics and reporting.

**Source:** `/connectors/shopify/shopify_connector.py`

**API Version:** 2024-01

**Features:**
- Full and incremental data sync
- Calculated metrics (gross/net revenue, refunds)
- BigQuery MERGE-based upserts
- Automatic pagination (250 records/page)

---

## Authentication

### Method 1: Environment Variable (Recommended)

```bash
export SHOPIFY_API_KEY="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
```

### Method 2: Config File

Create `config.json`:

```json
{
  "shops": {
    "mystore.myshopify.com": {
      "api_key": "shpat_xxxxxxxxxxxxxxxxxxxxxxxx",
      "api_version": "2024-01"
    }
  }
}
```

### API Key Permissions Required

Create a **Custom App** in Shopify Admin with these Admin API access scopes:

| Scope | Purpose |
|-------|---------|
| `read_orders` | Fetch order data, line items, and refunds |
| `read_products` | Fetch product catalog and variants |
| `read_customers` | Fetch customer information |

**Setup Steps:**
1. Go to Settings → Apps and sales channels → Develop apps
2. Create an app → Configure Admin API scopes
3. Install app → Reveal access token once
4. Copy the Admin API access token (starts with `shpat_`)

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SHOPIFY_API_KEY` | Yes | Admin API access token |
| `GOOGLE_APPLICATION_CREDENTIALS` | Yes | Path to GCP service account JSON |
| `GOOGLE_CLOUD_PROJECT` | No | GCP project ID (optional) |

### Config File Structure

```json
{
  "shops": {
    "{shop-domain}.myshopify.com": {
      "api_key": "{api_key}",
      "api_version": "2024-01"
    }
  },
  "bigquery": {
    "project_id": "rior-systems",
    "dataset": "rior_prod"
  }
}
```

---

## Endpoints

### Orders

**Endpoint:** `GET /admin/api/2024-01/orders.json`

**Purpose:** Fetch all orders with optional filtering

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `open`, `closed`, `cancelled`, `any` |
| `created_at_min` | ISO 8601 | Orders created after this date |
| `updated_at_min` | ISO 8601 | Orders updated after this date |
| `limit` | int | Page size (max 250, default 50) |
| `page_info` | string | Pagination cursor from Link header |

**Response Fields (Key):**

```python
{
  "orders": [
    {
      "id": 123456789,
      "name": "#1001",
      "created_at": "2024-01-15T10:30:00-05:00",
      "customer": {
        "id": 987654321,
        "email": "customer@example.com"
      },
      "total_price": "99.99",
      "financial_status": "paid",
      "line_items": [...]
    }
  ]
}
```

### Products

**Endpoint:** `GET /admin/api/2024-01/products.json`

**Purpose:** Fetch product catalog

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `updated_at_min` | ISO 8601 | Products updated after this date |
| `limit` | int | Page size (max 250) |

### Refunds

**Endpoint:** `GET /admin/api/2024-01/orders/{order_id}/refunds.json`

**Purpose:** Fetch refunds for a specific order

**Note:** Called automatically per order to calculate net revenue.

---

## Rate Limiting

Shopify uses a **leaky bucket** algorithm with two methods:

### API Key Method (Custom Apps)
- **Bucket size:** 40 requests
- **Leak rate:** 2 requests/second
- **Burst:** 40 requests, then throttled

### Response Headers

| Header | Description |
|--------|-------------|
| `X-Shopify-Shop-Api-Call-Limit` | Current usage: `1/40` |
| `Retry-After` | Seconds to wait when rate limited |

**Best Practices:**
- Use pagination with `page_info` (most efficient)
- Implement exponential backoff on 429 errors
- The connector handles rate limiting via `time.sleep()` between pages

---

## Webhook Setup

### Available Webhook Topics

| Topic | Event | Recommended Use |
|-------|-------|-----------------|
| `orders/create` | New order placed | Real-time order sync |
| `orders/updated` | Order modified | Status/financial updates |
| `orders/paid` | Order paid | Revenue confirmation |
| `orders/cancelled` | Order cancelled | Refund tracking |
| `products/update` | Product changed | Catalog sync |
| `refunds/create` | Refund issued | Net revenue update |

### Webhook Registration

```bash
curl -X POST "https://{shop}.myshopify.com/admin/api/2024-01/webhooks.json" \
  -H "X-Shopify-Access-Token: {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook": {
      "topic": "orders/create",
      "address": "https://your-api.com/webhooks/shopify/orders",
      "format": "json"
    }
  }'
```

### Webhook Payload Verification

```python
import hmac
import hashlib

def verify_webhook(data: bytes, hmac_header: str, secret: str) -> bool:
    """Verify webhook authenticity"""
    digest = hmac.new(
        secret.encode('utf-8'),
        data,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(digest, hmac_header)
```

---

## Error Codes & Troubleshooting

### HTTP Status Codes

| Code | Meaning | Solution |
|------|---------|----------|
| `200` | Success | - |
| `401` | Unauthorized | Check API key, ensure app is installed |
| `403` | Forbidden | Missing required scopes |
| `404` | Not found | Resource doesn't exist |
| `429` | Rate limited | Wait and retry with backoff |
| `500` | Shopify error | Retry or contact Shopify |
| `503` | Service unavailable | Temporary, retry with backoff |

### Common Errors

**Error: `401 Unauthorized`**
```
Cause: Invalid or expired API key
Solution: 
- Verify SHOPIFY_API_KEY is set correctly
- Check if app was uninstalled/reinstalled (token changes)
- Regenerate token in Shopify Admin
```

**Error: `403 Access Denied`**
```
Cause: Missing API scopes
Solution:
- Go to App → Configuration → Admin API access scopes
- Enable read_orders, read_products, read_customers
- Reinstall the app to apply changes
```

**Error: Rate limiting (429)**
```
Cause: Too many requests
Solution:
- The connector has built-in delays
- For custom code, implement retry with exponential backoff
- Use page_info pagination (more efficient than offset)
```

**Error: `Invalid shop domain`**
```
Cause: Malformed shop domain
Solution:
- Use format: mystore.myshopify.com
- Do NOT include https://
- Do NOT include trailing slash
```

---

## Code Examples

### Basic Sync

```python
from shopify_connector import ShopifyConnector

# Initialize connector
connector = ShopifyConnector("mystore.myshopify.com")

# Full sync
stats = connector.sync_all()
print(f"Orders: {stats['orders']}, Products: {stats['products']}")
```

### Incremental Sync

```python
# Sync only orders from last 7 days
from datetime import datetime, timedelta

start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
connector.sync_orders(start_date=start_date)
```

### Direct API Client Usage

```python
from shopify_connector import ShopifyAPIClient, ShopifyConfig

# Configure
config = ShopifyConfig.from_env("mystore.myshopify.com")
client = ShopifyAPIClient(config)

# Fetch orders
for order in client.fetch_orders(created_at_min="2024-01-01"):
    print(f"Order {order['name']}: ${order['total_price']}")
```

### CLI Usage

```bash
# Full sync
python shopify_connector.py --shop mystore.myshopify.com

# Incremental sync (orders only)
python shopify_connector.py --shop mystore.myshopify.com \
  --orders-only \
  --start-date 2024-01-01

# Verbose output with custom config
python shopify_connector.py --shop mystore.myshopify.com \
  --config /path/to/config.json \
  -v
```

### Testing Connection

```python
import requests

def test_shopify_connection(shop_domain: str, api_key: str) -> bool:
    """Test Shopify API connectivity"""
    url = f"https://{shop_domain}/admin/api/2024-01/shop.json"
    headers = {"X-Shopify-Access-Token": api_key}
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        shop_data = response.json()
        print(f"Connected to: {shop_data['shop']['name']}")
        return True
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return False
```

---

## Testing Commands

```bash
# Test connection
curl -H "X-Shopify-Access-Token: $SHOPIFY_API_KEY" \
  "https://$SHOP_DOMAIN/admin/api/2024-01/shop.json"

# List orders
curl -H "X-Shopify-Access-Token: $SHOPIFY_API_KEY" \
  "https://$SHOP_DOMAIN/admin/api/2024-01/orders.json?limit=5"

# List products
curl -H "X-Shopify-Access-Token: $SHOPIFY_API_KEY" \
  "https://$SHOP_DOMAIN/admin/api/2024-01/products.json?limit=5"

# Get specific order
curl -H "X-Shopify-Access-Token: $SHOPIFY_API_KEY" \
  "https://$SHOP_DOMAIN/admin/api/2024-01/orders/{order_id}.json"
```

---

## Data Transformation

### Revenue Calculations

| Field | Formula |
|-------|---------|
| `gross_revenue` | `total_price` from order |
| `refund_amount` | Sum of all refund transactions |
| `net_revenue` | `gross_revenue - refund_amount` |

### BigQuery Schema Mapping

| Shopify Field | BigQuery Column | Type |
|---------------|-----------------|------|
| `id` | `order_id` | STRING |
| `name` | `order_name` | STRING |
| `created_at` | `created_at` | TIMESTAMP |
| `customer.id` | `customer_id` | STRING |
| `total_price` | `total_price` | FLOAT64 |
| `line_items` | `order_items` (separate table) | ARRAY |

---

## Related Files

- **Main Connector:** `/connectors/shopify/shopify_connector.py`
- **Schema SQL:** `/connectors/shopify/schema.sql`
- **Config Example:** `/connectors/shopify/config.example.json`
- **Tests:** `/connectors/shopify/test_connector.py`
