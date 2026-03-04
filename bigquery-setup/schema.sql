-- BigQuery Table Schemas for Rior Systems / Harbor Goods Demo
-- Project: johnboat
-- Dataset: rior_prod

-- =====================================================
-- Table: products
-- Product catalog with COGS information
-- =====================================================
CREATE TABLE IF NOT EXISTS `johnboat.rior_prod.products` (
  product_id STRING NOT NULL,
  sku STRING NOT NULL,
  name STRING NOT NULL,
  description STRING,
  category STRING,
  base_cost DECIMAL(10,2),           -- Manufacturing/wholesale COGS
  shipping_cost DECIMAL(10,2),       -- Average shipping to customer
  packaging_cost DECIMAL(10,2),      -- Box, insert, tape, etc.
  handling_cost DECIMAL(10,2),       -- Fulfillment labor
  return_rate DECIMAL(5,4),          -- Historical return %
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- =====================================================
-- Table: orders
-- Core order header information
-- =====================================================
CREATE TABLE IF NOT EXISTS `johnboat.rior_prod.orders` (
  order_id STRING NOT NULL,
  order_number STRING NOT NULL,
  order_date DATE NOT NULL,
  customer_id STRING NOT NULL,
  
  -- Financials
  gross_revenue DECIMAL(12,2),       -- Subtotal before discounts
  discount_amount DECIMAL(12,2),     -- Coupons, sales
  net_revenue DECIMAL(12,2),         -- After discounts, before refunds
  tax_amount DECIMAL(12,2),
  shipping_revenue DECIMAL(10,2),    -- What customer paid for shipping
  total_refunds DECIMAL(12,2),       -- Total refunds issued
  
  -- Order status
  status STRING,                     -- pending, paid, shipped, delivered, cancelled, refunded
  fulfillment_status STRING,         -- unfulfilled, partial, fulfilled
  
  -- Attribution
  source STRING,                     -- direct, organic, paid_social, paid_search
  utm_source STRING,
  utm_medium STRING,
  utm_campaign STRING,
  
  -- Customer info
  customer_email STRING,
  is_new_customer BOOLEAN,
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- =====================================================
-- Table: order_items
-- Line items per order
-- =====================================================
CREATE TABLE IF NOT EXISTS `johnboat.rior_prod.order_items` (
  order_item_id STRING NOT NULL,
  order_id STRING NOT NULL,
  product_id STRING NOT NULL,
  
  quantity INT64,
  unit_price DECIMAL(10,2),          -- Price per unit at time of sale
  line_total DECIMAL(12,2),          -- quantity * unit_price
  
  discount_amount DECIMAL(10,2),     -- Line-level discount
  net_line_total DECIMAL(12,2),      -- After discount
  
  -- Cost tracking (snapshot at time of order)
  unit_cogs DECIMAL(10,2),           -- Product cost per unit
  unit_shipping_cost DECIMAL(10,2),  -- Shipping cost per unit
  unit_packaging_cost DECIMAL(10,2), -- Packaging per unit
  unit_handling_cost DECIMAL(10,2),  -- Handling per unit
  
  -- Calculated
  total_cogs DECIMAL(12,2),          -- quantity * all unit costs
  
  is_returned BOOLEAN DEFAULT FALSE,
  return_amount DECIMAL(10,2),
  
  created_at TIMESTAMP
);

-- =====================================================
-- Table: costs
-- Additional costs per order/SKU (transaction fees, etc)
-- =====================================================
CREATE TABLE IF NOT EXISTS `johnboat.rior_prod.costs` (
  cost_id STRING NOT NULL,
  order_id STRING NOT NULL,
  product_id STRING,
  
  cost_type STRING NOT NULL,         -- payment_processing, platform_fee, shipping_label, return_label, customs, etc
  cost_category STRING,              -- variable, fixed, operational
  amount DECIMAL(10,2),
  percentage_of_revenue DECIMAL(5,4),-- If calculated as %
  
  description STRING,
  date_applied DATE,
  created_at TIMESTAMP
);

-- =====================================================
-- Table: ad_spend
-- Marketing spend by platform and campaign
-- =====================================================
CREATE TABLE IF NOT EXISTS `johnboat.rior_prod.ad_spend` (
  spend_id STRING NOT NULL,
  date DATE NOT NULL,
  
  platform STRING NOT NULL,          -- meta, google, tiktok, pinterest, snapchat
  account_id STRING,
  account_name STRING,
  campaign_id STRING,
  campaign_name STRING,
  ad_set_id STRING,
  ad_set_name STRING,
  ad_id STRING,
  ad_name STRING,
  
  spend DECIMAL(12,2),
  impressions INT64,
  clicks INT64,
  conversions INT64,
  conversion_value DECIMAL(12,2),
  
  -- Calculated fields (can be computed)
  -- ctr DECIMAL(5,4),               -- clicks / impressions
  -- cpc DECIMAL(10,4),              -- spend / clicks
  -- cpm DECIMAL(10,4),              -- (spend / impressions) * 1000
  -- roas DECIMAL(8,4),              -- conversion_value / spend
  
  utm_source STRING,
  utm_medium STRING,
  utm_campaign STRING,
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- =====================================================
-- Table: metrics_daily
-- Pre-calculated daily metrics for dashboards
-- =====================================================
CREATE TABLE IF NOT EXISTS `johnboat.rior_prod.metrics_daily` (
  date DATE NOT NULL,
  
  -- Revenue metrics
  total_orders INT64,
  total_revenue DECIMAL(12,2),       -- Net revenue
  total_refunds DECIMAL(12,2),
  net_revenue DECIMAL(12,2),         -- After refunds
  
  -- Cost metrics
  total_cogs DECIMAL(12,2),
  total_shipping_costs DECIMAL(12,2),
  total_packaging_costs DECIMAL(12,2),
  total_handling_costs DECIMAL(12,2),
  total_processing_fees DECIMAL(12,2),
  total_ad_spend DECIMAL(12,2),
  total_operating_costs DECIMAL(12,2),
  
  -- Calculated metrics
  gross_profit DECIMAL(12,2),        -- net_revenue - total_cogs
  net_profit DECIMAL(12,2),          -- gross_profit - all other costs
  profit_margin DECIMAL(5,4),        -- net_profit / net_revenue
  
  -- Unit economics
  aov DECIMAL(10,2),                 -- Average order value
  cac DECIMAL(10,2),                 -- Customer acquisition cost
  roas DECIMAL(8,4),                 -- Return on ad spend
  mer DECIMAL(5,4),                  -- Marketing efficiency ratio
  
  -- Customer metrics
  new_customers INT64,
  returning_customers INT64,
  
  -- Product metrics
  units_sold INT64,
  return_rate DECIMAL(5,4),
  
  updated_at TIMESTAMP
);
