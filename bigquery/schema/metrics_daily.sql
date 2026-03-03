-- Harbor Goods Co. - Daily Metrics Table
-- Pre-calculated daily KPIs for dashboards and reporting
-- Materialized view or daily ETL output

CREATE TABLE IF NOT EXISTS `harbor_goods.metrics_daily` (
    date DATE NOT NULL,
    
    -- Revenue metrics
    total_orders INT64,
    total_units_sold INT64,
    gross_revenue NUMERIC(12,2),
    discounts NUMERIC(12,2),
    refunds NUMERIC(12,2),
    net_revenue NUMERIC(12,2),
    aov NUMERIC(10,2),                 -- Average Order Value
    
    -- Cost breakdown
    total_cogs NUMERIC(12,2),
    total_shipping_cost NUMERIC(12,2),
    total_payment_fees NUMERIC(12,2),
    total_ad_spend NUMERIC(12,2),
    
    -- Profit metrics
    gross_profit NUMERIC(12,2),        -- net_revenue - cogs - shipping - payment_fees
    gross_margin_pct NUMERIC(5,4),     -- gross_profit / net_revenue
    
    contribution_margin NUMERIC(12,2), -- gross_profit - ad_spend
    contribution_margin_pct NUMERIC(5,4),
    
    net_profit NUMERIC(12,2),          -- After all variable costs
    net_margin_pct NUMERIC(5,4),
    
    -- Marketing metrics
    meta_spend NUMERIC(12,2),
    google_spend NUMERIC(12,2),
    total_spend NUMERIC(12,2),
    
    -- Blended metrics (all channels combined)
    blended_cac NUMERIC(10,2),         -- total_spend / new_customers
    blended_roas NUMERIC(5,2),         -- net_revenue / total_spend
    
    -- Per-SKU breakdown (repeated field for detailed analysis)
    sku_performance ARRAY<STRUCT<
        sku STRING,
        units_sold INT64,
        revenue NUMERIC(12,2),
        cogs NUMERIC(12,2),
        contribution_margin NUMERIC(12,2)
    >>,
    
    -- Break-even analysis
    break_even_roas NUMERIC(5,2),      -- 1 / contribution_margin_pct
    break_even_cac NUMERIC(10,2),      -- Target CAC for profitability
    
    -- Target vs Actual
    target_roas NUMERIC(5,2),          -- Campaign target ROAS
    roas_vs_target NUMERIC(5,2),       -- Actual ROAS / Target ROAS
    
    -- Metadata
    calculated_at TIMESTAMP,
    data_version STRING
)
PARTITION BY date
OPTIONS(description="Harbor Goods Co. daily metrics - pre-calculated for dashboards");