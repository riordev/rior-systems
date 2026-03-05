# BigQuery Schema Documentation

Complete reference for Rior Systems BigQuery tables and data model.

## Table of Contents

- [Overview](#overview)
- [Table Definitions](#table-definitions)
  - [orders](#orders)
  - [order_items](#order_items)
  - [products](#products)
  - [ad_spend](#ad_spend)
  - [costs](#costs)
  - [metrics_daily](#metrics_daily)
- [Relationships](#relationships)
- [Partitioning & Clustering](#partitioning--clustering)
- [Example Queries](#example-queries)

---

## Overview

The Rior Systems data warehouse uses BigQuery for storing and analyzing e-commerce data. The schema is optimized for profit analytics with denormalized tables for common joins.

**Dataset:** `rior_prod`  
**Project:** Configured per environment (`rior-prod`, `johnboat`, etc.)

### Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Shopify   │────→│  Connector  │────→│   orders    │
│    API      │     │             │     │ order_items │
└─────────────┘     └─────────────┘     │   products  │
                                        └──────┬──────┘
                                               │
┌─────────────┐     ┌─────────────┐           │
│    Meta     │────→│  Connector  │───────────┤
│    API      │     │             │           │
└─────────────┘     └─────────────┘           │
                                              ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Google    │────→│  Connector  │────→│  ad_spend   │
│    Ads      │     │  (planned)  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Table Definitions

### orders

Core order header information with financials and attribution.

**Purpose:** Store high-level order data for revenue analysis

**Location:** `bigquery/schema/orders.sql`

| Column | Type | Mode | Description |
|--------|------|------|-------------|
| `order_id` | STRING | REQUIRED | Unique order identifier (from Shopify) |
| `order_number` | STRING | REQUIRED | Human-readable order number (#1001) |
| `order_date` | DATE | REQUIRED | Order creation date |
| `customer_id` | STRING | REQUIRED | Customer identifier |
| `email` | STRING | NULLABLE | Customer email address |
| `gross_revenue` | NUMERIC | NULLABLE | Total before deductions |
| `discounts` | NUMERIC | NULLABLE | Coupons/sales discounts |
| `refunds` | NUMERIC | NULLABLE | Refunds processed |
| `net_revenue` | NUMERIC | NULLABLE | Gross - discounts - refunds |
| `taxes_collected` | NUMERIC | NULLABLE | Sales tax collected |
| `shipping_revenue` | NUMERIC | NULLABLE | Customer shipping payment |
| `financial_status` | STRING | NULLABLE | paid, pending, refunded |
| `fulfillment_status` | STRING | NULLABLE | fulfilled, unfulfilled, partial |
| `source_name` | STRING | NULLABLE | web, pos, etc. |
| `referring_site` | STRING | NULLABLE | Traffic source URL |
| `landing_site` | STRING | NULLABLE | Entry page URL |
| `utm_source` | STRING | NULLABLE | Attribution source |
| `utm_medium` | STRING | NULLABLE | Attribution medium |
| `utm_campaign` | STRING | NULLABLE | Attribution campaign |
| `utm_content` | STRING | NULLABLE | Attribution content |
| `created_at` | TIMESTAMP | NULLABLE | Record creation time |
| `updated_at` | TIMESTAMP | NULLABLE | Record update time |

**Partitioning:** By `order_date` (daily)

**Optimization:** Queries filtered by date are efficient

---

### order_items

Line items per order for granular profit analysis.

**Purpose:** Store individual product sales within orders

**Location:** `bigquery/schema/order_items.sql`

| Column | Type | Mode | Description |
|--------|------|------|-------------|
| `line_item_id` | STRING | REQUIRED | Unique line item ID |
| `order_id` | STRING | REQUIRED | Foreign key to orders |
| `order_number` | STRING | REQUIRED | Denormalized for convenience |
| `order_date` | DATE | REQUIRED | For partitioning |
| `product_id` | STRING | NULLABLE | Shopify product ID |
| `variant_id` | STRING | NULLABLE | Shopify variant ID |
| `sku` | STRING | REQUIRED | Product SKU |
| `product_name` | STRING | NULLABLE | Product title |
| `variant_title` | STRING | NULLABLE | Variant name |
| `quantity` | INT64 | NULLABLE | Units sold |
| `unit_price` | NUMERIC | NULLABLE | Price per unit |
| `line_total` | NUMERIC | NULLABLE | quantity * unit_price |
| `cogs_per_unit` | NUMERIC | NULLABLE | Cost of goods per unit |
| `shipping_cost_per_unit` | NUMERIC | NULLABLE | Shipping cost per unit |
| `payment_processing_rate` | NUMERIC | NULLABLE | e.g., 0.0299 for 2.99% |
| `payment_processing_fixed` | NUMERIC | NULLABLE | e.g., 0.30 per transaction |
| `total_cogs` | NUMERIC | NULLABLE | quantity * cogs_per_unit |
| `total_shipping_cost` | NUMERIC | NULLABLE | quantity * shipping_cost_per_unit |
| `processing_fees` | NUMERIC | NULLABLE | Calculated processing fees |
| `contribution_margin` | NUMERIC | NULLABLE | line_total - all costs |
| `created_at` | TIMESTAMP | NULLABLE | Record creation time |

**Partitioning:** By `order_date` (daily)

**Clustering:** By `order_id`, `sku` (fast joins)

---

### products

Master product catalog with pricing and attributes.

**Purpose:** Store product information for cost analysis

**Location:** `bigquery/schema/products.sql`

| Column | Type | Mode | Description |
|--------|------|------|-------------|
| `product_id` | STRING | REQUIRED | Shopify product ID |
| `variant_id` | STRING | NULLABLE | Shopify variant ID |
| `sku` | STRING | REQUIRED | Product SKU |
| `product_name` | STRING | REQUIRED | Product title |
| `variant_title` | STRING | NULLABLE | Variant name |
| `category` | STRING | NULLABLE | e.g., "Apparel" |
| `product_type` | STRING | NULLABLE | e.g., "T-Shirt" |
| `vendor` | STRING | NULLABLE | Supplier/manufacturer |
| `retail_price` | NUMERIC | NULLABLE | Current selling price |
| `compare_at_price` | NUMERIC | NULLABLE | Original price if on sale |
| `weight_grams` | INT64 | NULLABLE | Product weight |
| `requires_shipping` | BOOL | NULLABLE | Physical product flag |
| `status` | STRING | NULLABLE | active, archived, draft |
| `tags` | ARRAY<STRING> | NULLABLE | Product tags |
| `created_at` | TIMESTAMP | NULLABLE | First created |
| `updated_at` | TIMESTAMP | NULLABLE | Last updated |

---

### ad_spend

Marketing spend by platform and campaign for ROAS calculations.

**Purpose:** Track advertising costs and performance

**Location:** `bigquery/schema/ad_spend.sql`

| Column | Type | Mode | Description |
|--------|------|------|-------------|
| `date` | DATE | REQUIRED | Reporting date |
| `platform` | STRING | REQUIRED | meta, google, tiktok, etc. |
| `campaign_id` | STRING | NULLABLE | Platform campaign ID |
| `campaign_name` | STRING | NULLABLE | Campaign name |
| `ad_set_id` | STRING | NULLABLE | Ad set ID (Meta) |
| `ad_set_name` | STRING | NULLABLE | Ad set name |
| `spend` | NUMERIC | NULLABLE | Amount spent |
| `currency` | STRING | NULLABLE | USD, etc. |
| `impressions` | INT64 | NULLABLE | Impressions delivered |
| `clicks` | INT64 | NULLABLE | Clicks received |
| `conversions` | INT64 | NULLABLE | Platform conversions |
| `conversion_value` | NUMERIC | NULLABLE | Conversion revenue |
| `cpm` | NUMERIC | NULLABLE | (spend / impressions) * 1000 |
| `cpc` | NUMERIC | NULLABLE | spend / clicks |
| `ctr` | NUMERIC | NULLABLE | clicks / impressions |
| `roas` | NUMERIC | NULLABLE | conversion_value / spend |
| `cpa` | NUMERIC | NULLABLE | spend / conversions |
| `attribution_window` | STRING | NULLABLE | 1d_click, 7d_click, etc. |
| `imported_at` | TIMESTAMP | NULLABLE | Load timestamp |
| `raw_data` | JSON | NULLABLE | Original API response |

**Partitioning:** By `date` (daily)

**Clustering:** By `platform`, `campaign_name`

---

### costs

Additional costs per order/SKU (transaction fees, etc.)

**Purpose:** Track variable costs not captured in COGS

**Location:** `bigquery/schema/costs.sql`

| Column | Type | Mode | Description |
|--------|------|------|-------------|
| `cost_id` | STRING | REQUIRED | Unique cost ID |
| `order_id` | STRING | REQUIRED | Foreign key to orders |
| `product_id` | STRING | NULLABLE | Optional product link |
| `cost_type` | STRING | REQUIRED | payment_processing, platform_fee, etc. |
| `cost_category` | STRING | NULLABLE | variable, fixed, operational |
| `amount` | NUMERIC | NULLABLE | Cost amount |
| `percentage_of_revenue` | NUMERIC | NULLABLE | If calculated as % |
| `description` | STRING | NULLABLE | Cost description |
| `date_applied` | DATE | NULLABLE | When cost incurred |
| `created_at` | TIMESTAMP | NULLABLE | Record creation |

---

### metrics_daily

Pre-calculated daily metrics for dashboards.

**Purpose:** Fast dashboard queries with pre-aggregated data

**Location:** `bigquery/schema/metrics_daily.sql`

| Column | Type | Mode | Description |
|--------|------|------|-------------|
| `date` | DATE | REQUIRED | Metric date |
| `total_orders` | INT64 | NULLABLE | Order count |
| `total_revenue` | NUMERIC | NULLABLE | Net revenue |
| `total_refunds` | NUMERIC | NULLABLE | Refund total |
| `net_revenue` | NUMERIC | NULLABLE | After refunds |
| `total_cogs` | NUMERIC | NULLABLE | Cost of goods sold |
| `total_shipping_costs` | NUMERIC | NULLABLE | Shipping costs |
| `total_packaging_costs` | NUMERIC | NULLABLE | Packaging costs |
| `total_handling_costs` | NUMERIC | NULLABLE | Fulfillment labor |
| `total_processing_fees` | NUMERIC | NULLABLE | Payment processing |
| `total_ad_spend` | NUMERIC | NULLABLE | Marketing spend |
| `total_operating_costs` | NUMERIC | NULLABLE | Other costs |
| `gross_profit` | NUMERIC | NULLABLE | net_revenue - total_cogs |
| `net_profit` | NUMERIC | NULLABLE | gross_profit - other costs |
| `profit_margin` | NUMERIC | NULLABLE | net_profit / net_revenue |
| `aov` | NUMERIC | NULLABLE | Average order value |
| `cac` | NUMERIC | NULLABLE | Customer acquisition cost |
| `roas` | NUMERIC | NULLABLE | Return on ad spend |
| `mer` | NUMERIC | NULLABLE | Marketing efficiency ratio |
| `new_customers` | INT64 | NULLABLE | First-time buyers |
| `returning_customers` | INT64 | NULLABLE | Repeat buyers |
| `units_sold` | INT64 | NULLABLE | Total units |
| `return_rate` | NUMERIC | NULLABLE | Returns / orders |
| `updated_at` | TIMESTAMP | NULLABLE | Last calculation |

---

## Relationships

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐
│   orders    │◄──────┤ order_items │
│  (parent)   │       │  (child)    │
└──────┬──────┘       └──────┬──────┘
       │                     │
       │              ┌──────┴──────┐
       │              │   products  │
       │              │  (joined    │
       │              │   via sku)  │
       │              └─────────────┘
       │
       ▼
┌─────────────┐
│    costs    │
│  (child)    │
└─────────────┘

┌─────────────┐
│  ad_spend   │
│ (independent│
│   per date) │
└─────────────┘
```

### Primary Keys

| Table | Primary Key | Notes |
|-------|-------------|-------|
| `orders` | `order_id` | From Shopify |
| `order_items` | `line_item_id` | From Shopify |
| `products` | `product_id` + `variant_id` | Composite |
| `ad_spend` | `date` + `platform` + `campaign_id` | Composite |
| `costs` | `cost_id` | Generated UUID |
| `metrics_daily` | `date` | One row per day |

### Foreign Keys

| Child Table | Column | Parent Table | Parent Column |
|-------------|--------|--------------|---------------|
| `order_items` | `order_id` | `orders` | `order_id` |
| `order_items` | `sku` | `products` | `sku` |
| `costs` | `order_id` | `orders` | `order_id` |

---

## Partitioning & Clustering

### Why Partition?

Partitioning divides tables into segments based on a column (usually date):

- **Query cost:** Only scan relevant partitions
- **Performance:** Faster queries with date filters
- **Management:** Easier data retention policies

### Partitioned Tables

| Table | Partition Column | Type |
|-------|------------------|------|
| `orders` | `order_date` | Daily |
| `order_items` | `order_date` | Daily |
| `ad_spend` | `date` | Daily |

### Clustered Tables

Clustering sorts data within partitions for faster queries:

| Table | Cluster Columns | Benefit |
|-------|-----------------|---------|
| `orders` | `financial_status`, `customer_id` | Status and customer queries |
| `order_items` | `order_id`, `sku` | Fast order joins |
| `ad_spend` | `platform`, `campaign_name` | Platform/campaign analysis |

### Query Optimization

**Good (uses partition):**
```sql
SELECT * FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31'
```

**Bad (full table scan):**
```sql
SELECT * FROM orders
WHERE EXTRACT(YEAR FROM order_date) = 2024
```

---

## Example Queries

### Revenue Summary (Last 30 Days)

```sql
SELECT
  DATE(created_at) as date,
  COUNT(DISTINCT order_id) as orders,
  SUM(gross_revenue) as gross_revenue,
  SUM(refund_amount) as refunds,
  SUM(net_revenue) as net_revenue,
  AVG(net_revenue) as aov
FROM `rior_prod.orders`
WHERE order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY 1
ORDER BY 1 DESC;
```

### Profit by Product (Last 7 Days)

```sql
SELECT
  oi.sku,
  p.product_name,
  SUM(oi.quantity) as units_sold,
  SUM(oi.line_total) as revenue,
  SUM(oi.total_cogs) as cogs,
  SUM(oi.contribution_margin) as contribution_margin,
  SAFE_DIVIDE(SUM(oi.contribution_margin), SUM(oi.line_total)) as margin_pct
FROM `rior_prod.order_items` oi
LEFT JOIN `rior_prod.products` p
  ON oi.sku = p.sku
WHERE oi.order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
GROUP BY 1, 2
ORDER BY contribution_margin DESC
LIMIT 20;
```

### Daily ROAS by Platform

```sql
WITH daily_revenue AS (
  SELECT
    order_date as date,
    SUM(net_revenue) as revenue
  FROM `rior_prod.orders`
  GROUP BY 1
),
daily_spend AS (
  SELECT
    date,
    platform,
    SUM(spend) as spend
  FROM `rior_prod.ad_spend`
  GROUP BY 1, 2
)
SELECT
  s.date,
  s.platform,
  s.spend,
  r.revenue,
  SAFE_DIVIDE(r.revenue, s.spend) as roas
FROM daily_spend s
LEFT JOIN daily_revenue r
  ON s.date = r.date
ORDER BY s.date DESC, s.platform;
```

### Customer Cohort Analysis

```sql
SELECT
  DATE_TRUNC(first_order_date, MONTH) as cohort_month,
  COUNT(DISTINCT customer_id) as customers,
  AVG(lifetime_value) as avg_ltv
FROM (
  SELECT
    customer_id,
    MIN(order_date) as first_order_date,
    SUM(net_revenue) as lifetime_value
  FROM `rior_prod.orders`
  GROUP BY 1
)
GROUP BY 1
ORDER BY 1;
```

### Ad Performance with Attribution

```sql
SELECT
  date,
  campaign_name,
  spend,
  impressions,
  clicks,
  conversions,
  SAFE_DIVIDE(clicks, impressions) as ctr,
  SAFE_DIVIDE(spend, clicks) as cpc,
  SAFE_DIVIDE(conversion_value, spend) as roas
FROM `rior_prod.ad_spend`
WHERE platform = 'meta'
  AND date >= '2024-01-01'
ORDER BY spend DESC
LIMIT 50;
```

### Complete Profit & Loss (MTD)

```sql
SELECT
  SUM(o.net_revenue) as net_revenue,
  SUM(oi.total_cogs) as cogs,
  SUM(oi.total_shipping_cost) as shipping_costs,
  SUM(oi.processing_fees) as processing_fees,
  SUM(a.spend) as ad_spend,
  SUM(o.net_revenue) - SUM(oi.total_cogs) as gross_profit,
  SUM(o.net_revenue) - SUM(oi.total_cogs) - SUM(oi.total_shipping_cost) 
    - SUM(oi.processing_fees) - SUM(a.spend) as net_profit
FROM `rior_prod.orders` o
LEFT JOIN (
  SELECT order_id, SUM(total_cogs) as total_cogs,
    SUM(total_shipping_cost) as total_shipping_cost,
    SUM(processing_fees) as processing_fees
  FROM `rior_prod.order_items`
  GROUP BY 1
) oi ON o.order_id = oi.order_id
LEFT JOIN `rior_prod.ad_spend` a
  ON o.order_date = a.date
WHERE o.order_date >= DATE_TRUNC(CURRENT_DATE(), MONTH);
```

---

## Schema SQL Files

| Table | File |
|-------|------|
| `orders` | `bigquery/schema/orders.sql` |
| `order_items` | `bigquery/schema/order_items.sql` |
| `products` | `bigquery/schema/products.sql` |
| `ad_spend` | `bigquery/schema/ad_spend.sql` |
| `costs` | `bigquery/schema/costs.sql` |
| `metrics_daily` | `bigquery/schema/metrics_daily.sql` |

---

## Additional Views

### v_daily_revenue (Shopify Connector)

```sql
CREATE OR REPLACE VIEW `rior_prod.v_daily_revenue` AS
SELECT
  DATE(created_at) as order_date,
  COUNT(DISTINCT order_id) as order_count,
  SUM(gross_revenue) as gross_revenue,
  SUM(refund_amount) as total_refunds,
  SUM(net_revenue) as net_revenue,
  AVG(net_revenue) as aov
FROM `rior_prod.orders`
WHERE created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 90 DAY)
GROUP BY 1
ORDER BY 1 DESC;
```

### looker-studio/bigquery_views.sql

Additional views for Looker Studio dashboards are in:
`looker-studio/sql/bigquery_views.sql`
