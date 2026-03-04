# Looker Studio Field Configuration

## Data Source Setup

### 1. Orders Table Configuration

| Field Name | Type | Aggregation | Description |
|------------|------|-------------|-------------|
| order_id | Text | None | Unique identifier |
| product_id | Text | None | Foreign key to products |
| order_date | Date | None | Transaction date |
| order_total | Currency | Sum | Revenue amount |
| cogs | Currency | Sum | Cost of goods |
| quantity | Number | Sum | Units sold |

**Calculated Fields:**
```
Name: Gross Profit
Formula: order_total - cogs
Type: Currency
Aggregation: Sum
```

### 2. Products Table Configuration

| Field Name | Type | Aggregation | Description |
|------------|------|-------------|-------------|
| product_id | Text | None | Unique identifier |
| name | Text | None | Product name |
| category | Text | None | Product category |
| base_cogs | Currency | Average | Base cost |

### 3. Ad Spend Table Configuration

| Field Name | Type | Aggregation | Description |
|------------|------|-------------|-------------|
| date | Date | None | Spend date |
| campaign_name | Text | None | Campaign name |
| platform | Text | None | Platform (Meta/Google/TikTok) |
| spend | Currency | Sum | Ad spend |
| impressions | Number | Sum | Impressions |
| clicks | Number | Sum | Clicks |
| conversions | Number | Sum | Conversions |

**Calculated Fields:**
```
Name: CTR
Formula: clicks / impressions
Type: Percent
Aggregation: None

Name: CPC
Formula: spend / clicks
Type: Currency
Aggregation: None

Name: ROAS
Formula: (Join with orders for revenue) / spend
Type: Number
Aggregation: None
```

### 4. Metrics Daily Table Configuration

| Field Name | Type | Aggregation | Description |
|------------|------|-------------|-------------|
| date | Date | None | Metric date |
| product_id | Text | None | Product reference |
| roas | Number | Average | Return on ad spend |
| margin | Percent | Average | Profit margin |
| signal_type | Text | None | scale/warning/critical |
| signal_message | Text | None | Alert description |
| acknowledged | Boolean | None | Alert status |

---

## Data Blends (Joins)

### Blend 1: Orders + Products
**Name:** Order Details
**Left:** orders
**Right:** products
**Join Keys:** product_id
**Join Type:** Left Outer

**Fields Included:**
- orders.order_date
- orders.order_total
- orders.cogs
- products.name
- products.category

### Blend 2: Ad Spend + Revenue
**Name:** Marketing Performance
**Left:** ad_spend
**Right:** orders (aggregated by date)
**Join Keys:** date
**Join Type:** Left Outer

**Fields Included:**
- ad_spend.date
- ad_spend.campaign_name
- ad_spend.platform
- ad_spend.spend
- orders.order_total (as revenue)

### Blend 3: Metrics + Products
**Name:** Product Signals
**Left:** metrics_daily
**Right:** products
**Join Keys:** product_id
**Join Type:** Left Outer

**Fields Included:**
- metrics_daily.date
- metrics_daily.signal_type
- metrics_daily.signal_message
- metrics_daily.acknowledged
- products.name
- products.category

---

## Executive Summary Page Fields

### Scorecard 1: Revenue
```
Data Source: vw_time_series
Metric: revenue
Aggregation: Sum
Comparison: Previous period
Date Range: Auto (controlled by filter)
```

### Scorecard 2: Net Profit
```
Data Source: vw_time_series
Metric: net_profit
Aggregation: Sum
Comparison: Previous period
```

### Scorecard 3: Profit Margin
```
Data Source: vw_executive_summary
Metric: profit_margin_pct
Aggregation: Average
Comparison: Previous period
Format: Percentage (1 decimal)
```

### Scorecard 4: ROAS
```
Data Source: vw_executive_summary
Metric: roas
Aggregation: Average
Comparison: Previous period
Format: Number (2 decimals)
```

---

## Filter Configuration

