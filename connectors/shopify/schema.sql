-- BigQuery Schema Definitions for Shopify Connector
-- Run these in BigQuery to create the destination tables

-- Orders table
CREATE TABLE IF NOT EXISTS `rior_prod.orders` (
  order_id STRING NOT NULL,
  order_name STRING,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  processed_at TIMESTAMP,
  customer_id STRING,
  customer_email STRING,
  customer_first_name STRING,
  customer_last_name STRING,
  financial_status STRING,
  fulfillment_status STRING,
  currency STRING,
  subtotal_price FLOAT64,
  total_tax FLOAT64,
  total_shipping FLOAT64,
  total_discounts FLOAT64,
  total_price FLOAT64,
  gross_revenue FLOAT64,
  refund_amount FLOAT64,
  net_revenue FLOAT64,
  source_name STRING,
  tags STRING,
  raw_json STRING,
  _loaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(created_at)
CLUSTER BY financial_status, customer_id;

-- Order items table
CREATE TABLE IF NOT EXISTS `rior_prod.order_items` (
  order_id STRING NOT NULL,
  line_item_id STRING NOT NULL,
  variant_id STRING,
  product_id STRING,
  title STRING,
  variant_title STRING,
  quantity INT64,
  price FLOAT64,
  total_discount FLOAT64,
  sku STRING,
  vendor STRING,
  fulfillment_status STRING,
  position INT64,
  _loaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(_loaded_at)
CLUSTER BY order_id, product_id;

-- Products table
CREATE TABLE IF NOT EXISTS `rior_prod.products` (
  product_id STRING NOT NULL,
  title STRING,
  handle STRING,
  body_html STRING,
  vendor STRING,
  product_type STRING,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  published_at TIMESTAMP,
  price FLOAT64,
  cost FLOAT64,
  inventory_quantity INT64,
  tags STRING,
  status STRING,
  raw_json STRING,
  _loaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(updated_at)
CLUSTER BY status, vendor;

-- Create views for common queries
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
