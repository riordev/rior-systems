-- Shopify Attribution App - Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Shops table (connected Shopify stores)
CREATE TABLE shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_domain VARCHAR(255) UNIQUE NOT NULL,
    access_token TEXT NOT NULL,
    scope TEXT,
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    plan_name VARCHAR(50) DEFAULT 'free',
    uninstall_at TIMESTAMP
);

-- Attribution models enum
CREATE TYPE attribution_model AS ENUM ('first_click', 'last_click', 'linear', 'time_decay', 'data_driven');

-- Touchpoints table (customer journey touchpoints)
CREATE TABLE touchpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    customer_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255),
    order_id VARCHAR(255),
    
    -- Touchpoint details
    source VARCHAR(100) NOT NULL,
    medium VARCHAR(100),
    campaign VARCHAR(255),
    content VARCHAR(255),
    term VARCHAR(255),
    
    -- Channel categorization
    channel VARCHAR(50) NOT NULL, -- meta, google, tiktok, email, organic, direct, referral
    
    -- UTM parameters
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    utm_term VARCHAR(255),
    
    -- Touchpoint metadata
    landing_page TEXT,
    referrer TEXT,
    device_type VARCHAR(20),
    browser VARCHAR(50),
    country VARCHAR(2),
    
    -- Revenue tracking
    revenue DECIMAL(12,2),
    attributed_revenue DECIMAL(12,2),
    
    -- Timing
    touched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Index for faster queries
    INDEX idx_touchpoints_shop_customer (shop_id, customer_id),
    INDEX idx_touchpoints_shop_channel (shop_id, channel),
    INDEX idx_touchpoints_touched_at (touched_at),
    INDEX idx_touchpoints_order (order_id)
);

-- Customer journeys table
CREATE TABLE customer_journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    customer_id VARCHAR(255) NOT NULL,
    first_touch_at TIMESTAMP,
    last_touch_at TIMESTAMP,
    touchpoint_count INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    converted BOOLEAN DEFAULT false,
    conversion_order_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_journeys_shop_customer (shop_id, customer_id),
    INDEX idx_journeys_converted (converted)
);

-- Attribution results table
CREATE TABLE attribution_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    order_id VARCHAR(255) NOT NULL,
    customer_id VARCHAR(255) NOT NULL,
    attribution_model attribution_model NOT NULL,
    
    -- Channel breakdown (JSON for flexibility)
    channel_attribution JSONB NOT NULL,
    
    -- Total order value
    total_revenue DECIMAL(12,2) NOT NULL,
    
    -- Journey summary
    journey_length INTEGER,
    time_to_conversion_hours INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_attribution_shop_order (shop_id, order_id),
    INDEX idx_attribution_model (attribution_model),
    INDEX idx_attribution_created (created_at)
);

-- Daily aggregated stats
CREATE TABLE daily_channel_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    channel VARCHAR(50) NOT NULL,
    
    -- Attribution model specific
    attribution_model attribution_model NOT NULL,
    
    -- Metrics
    touchpoints INTEGER DEFAULT 0,
    unique_customers INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    attributed_revenue DECIMAL(12,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(shop_id, date, channel, attribution_model),
    INDEX idx_daily_stats_shop_date (shop_id, date)
);

-- Tracking pixels/webhooks log
CREATE TABLE tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- pageview, add_to_cart, checkout, purchase
    customer_id VARCHAR(255),
    session_id VARCHAR(255),
    
    -- Raw payload
    payload JSONB,
    
    -- Parsed UTM data
    utm_data JSONB,
    
    -- Headers
    user_agent TEXT,
    ip_address INET,
    
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_tracking_shop_event (shop_id, event_type),
    INDEX idx_tracking_received (received_at)
);

-- Settings per shop
CREATE TABLE shop_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    default_attribution_model attribution_model DEFAULT 'last_click',
    attribution_window_days INTEGER DEFAULT 30,
    
    -- Data retention
    data_retention_days INTEGER DEFAULT 365,
    
    -- Feature flags
    enable_data_driven BOOLEAN DEFAULT false,
    enable_email_tracking BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(shop_id)
);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_journeys_updated_at BEFORE UPDATE ON customer_journeys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_stats_updated_at BEFORE UPDATE ON daily_channel_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shop_settings_updated_at BEFORE UPDATE ON shop_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