### Date Range Filter
```
Name: Date Range
Type: Date range control
Default: Last 30 days
Apply to: All charts on page
```

### Platform Filter
```
Name: Platform
Type: Drop-down list
Data Source: ad_spend
Field: platform
Default: All
Apply to: Marketing Performance page
```

### Signal Type Filter
```
Name: Signal Type
Type: Drop-down list
Data Source: metrics_daily
Field: signal_type
Default: All
Apply to: Alerts & Signals page
```

### Acknowledged Filter
```
Name: Show Acknowledged
Type: Checkbox
Data Source: metrics_daily
Field: acknowledged
Default: Unchecked (shows only unacknowledged)
Apply to: Alerts & Signals page
```

---

## Chart-Specific Configurations

### Product Performance Table
```
Dimensions:
  - products.name (as Product)
  - products.category (as Category)
  
Metrics:
  - SUM(orders.order_total) as Revenue
  - SUM(orders.cogs) as COGS
  - (Revenue - COGS) / Revenue as Margin %
  - Estimated ROAS from blend
  
Sorting: Revenue descending
Row limit: 50
Pagination: 10 rows per page
```

### Revenue by Product Bar Chart
```
Chart Type: Bar chart
Dimension: products.name
Metric: SUM(orders.order_total)
Sort: Metric descending
Limit: Top 10
Orientation: Horizontal
Color: #58A6FF
```

### Margin Trend Sparkline
```
Chart Type: Time series (line)
Dimension: orders.order_date
Metric: (SUM(orders.order_total) - SUM(orders.cogs)) / SUM(orders.order_total)
Date range: Last 30 days
Line color: #238636
Show points: No
Smooth: Yes
```

### Spend vs Revenue Line Chart
```
Chart Type: Time series (line with dual axis)
X-Axis: date
Left Y-Axis: SUM(ad_spend.spend) - Color: #D29922
Right Y-Axis: SUM(orders.order_total) - Color: #238636
Date range: Last 30 days
```

### ROAS by Campaign Bar Chart
```
Chart Type: Bar chart
Dimension: ad_spend.campaign_name
Metric: ROAS (calculated from blend)
Sort: ROAS descending
Limit: Top 15
Color by: platform
```

### Spend by Platform Pie Chart
```
Chart Type: Pie chart
Dimension: ad_spend.platform
Metric: SUM(ad_spend.spend)
Color mapping:
  - Meta: #1877F2
  - Google: #4285F4
  - TikTok: #FF0050
  - Other: #8B949E
Show labels: Yes
Legend: Right side
```

### Alerts Scorecard
```
Chart Type: Scorecard with delta
Data Source: vw_alerts
Metric: COUNT(signal_type)
Filter: acknowledged = FALSE
Comparison: None
Color: #D29922 (amber)
```

### Alerts Table
```
Dimensions:
  - date
  - product_name
  - signal_type
  - signal_message
  - alert_status
  
Conditional Formatting:
  - signal_type = 'scale' → Background #238636 (green), Text white
  - signal_type = 'warning' → Background #D29922 (amber), Text black
  - signal_type = 'critical' → Background #DA3633 (red), Text white
  
Sorting: severity_order descending, date descending
Row limit: 25
```

---

## Custom Color Theme JSON

```json
{
  "themeName": "Rior Dark",
  "textColor": "#E6EDF3",
  "backgroundColor": "#0D1117",
  "accentColor": "#58A6FF",
  "secondaryAccent": "#238636",
  "warningColor": "#D29922",
  "criticalColor": "#DA3633",
  "chartColors": [
    "#58A6FF",
    "#238636",
    "#D29922",
    "#DA3633",
    "#A371F7",
    "#3FB950",
    "#F78166"
  ],
  "fontFamily": "Roboto",
  "borderRadius": 8,
  "cardBackground": "#161B22",
  "cardBorder": "#30363D"
}
```

To apply: 
1. Theme > Customize
2. Import JSON (paste above)
3. Apply to report
