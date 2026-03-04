-- ============================================================
-- Rior Systems Looker Studio - Data Model Views
-- Project: johnboat | Dataset: rior_prod
-- ============================================================

-- View: Daily Executive Summary
CREATE OR REPLACE VIEW `johnboat.rior_prod.vw_executive_summary` AS
SELECT
  date,
  SUM(order_total) AS revenue,
  SUM(order_total - cogs) AS gross_profit,
  SUM(order_total - cogs - COALESCE(ad_spend, 0)) AS net_profit,
  SAFE_DIVIDE(SUM(order_total - cogs), SUM(order_total)) * 100 AS profit_margin_pct,
  SAFE_DIVIDE(SUM(order_total), SUM(ad_spend)) AS roas
FROM `johnboat.rior_prod.orders` o
LEFT JOIN (
  SELECT date, SUM(spend) AS ad_spend
  FROM `johnboat.rior_prod.ad_spend`
  GROUP BY date
) a ON o.order_date = a.date
GROUP BY date
ORDER BY date DESC;

-- View: Product Performance
CREATE OR REPLACE VIEW `johnboat.rior_prod.vw_product_performance` AS
SELECT
  p.product_id,
  p.name AS product_name,
  p.category,
  SUM(o.order_total) AS revenue,
  SUM(o.cogs) AS total_cogs,
  SUM(o.order_total - o.cogs) AS gross_profit,
  SAFE_DIVIDE(SUM(o.order_total - o.cogs), SUM(o.order_total)) * 100 AS margin_pct,
  SUM(o.quantity) AS units_sold,
  -- ROAS calculation (join with ad_spend via product attribution)
  SAFE_DIVIDE(SUM(o.order_total), 
    (SELECT SUM(spend) FROM `johnboat.rior_prod.ad_spend` a 
     WHERE a.date BETWEEN MIN(o.order_date) AND MAX(o.order_date))
  ) AS estimated_roas
FROM `johnboat.rior_prod.orders` o
JOIN `johnboat.rior_prod.products` p ON o.product_id = p.product_id
GROUP BY p.product_id, p.name, p.category
ORDER BY revenue DESC;

-- View: Marketing Performance by Platform
CREATE OR REPLACE VIEW `johnboat.rior_prod.vw_marketing_performance` AS
WITH platform_mapping AS (
  SELECT
    *,
    CASE 
      WHEN REGEXP_CONTAINS(UPPER(campaign_name), r'FB|META|INSTAGRAM|IG') THEN 'Meta'
      WHEN REGEXP_CONTAINS(UPPER(campaign_name), r'GOOGLE|GADS|SEARCH|YOUTUBE') THEN 'Google'
      WHEN REGEXP_CONTAINS(UPPER(campaign_name), r'TT|TIKTOK') THEN 'TikTok'
      ELSE 'Other'
    END AS platform
  FROM `johnboat.rior_prod.ad_spend`
)
SELECT
  date,
  platform,
  campaign_name,
  spend,
  impressions,
  clicks,
  conversions,
  SAFE_DIVIDE(clicks, impressions) * 100 AS ctr_pct,
  SAFE_DIVIDE(conversions, clicks) * 100 AS cvr_pct,
  SAFE_DIVIDE(spend, clicks) AS cpc,
  SAFE_DIVIDE(spend, conversions) AS cpa
FROM platform_mapping
ORDER BY date DESC, spend DESC;

-- View: Alerts and Signals
CREATE OR REPLACE VIEW `johnboat.rior_prod.vw_alerts` AS
SELECT
  m.date,
  p.name AS product_name,
  m.signal_type,
  m.signal_message,
  m.roas,
  m.margin,
  m.acknowledged,
  CASE 
    WHEN m.signal_type = 'scale' THEN 1
    WHEN m.signal_type = 'warning' THEN 2
    WHEN m.signal_type = 'critical' THEN 3
    ELSE 4
  END AS severity_order,
  CASE
    WHEN m.acknowledged IS FALSE THEN 'Unacknowledged'
    ELSE 'Acknowledged'
  END AS alert_status
FROM `johnboat.rior_prod.metrics_daily` m
LEFT JOIN `johnboat.rior_prod.products` p ON m.product_id = p.product_id
WHERE m.signal_type IS NOT NULL
ORDER BY 
  m.acknowledged ASC,
  severity_order DESC,
  m.date DESC;

-- View: Time Series for Charts
CREATE OR REPLACE VIEW `johnboat.rior_prod.vw_time_series` AS
SELECT
  o.order_date AS date,
  SUM(o.order_total) AS revenue,
  SUM(o.cogs) AS cogs,
  SUM(o.order_total - o.cogs) AS gross_profit,
  COALESCE(SUM(a.spend), 0) AS ad_spend,
  SUM(o.order_total - o.cogs) - COALESCE(SUM(a.spend), 0) AS net_profit,
  COUNT(DISTINCT o.order_id) AS order_count,
  SUM(o.quantity) AS units_sold
FROM `johnboat.rior_prod.orders` o
LEFT JOIN `johnboat.rior_prod.ad_spend` a ON o.order_date = a.date
GROUP BY o.order_date
ORDER BY date DESC;

-- View: Campaign ROAS Summary
CREATE OR REPLACE VIEW `johnboat.rior_prod.vw_campaign_roas` AS
WITH revenue_attribution AS (
  -- Simple date-based attribution (customize as needed)
  SELECT 
    order_date,
    SUM(order_total) AS daily_revenue
  FROM `johnboat.rior_prod.orders`
  GROUP BY order_date
)
SELECT
  a.date,
  a.campaign_name,
  CASE 
    WHEN REGEXP_CONTAINS(UPPER(a.campaign_name), r'FB|META|INSTAGRAM|IG') THEN 'Meta'
    WHEN REGEXP_CONTAINS(UPPER(a.campaign_name), r'GOOGLE|GADS|SEARCH') THEN 'Google'
    WHEN REGEXP_CONTAINS(UPPER(a.campaign_name), r'TT|TIKTOK') THEN 'TikTok'
    ELSE 'Other'
  END AS platform,
  a.spend,
  r.daily_revenue * SAFE_DIVIDE(a.spend, SUM(a.spend) OVER (PARTITION BY a.date)) AS attributed_revenue,
  SAFE_DIVIDE(
    r.daily_revenue * SAFE_DIVIDE(a.spend, SUM(a.spend) OVER (PARTITION BY a.date)),
    a.spend
  ) AS roas
FROM `johnboat.rior_prod.ad_spend` a
LEFT JOIN revenue_attribution r ON a.date = r.order_date
ORDER BY a.date DESC, a.spend DESC;
