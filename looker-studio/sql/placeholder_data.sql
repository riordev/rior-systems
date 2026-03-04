-- ============================================================
-- Placeholder Data for Looker Studio Development
-- Run this to populate tables with sample data for testing
-- Project: johnboat | Dataset: rior_prod
-- ============================================================

-- Sample Products
INSERT INTO `johnboat.rior_prod.products` (product_id, name, category, base_cogs)
VALUES
  ('PROD-001', 'Premium Hoodie - Black', 'Apparel', 24.50),
  ('PROD-002', 'Premium Hoodie - Gray', 'Apparel', 24.50),
  ('PROD-003', 'Vintage T-Shirt - White', 'Apparel', 8.75),
  ('PROD-004', 'Vintage T-Shirt - Black', 'Apparel', 8.75),
  ('PROD-005', 'Snapback Cap - Navy', 'Accessories', 6.25),
  ('PROD-006', 'Tote Bag - Canvas', 'Accessories', 4.50),
  ('PROD-007', 'Phone Case - iPhone 15', 'Electronics', 5.00),
  ('PROD-008', 'Wireless Earbuds', 'Electronics', 35.00),
  ('PROD-009', 'Sport Water Bottle', 'Home', 7.50),
  ('PROD-010', 'Yoga Mat - Premium', 'Home', 18.00);

-- Sample Orders (Last 90 days)
INSERT INTO `johnboat.rior_prod.orders` (order_id, product_id, order_date, order_total, cogs, quantity)
VALUES
  -- Recent orders (high volume)
  ('ORD-250301-001', 'PROD-001', '2025-03-01', 89.99, 24.50, 1),
  ('ORD-250301-002', 'PROD-003', '2025-03-01', 34.99, 8.75, 1),
  ('ORD-250301-003', 'PROD-008', '2025-03-01', 129.99, 35.00, 1),
  ('ORD-250301-004', 'PROD-001', '2025-03-01', 179.98, 49.00, 2),
  ('ORD-250301-005', 'PROD-005', '2025-03-01', 29.99, 6.25, 1),
  
  ('ORD-250228-001', 'PROD-002', '2025-02-28', 89.99, 24.50, 1),
  ('ORD-250228-002', 'PROD-004', '2025-02-28', 34.99, 8.75, 1),
  ('ORD-250228-003', 'PROD-007', '2025-02-28', 24.99, 5.00, 1),
  ('ORD-250228-004', 'PROD-003', '2025-02-28', 69.98, 17.50, 2),
  ('ORD-250228-005', 'PROD-010', '2025-02-28', 49.99, 18.00, 1),
  
  ('ORD-250227-001', 'PROD-001', '2025-02-27', 89.99, 24.50, 1),
  ('ORD-250227-002', 'PROD-008', '2025-02-27', 129.99, 35.00, 1),
  ('ORD-250227-003', 'PROD-006', '2025-02-27', 19.99, 4.50, 1),
  ('ORD-250227-004', 'PROD-002', '2025-02-27', 89.99, 24.50, 1),
  ('ORD-250227-005', 'PROD-009', '2025-02-27', 24.99, 7.50, 1),
  
  -- Historical orders (scattered)
  ('ORD-250215-001', 'PROD-001', '2025-02-15', 89.99, 24.50, 1),
  ('ORD-250215-002', 'PROD-003', '2025-02-15', 34.99, 8.75, 1),
  ('ORD-250215-003', 'PROD-005', '2025-02-15', 29.99, 6.25, 1),
  ('ORD-250210-001', 'PROD-008', '2025-02-10', 129.99, 35.00, 1),
  ('ORD-250210-002', 'PROD-010', '2025-02-10', 49.99, 18.00, 1),
  ('ORD-250205-001', 'PROD-002', '2025-02-05', 89.99, 24.50, 1),
  ('ORD-250205-002', 'PROD-004', '2025-02-05', 34.99, 8.75, 1),
  ('ORD-250201-001', 'PROD-007', '2025-02-01', 24.99, 5.00, 1),
  ('ORD-250201-002', 'PROD-001', '2025-02-01', 179.98, 49.00, 2);

-- Sample Ad Spend
INSERT INTO `johnboat.rior_prod.ad_spend` (date, campaign_name, platform, spend, impressions, clicks, conversions)
VALUES
  ('2025-03-01', 'FB_Retargeting_March', 'Meta', 450.00, 45000, 890, 45),
  ('2025-03-01', 'Google_Search_Brand', 'Google', 320.00, 28000, 420, 28),
  ('2025-03-01', 'TT_Viral_Launch', 'TikTok', 280.00, 120000, 2100, 35),
  ('2025-03-01', 'FB_LAL_HighValue', 'Meta', 380.00, 38000, 650, 32),
  
  ('2025-02-28', 'FB_Retargeting_March', 'Meta', 425.00, 42000, 820, 41),
  ('2025-02-28', 'Google_Search_Brand', 'Google', 310.00, 27500, 405, 27),
  ('2025-02-28', 'TT_Viral_Launch', 'TikTok', 290.00, 125000, 2200, 38),
  ('2025-02-28', 'Google_Shopping_All', 'Google', 220.00, 32000, 380, 19),
  
  ('2025-02-27', 'FB_Retargeting_March', 'Meta', 440.00, 43500, 850, 43),
  ('2025-02-27', 'Google_Search_Brand', 'Google', 315.00, 27800, 415, 28),
  ('2025-02-27', 'TT_Viral_Launch', 'TikTok', 275.00, 118000, 2050, 33),
  ('2025-02-27', 'FB_Prospecting_US', 'Meta', 350.00, 52000, 780, 26),
  
  ('2025-02-15', 'FB_Retargeting_Feb', 'Meta', 380.00, 40000, 750, 38),
  ('2025-02-15', 'Google_Search_Generic', 'Google', 290.00, 26000, 380, 22),
  ('2025-02-10', 'FB_Retargeting_Feb', 'Meta', 375.00, 39500, 740, 37),
  ('2025-02-10', 'TT_Test_Campaign', 'TikTok', 200.00, 85000, 1500, 20),
  ('2025-02-05', 'FB_Retargeting_Feb', 'Meta', 365.00, 38000, 710, 35),
  ('2025-02-01', 'Google_Brand_Defense', 'Google', 250.00, 22000, 330, 18);

-- Sample Metrics with Signals
INSERT INTO `johnboat.rior_prod.metrics_daily` (date, product_id, roas, margin, signal_type, signal_message, acknowledged)
VALUES
  -- Scale signals (green)
  ('2025-03-01', 'PROD-001', 4.2, 0.72, 'scale', 'ROAS above 4x - increase budget 20%', FALSE),
  ('2025-03-01', 'PROD-008', 3.8, 0.68, 'scale', 'High margin product trending up', FALSE),
  ('2025-02-28', 'PROD-002', 4.1, 0.70, 'scale', 'Strong performance - scale ready', TRUE),
  
  -- Warning signals (amber)
  ('2025-03-01', 'PROD-003', 2.1, 0.65, 'warning', 'Margin compression detected', FALSE),
  ('2025-02-28', 'PROD-005', 1.8, 0.55, 'warning', 'ROAS below 2x - review targeting', FALSE),
  ('2025-02-27', 'PROD-004', 2.0, 0.60, 'warning', 'Declining conversion rate', TRUE),
  
  -- Critical signals (red)
  ('2025-03-01', 'PROD-006', 0.8, 0.35, 'critical', 'Negative ROAS - pause immediately', FALSE),
  ('2025-02-28', 'PROD-007', 0.9, 0.45, 'critical', 'Ad spend exceeds revenue', FALSE);
