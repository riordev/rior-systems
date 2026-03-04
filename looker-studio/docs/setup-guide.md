# Step-by-Step Dashboard Setup Guide

## Phase 1: BigQuery Setup (5 minutes)

### 1.1 Verify Dataset Access
```sql
-- Run in BigQuery console to verify connection
SELECT COUNT(*) as table_count
FROM `johnboat.rior_prod.INFORMATION_SCHEMA.TABLES`;
```

Expected: Should return 4 (orders, products, ad_spend, metrics_daily)

### 1.2 Create Views
1. Open BigQuery Console: https://console.cloud.google.com/bigquery
2. Select project: `johnboat`
3. Open dataset: `rior_prod`
4. Run the SQL from `sql/bigquery_views.sql`
5. Verify views created:
   - `vw_executive_summary`
   - `vw_product_performance`
   - `vw_marketing_performance`
   - `vw_alerts`
   - `vw_time_series`
   - `vw_campaign_roas`

### 1.3 Insert Sample Data (Optional - for testing)
```sql
-- Run sql/placeholder_data.sql in BigQuery
-- This populates tables with sample data for dashboard testing
```

---

## Phase 2: Looker Studio Data Sources (10 minutes)

### 2.1 Create First Data Source
1. Go to https://lookerstudio.google.com
2. Click **Create > Data Source**
3. Select **BigQuery**
4. Authorize Google Cloud access if prompted
5. Configure:
   - Billing Project: `johnboat`
   - Project: `johnboat`
   - Dataset: `rior_prod`
   - Table: `vw_executive_summary`
6. Click **Connect**
7. Verify field types:
   - `date` → Date
   - `revenue` → Currency (USD)
   - `net_profit` → Currency (USD)
   - `profit_margin_pct` → Percentage
   - `roas` → Number
8. Click **Create Report** (or **Add to Report**)

### 2.2 Add Remaining Data Sources
Repeat for each view:

| View | Primary Use |
|------|-------------|
| vw_product_performance | Page 2 - Product Performance |
| vw_marketing_performance | Page 3 - Marketing Performance |
| vw_alerts | Page 4 - Alerts & Signals |
| vw_time_series | Time-based charts across pages |
| vw_campaign_roas | Campaign ROAS calculations |

**Quick method:**
1. In report, click **Resource > Manage added data sources**
2. Click **Add a data source**
3. Select **BigQuery** and repeat configuration

---

## Phase 3: Report Structure (10 minutes)

### 3.1 Create Pages
1. Page 1: Rename to "Executive Summary"
2. Add Page 2: "Product Performance"
3. Add Page 3: "Marketing Performance"
4. Add Page 4: "Alerts & Signals"

### 3.2 Apply Theme
1. Click **Theme and Layout**
2. Select **Simple Dark** as base
3. Click **Customize**
4. Apply custom colors:
   - Background: `#0D1117`
   - Surface: `#161B22`
   - Primary: `#58A6FF`
   - Text: `#E6EDF3`
5. Set font: Roboto

### 3.3 Add Global Controls
Add to each page:
1. **Date Range Control**
   - Insert > Date range control
   - Position: Top right
   - Default: Last 30 days
   - Apply to all charts

2. **Filter Controls** (page-specific)
   - Page 2: Product category filter
   - Page 3: Platform filter
   - Page 4: Signal type filter

---

## Phase 4: Build Executive Summary (10 minutes)

### 4.1 Add Scorecards
Insert 4 scorecards in a row:

**Scorecard 1: Revenue**
- Data: vw_executive_summary
- Metric: revenue
- Comparison: Previous period
- Style: Large number (48pt)
- Color: #58A6FF

**Scorecard 2: Net Profit**
- Data: vw_executive_summary
- Metric: net_profit
- Comparison: Previous period
- Color: #238636

**Scorecard 3: Profit Margin**
- Data: vw_executive_summary
- Metric: profit_margin_pct
- Comparison: Previous period
- Format: Percent (1 decimal)
- Color: #E6EDF3

**Scorecard 4: ROAS**
- Data: vw_executive_summary
- Metric: roas
- Comparison: Previous period
- Format: Number (2 decimals)
- Color: #A371F7

### 4.2 Add Trend Chart
**Revenue Trend (Line Chart)**
- Dimension: date
- Metric: revenue
- Date range: Last 90 days
- Smooth line: Yes
- Show data points: No
- Color: #58A6FF

---

## Phase 5: Build Product Performance (10 minutes)

