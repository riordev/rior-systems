# Shopify Admin API Connector

Python connector for syncing Shopify store data to BigQuery.

## Features

- **Full Data Sync**: Orders, order items, products, and refunds
- **Incremental Sync**: Date-based filtering for efficient updates
- **Calculated Metrics**: Gross revenue, refunds, net revenue
- **BigQuery Upserts**: MERGE-based upsert for idempotent loads
- **Pagination**: Handles large datasets (250 records/page)
- **CLI Interface**: Simple command-line tool

## Installation

```bash
cd /workspace/rior-systems/connectors/shopify
pip install -r requirements.txt
```

## Configuration

### Environment Variable (Recommended)

```bash
export SHOPIFY_API_KEY="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
```

### Config File

Copy and edit the example config:

```bash
cp config.example.json config.json
```

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

### BigQuery Setup

Run the schema SQL in BigQuery:

```bash
bq query --use_legacy_sql=false < schema.sql
```

Ensure your service account has BigQuery Data Editor permissions.

## Usage

### Full Sync

```bash
python shopify_connector.py --shop mystore.myshopify.com
```

### Incremental Sync (from date)

```bash
python shopify_connector.py --shop mystore.myshopify.com --start-date 2024-01-01
```

### Sync Only Orders

```bash
python shopify_connector.py --shop mystore.myshopify.com --orders-only --start-date 2024-01-01
```

### Sync Only Products

```bash
python shopify_connector.py --shop mystore.myshopify.com --products-only
```

### Verbose Output

```bash
python shopify_connector.py --shop mystore.myshopify.com -v
```

## API Key Permissions Required

Create a Custom App in Shopify with these permissions:

- `read_orders` - Access order data
- `read_products` - Access product catalog
- `read_customers` - Access customer data

## BigQuery Tables

| Table | Description |
|-------|-------------|
| `rior_prod.orders` | Order headers with revenue metrics |
| `rior_prod.order_items` | Line items per order |
| `rior_prod.products` | Product catalog with pricing |
| `rior_prod.v_daily_revenue` | View: Daily revenue summary |

## Revenue Calculations

- **Gross Revenue**: `total_price` from order
- **Refunds**: Sum of refund transactions
- **Net Revenue**: `gross_revenue - refund_amount`

## Scheduling

For daily syncs, add to crontab:

```bash
0 2 * * * cd /workspace/rior-systems/connectors/shopify && python shopify_connector.py --shop mystore.myshopify.com --start-date $(date -d "yesterday" +\%Y-\%m-\%d) >> /var/log/shopify-sync.log 2>&1
```

## Output Example

```
==================================================
SHOPIFY SYNC COMPLETE
==================================================
Orders loaded:     1,247
Order items loaded: 3,891
Products loaded:   156
==================================================
```
