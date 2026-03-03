-- Harbor Goods Co. - Order Items Table
-- Line items per order for granular profit analysis
-- Clustered by order_id for join performance

CREATE TABLE IF NOT EXISTS `harbor_goods.order_items` (
    line_item_id STRING NOT NULL,
    order_id STRING NOT NULL,          -- Foreign key to orders
    order_number STRING NOT NULL,
    order_date DATE NOT NULL,
    
    -- Product info
    product_id STRING,
    variant_id STRING,
    sku STRING NOT NULL,
    product_name STRING,
    variant_title STRING,
    
    -- Quantity and pricing
    quantity INT64,
    unit_price NUMERIC(10,2),          -- Price per unit
    line_total NUMERIC(12,2),          -- quantity * unit_price
    
    -- Costs (will be joined from costs table, but denormalized for convenience)
    cogs_per_unit NUMERIC(10,2),       -- Cost of goods sold per unit
    shipping_cost_per_unit NUMERIC(10,2),
    payment_processing_rate NUMERIC(5,4), -- e.g., 0.0299 for 2.99%
    payment_processing_fixed NUMERIC(5,2), -- e.g., 0.30 per transaction
    
    -- Calculated costs per line item
    total_cogs NUMERIC(12,2),          -- quantity * cogs_per_unit
    total_shipping_cost NUMERIC(12,2), -- quantity * shipping_cost_per_unit
    processing_fees NUMERIC(12,2),     -- Calculated based on payment processor
    
    -- Profit contribution
    contribution_margin NUMERIC(12,2), -- line_total - all costs
    
    -- Metadata
    created_at TIMESTAMP
)
PARTITION BY order_date
CLUSTER BY order_id, sku
OPTIONS(description="Harbor Goods Co. order line items - clustered by order_id and sku");