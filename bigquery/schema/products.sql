-- Harbor Goods Co. - Products Table
-- Master product catalog with attributes

CREATE TABLE IF NOT EXISTS `harbor_goods.products` (
    product_id STRING NOT NULL,
    variant_id STRING,
    sku STRING NOT NULL,
    
    -- Product details
    product_name STRING NOT NULL,
    variant_title STRING,
    category STRING,                   -- e.g., "Apparel", "Accessories"
    product_type STRING,               -- e.g., "T-Shirt", "Mug"
    vendor STRING,
    
    -- Pricing
    retail_price NUMERIC(10,2),
    compare_at_price NUMERIC(10,2),    -- Original price if on sale
    
    -- Physical attributes
    weight_grams INT64,
    requires_shipping BOOL,
    
    -- Status
    status STRING,                     -- active, archived, draft
    
    -- SEO/Content
    tags ARRAY<STRING>,
    
    -- Metadata
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
OPTIONS(description="Harbor Goods Co. product catalog");