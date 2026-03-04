-- =====================================================
-- Test Queries for Rior Systems BigQuery
-- Project: johnboat | Dataset: rior_prod
-- =====================================================

-- 1. NET PROFIT CALCULATION
-- Shows overall profitability across the 90-day period
SELECT 
  SUM(net_revenue) as total_net_revenue,
  SUM(total_cogs) as total_cogs,
  SUM(total_ad_spend) as total_ad_spend,
  SUM(total_processing_fees) as total_processing_fees,
  SUM(total_operating_costs) as total_operating_costs,
  SUM(net_profit) as total_net_profit,
  ROUND(AVG(profit_margin) * 100, 2) as avg_profit_margin_pct
FROM `johnboat.rior_prod.metrics_daily`;

-- 2. ROAS BY CAMPAIGN
-- Return on ad spend for each marketing campaign
SELECT 
  platform,
  campaign_name,
  SUM(spend) as total_spend,
  SUM(conversion_value) as attributed_revenue,
  ROUND(SUM(conversion_value) / NULLIF(SUM(spend), 0), 2) as roas,
  SUM(impressions) as impressions,
  SUM(clicks) as clicks,
  ROUND(SUM(clicks) / NULLIF(SUM(impressions), 0) * 100, 2) as ctr_pct
FROM `johnboat.rior_prod.ad_spend`
GROUP BY platform, campaign_name
ORDER BY roas DESC;

-- 3. PRODUCT PROFITABILITY
-- Which products are most profitable?
SELECT 
  p.name,
  p.sku,
  COUNT(DISTINCT oi.order_id) as orders_with_product,
  SUM(oi.quantity) as units_sold,
  SUM(oi.net_line_total) as gross_revenue,
  SUM(oi.total_cogs) as total_cogs,
  SUM(oi.net_line_total - oi.total_cogs) as gross_profit,
  ROUND(
    (SUM(oi.net_line_total - oi.total_cogs) / NULLIF(SUM(oi.net_line_total), 0)) * 100, 
    2
  ) as gross_margin_pct,
  SUM(CASE WHEN oi.is_returned THEN oi.quantity ELSE 0 END) as returned_units,
  ROUND(
    SUM(CASE WHEN oi.is_returned THEN oi.quantity ELSE 0 END) / 
    NULLIF(SUM(oi.quantity), 0) * 100,
    2
  ) as return_rate_pct
FROM `johnboat.rior_prod.order_items` oi
JOIN `johnboat.rior_prod.products` p ON oi.product_id = p.product_id
GROUP BY p.name, p.sku
ORDER BY gross_profit DESC;

-- 4. DAILY REVENUE TREND
-- Revenue and profit trend over the 90 days
SELECT 
  date,
  total_orders,
  net_revenue,
  total_ad_spend,
  net_profit,
  ROUND(profit_margin * 100, 2) as margin_pct,
  aov,
  roas
FROM `johnboat.rior_prod.metrics_daily`
ORDER BY date;

-- 5. CUSTOMER ACQUISITION COST ANALYSIS
-- CAC trends and new vs returning customer mix
SELECT 
  DATE_TRUNC(date, WEEK) as week,
  SUM(new_customers) as new_customers,
  SUM(returning_customers) as returning_customers,
  SUM(total_ad_spend) as ad_spend,
  ROUND(
    SUM(total_ad_spend) / NULLIF(SUM(new_customers), 0), 
    2
  ) as cac,
  ROUND(
    SUM(new_customers) / NULLIF(SUM(total_orders), 0) * 100,
    2
  ) as new_customer_pct
FROM `johnboat.rior_prod.metrics_daily`
GROUP BY week
ORDER BY week;

-- 6. CHANNEL PERFORMANCE
-- Revenue and profitability by marketing channel
SELECT 
  COALESCE(utm_source, 'direct') as channel,
  COUNT(*) as orders,
  SUM(net_revenue) as revenue,
  AVG(net_revenue) as avg_order_value,
  SUM(total_refunds) as refunds,
  ROUND(SUM(total_refunds) / NULLIF(SUM(net_revenue), 0) * 100, 2) as refund_rate_pct
FROM `johnboat.rior_prod.orders`
GROUP BY channel
ORDER BY revenue DESC;
