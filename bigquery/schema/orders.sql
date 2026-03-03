-- Harbor Goods Co. - Orders Table
-- Stores high-level order information
-- Partitioned by order_date for efficient querying

CREATE TABLE IF NOT EXISTS `harbor_goods.orders` (
    order_id STRING NOT NULL,
    order_number STRING NOT NULL,
    order_date DATE NOT NULL,
    customer_id STRING NOT NULL,
    email STRING,
    
    -- Financials
    gross_revenue NUMERIC(12,2),      -- Total before any deductions
    discounts NUMERIC(12,2),           -- Discounts/coupons applied
    refunds NUMERIC(12,2),             -- Refunds processed
    net_revenue NUMERIC(12,2),         -- gross - discounts - refunds
    taxes_collected NUMERIC(12,2),     -- Sales tax collected
    shipping_revenue NUMERIC(12,2),    -- What customer paid for shipping
    
    -- Status
    financial_status STRING,           -- paid, pending, refunded
    fulfillment_status STRING,         -- fulfilled, unfulfilled, partial
    
    -- Source tracking
    source_name STRING,                -- web, pos, etc.
    referring_site STRING,
    landing_site STRING,
    
    -- UTM parameters for attribution
    utm_source STRING,
    utm_medium STRING,
    utm_campaign STRING,
    utm_content STRING,
    
    -- Metadata
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
PARTITION BY order_date
OPTIONS(description="Harbor Goods Co. orders - partitioned by order date");