### 5.1 Product Table
Insert table with:
- Data: vw_product_performance
- Dimensions: product_name, category
- Metrics: revenue, total_cogs, margin_pct, estimated_roas
- Sort: revenue descending
- Rows per page: 10
- Conditional formatting: None

### 5.2 Revenue Bar Chart
- Chart: Horizontal bar
- Dimension: product_name
- Metric: revenue
- Top 10 only
- Color: #58A6FF

### 5.3 Margin Sparkline
- Chart: Time series (sparkline style)
- Create blend: orders + products
- Dimension: order_date
- Metric: margin calculation
- Line color: #238636
- No axes, minimal style

---

## Phase 6: Build Marketing Performance (10 minutes)

### 6.1 Spend vs Revenue Chart
**Line Chart (Dual Axis)**
- Create blend: ad_spend + orders
- Dimension: date
- Left metric: spend (color: #D29922)
- Right metric: revenue (color: #238636)
- Legend: Show

### 6.2 ROAS by Campaign
**Bar Chart**
- Data: vw_campaign_roas
- Dimension: campaign_name
- Metric: roas
- Sort: roas descending
- Color by: platform
- Limit: Top 15

### 6.3 Platform Spend Pie Chart
**Pie Chart**
- Data: ad_spend
- Dimension: platform
- Metric: spend
- Colors:
  - Meta: #1877F2
  - Google: #4285F4
  - TikTok: #FF0050
  - Other: #8B949E

---

## Phase 7: Build Alerts & Signals (10 minutes)

### 7.1 Unacknowledged Alerts Count
**Scorecard**
- Data: vw_alerts
- Metric: COUNT(signal_type)
- Filter: acknowledged = FALSE
- Style: Large, amber color (#D29922)
- Add label: "Unacknowledged Alerts"

### 7.2 Alerts Table
**Table**
- Data: vw_alerts
- Dimensions: date, product_name, signal_type, signal_message
- Filter: Show recent 30 days
- Conditional formatting:
  ```
  signal_type = 'scale' → Green background
  signal_type = 'warning' → Amber background
  signal_type = 'critical' → Red background
  ```
- Sort: acknowledged ASC, severity_order DESC

### 7.3 Signal Type Filter
**Drop-down Filter**
- Data: vw_alerts
- Field: signal_type
- Apply to: Alerts table

---

## Phase 8: Final Configuration (5 minutes)

### 8.1 Set Default View
1. Executive Summary page → Set as default
2. Configure page navigation:
   - Add navigation bar or
   - Enable page tabs

### 8.2 Add Report Header
Insert text box:
```
Rior Systems - Profit Intelligence Dashboard
Last updated: {current date}
```
Position: Top left
Style: 24pt, white

### 8.3 Configure Sharing
1. File > Share
2. Add stakeholders:
   - Viewers: Client emails
   - Editors: Internal team
3. Enable link sharing (optional)
4. Set expiration (if needed)

### 8.4 Schedule Email Delivery (Optional)
1. File > Schedule email delivery
2. Set frequency: Daily/Weekly
3. Add recipients
4. Select pages to include
5. Set delivery time

---

## Phase 9: Mobile Optimization (5 minutes)

### 9.1 Enable Mobile View
1. View > Mobile layout
2. Enable "View mode mobile layout"

### 9.2 Configure Mobile Layout
For each page:
1. Arrange components vertically
2. Set minimum width: 300px
3. Hide complex sparklines (optional)
4. Test responsive behavior

---

## Testing Checklist

- [ ] All data sources connected
- [ ] Views returning data
- [ ] Filters working correctly
- [ ] Date range affecting all charts
- [ ] Calculated fields accurate
- [ ] Conditional formatting applied
- [ ] Mobile layout functional
- [ ] Sharing permissions set
- [ ] Stakeholders can access

---

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| "No data" | Check BigQuery permissions; verify project ID |
| Slow loading | Add date filters; reduce row limits |
| Wrong calculations | Check aggregation settings; verify blends |
| Missing signals | Check vw_alerts filter; verify acknowledged field |
| Colors not applying | Re-apply theme; check custom color JSON |
| Mobile layout broken | Enable mobile view; rearrange components |

---

## Next Steps

1. **Test with real data** - Replace placeholder data
2. **Add calculated metrics** - Customize to client needs
3. **Create alerts** - Set up email notifications
4. **Document customizations** - Update this guide
5. **Train stakeholders** - Schedule walkthrough session
