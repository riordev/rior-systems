-- BigQuery Schema for Rior Alert System
-- Run these queries in BigQuery to create required tables

-- Create dataset (if not exists)
CREATE SCHEMA IF NOT EXISTS `{{PROJECT_ID}}.rior_analytics`;

-- Metrics table: Stores daily client performance metrics
CREATE TABLE IF NOT EXISTS `{{PROJECT_ID}}.rior_analytics.client_metrics` (
    date DATE NOT NULL,
    client_id STRING NOT NULL,
    product_id STRING NOT NULL,
    roas FLOAT64,
    ad_spend FLOAT64,
    revenue FLOAT64,
    conversions INT64,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY date
CLUSTER BY client_id, product_id;

-- Alerts table: Stores generated alerts
CREATE TABLE IF NOT EXISTS `{{PROJECT_ID}}.rior_analytics.alerts` (
    id STRING NOT NULL,
    client_id STRING NOT NULL,
    product_id STRING NOT NULL,
    severity STRING NOT NULL,
    message STRING,
    action STRING,
    triggered_at TIMESTAMP NOT NULL,
    acknowledged BOOL DEFAULT FALSE,
    acknowledged_at TIMESTAMP
)
PARTITION BY DATE(triggered_at)
CLUSTER BY client_id, severity;

-- Create indexes for common queries
-- Note: BigQuery automatically indexes clustered columns

-- Sample query to verify setup
-- SELECT * FROM `{{PROJECT_ID}}.rior_analytics.client_metrics` LIMIT 10;
