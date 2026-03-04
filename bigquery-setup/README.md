# BigQuery Setup - Rior Systems

Complete BigQuery infrastructure for Harbor Goods profit intelligence system.

## 📊 Project Overview

| Property | Value |
|----------|-------|
| **GCP Project** | `johnboat` |
| **Dataset** | `rior_prod` |
| **Location** | US |
| **Data Period** | 90 days (Dec 1, 2024 - Feb 28, 2025) |
| **Demo Revenue** | $286,654.96 |
| **Demo Net Profit** | $70,307.14 |
| **Demo Margin** | 24.43% |

---

## 🔌 Connection Instructions

### Using Google Cloud Console
1. Navigate to [BigQuery Console](https://console.cloud.google.com/bigquery)
2. Select project `johnboat`
3. Dataset `rior_prod` will be visible in the explorer

### Using bq CLI
```bash
# Authenticate
gcloud auth activate-service-account --key-file=/Users/johnbot/.openclaw/gcp-service-account.json
gcloud config set project johnboat

# List tables
bq ls johnboat:rior_prod

# Query data
bq query --use_legacy_sql=false 'SELECT * FROM `johnboat.rior_prod.metrics_daily` LIMIT 10'
```

### Using Python (google-cloud-bigquery)
```python
from google.cloud import bigquery
from google.oauth2 import service_account

# Load credentials
credentials = service_account.Credentials.from_service_account_file(
    '/Users/johnbot/.openclaw/gcp-service-account.json'
)

# Create client
client = bigquery.Client(
    project='johnboat',
    credentials=credentials
)

# Query
dataset_ref = client.dataset('rior_prod')
```

### Connection String for BI Tools
```
Project ID: johnboat
Dataset: rior_prod
Location: US
```

---

## 📋 Schema Reference

### `products`
Product catalog with COGS breakdown.

| Column | Type | Description |
|--------|------|-------------|
| product_id | STRING | Primary key |
| sku | STRING | Stock keeping unit |
| name | STRING | Product name |
| description | STRING | Product description |
| category | STRING | Product category |
| base_cost | DECIMAL | Manufacturing/wholesale COGS |
| shipping_cost | DECIMAL | Avg shipping to customer |
| packaging_cost | DECIMAL | Box, insert materials |
| handling_cost | DECIMAL | Fulfillment labor |
| return_rate | DECIMAL | Historical return % |
| is_active | BOOLEAN | Active status |

**Sample Products:**
- HG-CER-VASE-001: Handcrafted Ceramic Vase ($89)
- HG-TEX-THRW-002: Organic Cotton Throw Blanket ($129)
- HG-WOD-CUTB-003: Walnut Cutting Board ($79)

---

### `orders`
Core order header data.

| Column | Type | Description |
|--------|------|-------------|
| order_id | STRING | Primary key |
| order_number | STRING | Human-readable order ID |
| order_date | DATE | Order date |
| customer_id | STRING | Customer reference |
| gross_revenue | DECIMAL | Subtotal before discounts |
| discount_amount | DECIMAL | Coupons, sales |
| net_revenue | DECIMAL | After discounts |
| tax_amount | DECIMAL | Tax collected |
| shipping_revenue | DECIMAL | Shipping charged |
| total_refunds | DECIMAL | Refunds issued |
| status | STRING | pending, paid, shipped, etc |
| source | STRING | direct, organic, paid_social |
| utm_source | STRING | Attribution source |
| utm_campaign | STRING | Campaign name |
| is_new_customer | BOOLEAN | First-time buyer |

---

### `order_items`
Line items per order with cost snapshot.

| Column | Type | Description |
|--------|------|-------------|
| order_item_id | STRING | Primary key |
| order_id | STRING | Foreign key to orders |
| product_id | STRING | Foreign key to products |
| quantity | INTEGER | Units ordered |
| unit_price | DECIMAL | Price at time of sale |
| line_total | DECIMAL | quantity × unit_price |
| discount_amount | DECIMAL | Line-level discount |
| net_line_total | DECIMAL | After discount |
| unit_cogs | DECIMAL | Product cost per unit |
| unit_shipping_cost | DECIMAL | Shipping cost per unit |
| unit_packaging_cost | DECIMAL | Packaging per unit |
| unit_handling_cost | DECIMAL | Handling per unit |
| total_cogs | DECIMAL | Sum of all unit costs × qty |
| is_returned | BOOLEAN | Return status |
| return_amount | DECIMAL | Refund amount |

---

### `costs`
Additional per-order costs.

| Column | Type | Description |
|--------|------|-------------|
| cost_id | STRING | Primary key |
| order_id | STRING | Foreign key |
| product_id | STRING | Optional product reference |
| cost_type | STRING | payment_processing, platform_fee |
| cost_category | STRING | variable, fixed, operational |
| amount | DECIMAL | Cost amount |
| percentage_of_revenue | DECIMAL | If % based |
| description | STRING | Details |
| date_applied | DATE | When cost recorded |

---

### `ad_spend`
Marketing spend by platform and campaign.

| Column | Type | Description |
|--------|------|-------------|
| spend_id | STRING | Primary key |
| date | DATE | Spend date |
| platform | STRING | meta, google, tiktok, pinterest |
| account_id | STRING | Ad account |
| campaign_id | STRING | Campaign ID |
| campaign_name | STRING | Campaign name |
| spend | DECIMAL | Amount spent |
| impressions | INTEGER | Impressions |
| clicks | INTEGER | Clicks |
| conversions | INTEGER | Conversions |
| conversion_value | DECIMAL | Attributed revenue |
| utm_source | STRING | Tracking source |
| utm_campaign | STRING | Tracking campaign |

---

### `metrics_daily`
Pre-calculated daily KPIs.

| Column | Type | Description |
|--------|------|-------------|
| date | DATE | Date |
| total_orders | INTEGER | Order count |
| total_revenue | DECIMAL | Gross revenue |
| total_refunds | DECIMAL | Refunds |
| net_revenue | DECIMAL | Revenue after refunds |
| total_cogs | DECIMAL | Cost of goods |
| total_shipping_costs | DECIMAL | Shipping costs |
| total_packaging_costs | DECIMAL | Packaging costs |
| total_handling_costs | DECIMAL | Handling costs |
| total_processing_fees | DECIMAL | Payment fees |
| total_ad_spend | DECIMAL | Marketing spend |
| total_operating_costs | DECIMAL | Other ops costs |
| gross_profit | DECIMAL | net_revenue - cogs |
| net_profit | DECIMAL | gross_profit - costs |
| profit_margin | DECIMAL | net_profit / net_revenue |
| aov | DECIMAL | Average order value |
| cac | DECIMAL | Customer acquisition cost |
| roas | DECIMAL | Return on ad spend |
| mer | DECIMAL | Marketing efficiency ratio |
| new_customers | INTEGER | First-time buyers |
| returning_customers | INTEGER | Repeat buyers |
| units_sold | INTEGER | Units sold |
| return_rate | DECIMAL | Return percentage |

---

## 🔍 Sample Queries

### Net Profit Overview
```sql
SELECT 
  SUM(net_revenue) as total_net_revenue,
  SUM(total_cogs) as total_cogs,
  SUM(total_ad_spend) as total_ad_spend,
  SUM(net_profit) as total_net_profit,
  ROUND(AVG(profit_margin) * 100, 2) as margin_pct
FROM `johnboat.rior_prod.metrics_daily`;
```

### ROAS by Campaign
```sql
SELECT 
  platform,
  campaign_name,
  ROUND(SUM(spend), 2) as total_spend,
  ROUND(SUM(conversion_value), 2) as revenue,
  ROUND(SUM(conversion_value) / NULLIF(SUM(spend), 0), 2) as roas
FROM `johnboat.rior_prod.ad_spend`
GROUP BY platform, campaign_name
ORDER BY roas DESC;
```

### Product Profitability
```sql
SELECT 
  p.name,
  p.sku,
  SUM(oi.quantity) as units_sold,
  ROUND(SUM(oi.net_line_total), 2) as revenue,
  ROUND(SUM(oi.total_cogs), 2) as cogs,
  ROUND(SUM(oi.net_line_total - oi.total_cogs), 2) as gross_profit,
  ROUND(
    (SUM(oi.net_line_total - oi.total_cogs) / NULLIF(SUM(oi.net_line_total), 0)) * 100, 
    2
  ) as margin_pct
FROM `johnboat.rior_prod.order_items` oi
JOIN `johnboat.rior_prod.products` p ON oi.product_id = p.product_id
GROUP BY p.name, p.sku
ORDER BY gross_profit DESC;
```

### Daily Revenue Trend
```sql
SELECT 
  date,
  total_orders,
  net_revenue,
  net_profit,
  ROUND(profit_margin * 100, 2) as margin_pct,
  aov,
  roas
FROM `johnboat.rior_prod.metrics_daily`
ORDER BY date;
```

### Customer Acquisition Analysis
```sql
SELECT 
  DATE_TRUNC(date, WEEK) as week,
  SUM(new_customers) as new_customers,
  SUM(returning_customers) as returning_customers,
  ROUND(
    SUM(total_ad_spend) / NULLIF(SUM(new_customers), 0), 
    2
  ) as cac
FROM `johnboat.rior_prod.metrics_daily`
GROUP BY week
ORDER BY week;
```

### Channel Performance
```sql
SELECT 
  COALESCE(utm_source, 'direct') as channel,
  COUNT(*) as orders,
  SUM(net_revenue) as revenue,
  AVG(net_revenue) as aov,
  SUM(total_refunds) as refunds
FROM `johnboat.rior_prod.orders`
GROUP BY channel
ORDER BY revenue DESC;
```

---

## 📁 File Structure

```
/workspace/rior-systems/bigquery-setup/
├── README.md              # This file
├── schema.sql             # Table creation DDL
├── test_queries.sql       # Validation queries
├── generate_data.py       # Data generation script
├── products.json          # Product catalog data
├── orders.json            # Order header data
├── order_items.json       # Line item data
├── costs.json             # Cost data
├── ad_spend.json          # Ad spend data
└── metrics_daily.json     # Daily metrics
```

---

## 🎯 Key Metrics Summary

| Metric | Value |
|--------|-------|
| Total Orders | 1,575 |
| Total Revenue | $286,654.96 |
| Net Profit | $70,307.14 |
| Profit Margin | 24.43% |
| AOV | $182.16 |
| Ad Spend | $77,031.53 |
| ROAS (Blended) | 3.29 |
| Best Campaign | Google Search (3.31 ROAS) |
| Top Product | Organic Cotton Throw |
| Best Margin | Throw Blanket (65.86%) |

---

## 🔐 Security Notes

- Service account: `rior-systems-prod@johnboat.iam.gserviceaccount.com`
- Credentials file: `/Users/johnbot/.openclaw/gcp-service-account.json`
- Dataset access controlled via IAM
- Keep credentials secure and rotate regularly

---

## 🚀 Next Steps

1. Connect BI tool (Looker, Tableau, or Data Studio)
2. Set up scheduled queries for daily metric refresh
3. Create dashboards for real-time monitoring
4. Add alerting for margin or ROAS thresholds
