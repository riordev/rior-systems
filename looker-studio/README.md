# Rior Systems Looker Studio Dashboard

## Overview
Executive-grade profit intelligence dashboard for Shopify brands. Real-time visibility into revenue, profit margins, ROAS, and automated signals.

---

## Quick Start

### 1. Create the Report
1. Go to [Looker Studio](https://lookerstudio.google.com)
2. Click **Create > Report**
3. Select **BigQuery** as data source
4. Choose **Project**: `johnboat`
5. Choose **Dataset**: `rior_prod`
6. Select tables: `orders`, `products`, `ad_spend`, `metrics_daily`

### 2. Copy Report Template
If you have access to the shared template:
- File > Make a copy
- Update data sources to your BigQuery connection

---

## Dashboard Structure

### Page 1: Executive Summary
**Purpose:** C-suite KPIs at a glance

**Components:**
| Tile | Metric | Calculation |
|------|--------|-------------|
| 💰 Revenue | Total Revenue | `SUM(order_total)` |
| 📈 Net Profit | Profit after COGS & Ad Spend | `SUM(revenue - cogs - ad_spend)` |
| 🎯 Profit Margin | % Margin | `(Net Profit / Revenue) * 100` |
| 🚀 ROAS | Return on Ad Spend | `Revenue / Ad Spend` |

**Filters:**
- Date Range: Last 7/30/90 days dropdown
- Compare to: Previous period toggle

---

### Page 2: Product Performance
**Purpose:** Identify winners and losers

**Components:**
- **Table:** Product name, Revenue, COGS, Margin %, ROAS, Signal badge
- **Bar Chart:** Revenue by product (top 10)
- **Sparkline:** Margin trend (30-day rolling)

**Key Fields:**
```
Product: products.name
Revenue: orders.product_revenue
COGS: orders.cogs
Margin: (revenue - cogs) / revenue
Signal: metrics_daily.signal_type
```

---

### Page 3: Marketing Performance
**Purpose:** Channel and campaign optimization

**Components:**
- **Line Chart:** Spend vs Revenue (time series)
- **Bar Chart:** ROAS by campaign (sorted desc)
- **Pie Chart:** Spend distribution by platform

**Platform Mapping:**
```
Meta → campaign_name CONTAINS 'FB' OR 'IG' OR 'META'
Google → campaign_name CONTAINS 'GOOGLE' OR 'GADS' OR 'SEARCH'
TikTok → campaign_name CONTAINS 'TT' OR 'TIKTOK'
```

---

### Page 4: Alerts & Signals
**Purpose:** Actionable intelligence feed

**Components:**
- **Scorecard:** Unacknowledged alerts count
- **Table:** Recent alerts (timestamp, severity, message, action)
- **Color Coding:**
  - 🟢 Scale signals (opportunity)
  - 🟡 Warnings (attention needed)
  - 🔴 Critical (immediate action)

---

## Design Specifications

### Color Palette
```
Background: #0D1117 (dark)
Card Background: #161B22
Text Primary: #E6EDF3
Text Secondary: #8B949E

Accent Blue: #58A6FF (primary actions)
Accent Green: #238636 (positive/signals)
Accent Amber: #D29922 (warnings)
Accent Red: #DA3633 (critical)
```

### Typography
- **Titles:** 24px, weight 600, #E6EDF3
- **Metrics:** 48px, weight 700, #E6EDF3
- **Labels:** 12px, weight 400, #8B949E
- **Table Text:** 14px, weight 400

### Layout
- Grid: 12-column system
- Gutter: 16px
- Card padding: 24px
- Border radius: 8px
- Card border: 1px solid #30363D

---

## Data Sources

### BigQuery Tables

#### `orders`
| Field | Type | Description |
|-------|------|-------------|
| order_id | STRING | Unique order identifier |
| product_id | STRING | Reference to products |
| order_date | DATE | Transaction date |
| order_total | FLOAT | Total revenue |
| cogs | FLOAT | Cost of goods sold |
| quantity | INTEGER | Units sold |

#### `products`
| Field | Type | Description |
|-------|------|-------------|
| product_id | STRING | Unique product identifier |
| name | STRING | Product name |
| category | STRING | Product category |
| base_cogs | FLOAT | Base cost per unit |

#### `ad_spend`
| Field | Type | Description |
|-------|------|-------------|
| date | DATE | Spend date |
| campaign_name | STRING | Campaign identifier |
| platform | STRING | Meta/Google/TikTok |
| spend | FLOAT | Ad spend amount |
| impressions | INTEGER | Impressions |
| clicks | INTEGER | Clicks |
| conversions | INTEGER | Conversion count |

#### `metrics_daily`
| Field | Type | Description |
|-------|------|-------------|
| date | DATE | Metric date |
| product_id | STRING | Product reference |
| roas | FLOAT | Return on ad spend |
| margin | FLOAT | Profit margin |
| signal_type | STRING | scale/warning/critical |
| signal_message | STRING | Alert description |
| acknowledged | BOOLEAN | Alert status |

---

## Calculated Fields

### Executive Summary
```sql
-- Revenue
SUM(order_total)

-- Net Profit
SUM(order_total - cogs - ad_spend)

-- Profit Margin
(SUM(order_total - cogs) / SUM(order_total)) * 100

-- ROAS
SUM(order_total) / SUM(ad_spend)

-- Previous Period (comparison)
SUM(order_total) - LAG(SUM(order_total)) OVER (ORDER BY date)
```

### Product Performance
```sql
-- Margin %
(SUM(revenue) - SUM(cogs)) / SUM(revenue)

-- Product ROAS
product_revenue / product_ad_spend
```

### Marketing
```sql
-- Platform Classification
CASE 
  WHEN LOWER(campaign_name) CONTAINS 'meta' THEN 'Meta'
  WHEN LOWER(campaign_name) CONTAINS 'fb' THEN 'Meta'
  WHEN LOWER(campaign_name) CONTAINS 'google' THEN 'Google'
  WHEN LOWER(campaign_name) CONTAINS 'tiktok' THEN 'TikTok'
  ELSE 'Other'
END
```

---

## Connection Guide

### Step-by-Step Setup

1. **Open Looker Studio**
   - Navigate to lookerstudio.google.com
   - Sign in with Google account

2. **Create Data Source**
   - Click "Create" > "Data Source"
   - Select "BigQuery"
   - Authorize Google Cloud access

3. **Configure Connection**
   - Billing Project: `johnboat`
   - Project: `johnboat`
   - Dataset: `rior_prod`
   - Table: Select each table individually

4. **Set Field Types**
   - Dates → Date type
   - Currency → Currency type (USD)
   - Percentages → Percent type
   - IDs → Text type

5. **Create Blends (Joins)**
   - Blend `orders` + `products` on `product_id`
   - Blend `ad_spend` + `orders` on `date`
   - Blend `metrics_daily` + `products` on `product_id`

6. **Apply Theme**
   - Theme: Simple Dark
   - Customize colors per spec above
   - Set default date range: Last 30 days

7. **Share Report**
   - Add stakeholders with Viewer or Editor access
   - Enable scheduled email delivery (optional)

---

## Mobile Optimization

### Responsive Settings
- Enable "View mode" mobile layout
- Set minimum component width: 300px
- Stack components on narrow screens
- Hide sparklines on mobile (show in detail view)

### Touch Targets
- Minimum button size: 44x44px
- Dropdowns: Full width on mobile
- Date picker: Native mobile date picker

---

## Troubleshooting

### Common Issues

**"No data" error**
- Check BigQuery permissions
- Verify project ID: `johnboat`
- Confirm dataset exists: `rior_prod`

**Slow loading**
- Add date filters to reduce query size
- Use extracted data sources for historical data
- Enable query caching

**Incorrect calculations**
- Check field aggregation (SUM vs AVG)
- Verify blend join keys
- Confirm date range alignment

**Missing signals**
- Check `metrics_daily.signal_type` is populated
- Verify `acknowledged` filter is set correctly

---

## Support

For technical issues or feature requests:
- Dashboard owner: Rior Systems
- Last updated: 2026-03-04
- Version: 1.0.0
