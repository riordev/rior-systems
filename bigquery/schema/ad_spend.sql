-- Harbor Goods Co. - Ad Spend Table
-- Daily ad spend by platform and campaign for ROAS calculations
-- Partitioned by date, clustered by platform

CREATE TABLE IF NOT EXISTS `harbor_goods.ad_spend` (
    date DATE NOT NULL,
    platform STRING NOT NULL,          -- meta, google, tiktok, etc.
    campaign_id STRING,
    campaign_name STRING,
    ad_set_id STRING,
    ad_set_name STRING,
    
    -- Spend
    spend NUMERIC(12,2),               -- Amount spent in reporting currency
    currency STRING,                   -- USD, etc.
    
    -- Performance metrics
    impressions INT64,
    clicks INT64,
    conversions INT64,                 -- Platform-reported conversions
    conversion_value NUMERIC(12,2),    -- Platform-reported revenue
    
    -- Calculated metrics (can be computed in queries, but stored for convenience)
    cpm NUMERIC(10,2),                 -- (spend / impressions) * 1000
    cpc NUMERIC(10,2),                 -- spend / clicks
    ctr NUMERIC(5,4),                  -- clicks / impressions
    roas NUMERIC(5,2),                 -- conversion_value / spend
    cpa NUMERIC(10,2),                 -- spend / conversions (cost per acquisition)
    
    -- Attribution window (important for comparison)
    attribution_window STRING,         -- 1d_click, 7d_click, etc.
    
    -- Metadata
    imported_at TIMESTAMP,
    raw_data JSON                      -- Store original API response for debugging
)
PARTITION BY date
CLUSTER BY platform, campaign_name
OPTIONS(description="Harbor Goods Co. daily ad spend by platform and campaign");