-- Harbor Goods Co. - Costs Table
-- COGS, shipping, and processing fee structure per SKU
-- Critical for accurate profit calculations

CREATE TABLE IF NOT EXISTS `harbor_goods.costs` (
    sku STRING NOT NULL,
    effective_date DATE NOT NULL,      -- When these costs became effective
    
    -- Cost of Goods Sold components
    manufacturing_cost NUMERIC(10,2),  -- Production/purchase cost per unit
    packaging_cost NUMERIC(10,2),      -- Box, tissue, insert cost per unit
    fulfillment_cost NUMERIC(10,2),    -- Pick/pack fee per unit
    
    -- Derived COGS
    cogs_per_unit NUMERIC(10,2),       -- Sum of above
    cogs_percentage NUMERIC(5,4),      -- cogs_per_unit / retail_price (target ~35%)
    
    -- Shipping costs (what merchant pays to ship to customer)
    shipping_cost_domestic NUMERIC(10,2),
    shipping_cost_international NUMERIC(10,2),
    free_shipping_threshold NUMERIC(10,2), -- Orders over this get free shipping
    
    -- Payment processing (varies by processor)
    stripe_rate NUMERIC(5,4),          -- 0.029 for 2.9%
    stripe_fixed NUMERIC(5,2),         -- 0.30
    shopify_payments_rate NUMERIC(5,4), -- Often same as Stripe
    shopify_payments_fixed NUMERIC(5,2),
    paypal_rate NUMERIC(5,4),
    paypal_fixed NUMERIC(5,2),
    
    -- Overhead allocation (optional)
    overhead_percentage NUMERIC(5,4),  -- e.g., 0.05 for 5% overhead allocation
    
    -- Metadata
    notes STRING,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
OPTIONS(description="Harbor Goods Co. cost structure by SKU - basis for profit calculations");