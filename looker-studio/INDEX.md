# Rior Systems Looker Studio Dashboard

> Executive-grade profit intelligence dashboard for Shopify brands.
> Built for the Glass aesthetic — dark, clean, actionable.

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Create BigQuery views
cat sql/bigquery_views.sql | bq query --project_id=johnboat

# 2. (Optional) Insert sample data
cat sql/placeholder_data.sql | bq query --project_id=johnboat

# 3. Open Looker Studio and follow docs/setup-guide.md
```

---

## 📁 Package Contents

```
rior-systems/looker-studio/
│
├── README.md                          # This file
│
├── docs/
│   ├── setup-guide.md                 # Step-by-step build instructions
│   ├── connection-guide.md            # BigQuery connection details
│   ├── field-configuration.md         # Field types and formulas
│   ├── visual-specifications.md       # Design system reference
│   ├── placeholder-screenshots.md     # ASCII mockups of dashboard
│   └── quick-reference.md             # Cheat sheet
│
├── sql/
│   ├── bigquery_views.sql             # Create dashboard views
│   └── placeholder_data.sql           # Sample data for testing
│
└── assets/                            # Screenshots & images (to be added)
```

---

## 📊 Dashboard Overview

### Page 1: Executive Summary
Four KPI cards with period comparison:
- 💰 Revenue
- 📈 Net Profit  
- 🎯 Profit Margin
- 🚀 ROAS

Plus 90-day revenue trend chart.

### Page 2: Product Performance
- Product table with margin & ROAS
- Revenue by product bar chart
- Margin trend sparkline
- Signal indicators (scale/warning/critical)

### Page 3: Marketing Performance
- Spend vs Revenue dual-axis chart
- ROAS by campaign
- Platform spend distribution
- Platform filters (Meta/Google/TikTok)

### Page 4: Alerts & Signals
- Unacknowledged alerts counter
- Alert table with severity color coding
- 🟢 Scale signals (opportunities)
- 🟡 Warnings (attention needed)
- 🔴 Critical (immediate action)

---

## 🎨 Design System

**Colors:**
- Background: `#0D1117`
- Card: `#161B22`
- Border: `#30363D`
- Blue: `#58A6FF`
- Green: `#238636`
- Amber: `#D29922`
- Red: `#DA3633`

**Typography:** Roboto (Google Fonts)

**Style:** Dark theme, minimal borders, generous whitespace

---

## 🔌 Data Sources

| View | Description |
|------|-------------|
| `vw_executive_summary` | Daily KPIs (revenue, profit, margin, ROAS) |
| `vw_product_performance` | Product-level metrics |
| `vw_marketing_performance` | Campaign and platform data |
| `vw_alerts` | Signal feed with severity |
| `vw_time_series` | Trend data for charts |
| `vw_campaign_roas` | Attributed ROAS by campaign |

**BigQuery:** `johnboat.rior_prod.*`

---

## 📖 Documentation Index

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [Setup Guide](docs/setup-guide.md) | Build the dashboard | First time setup |
| [Connection Guide](docs/connection-guide.md) | BigQuery ↔ Looker Studio | Connection issues |
| [Field Configuration](docs/field-configuration.md) | Field types & formulas | Customizing metrics |
| [Visual Specs](docs/visual-specifications.md) | Design details | Applying theme |
| [Quick Reference](docs/quick-reference.md) | Cheat sheet | Day-to-day use |

---

## ⚡ Key Metrics

```sql
-- Revenue
SUM(order_total)

-- Net Profit
SUM(order_total - cogs - ad_spend)

-- Profit Margin
(Net Profit / Revenue) * 100

-- ROAS
Revenue / Ad Spend

-- Signal Logic
CASE 
  WHEN roas > 4.0 THEN 'scale'
  WHEN roas < 1.5 THEN 'critical'
  WHEN margin < 0.5 THEN 'warning'
END
```

---

## 🛠️ Setup Checklist

- [ ] BigQuery views created (`sql/bigquery_views.sql`)
- [ ] Sample data loaded (optional)
- [ ] Looker Studio data sources connected (6 sources)
- [ ] Field types configured
- [ ] Data blends created
- [ ] 4 pages built with all components
- [ ] Dark theme applied
- [ ] Mobile layout configured
- [ ] Sharing permissions set

**Estimated setup time:** 45-60 minutes

---

## 📱 Mobile

Dashboard is responsive with:
- Stacked KPI cards on narrow screens
- Simplified charts (sparklines hidden)
- Touch-friendly filters
- Swipe navigation between pages

---

## 🔒 Security

- Row-level security available via authorized views
- Service account recommended for production
- Viewer/Editor permissions in Looker Studio
- BigQuery IAM controls access

---

## 💰 Costs

**Estimated BigQuery query costs:**
- ~$1-5/month for typical usage
- Reduced with caching enabled
- Views minimize table scans

**Looker Studio:** Free

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "No data" | Check BigQuery permissions; run placeholder data |
| Slow loading | Add date filters; check caching settings |
| Wrong calculations | Verify field aggregation; check blends |
| Missing signals | Check `vw_alerts` filter conditions |
| Mobile broken | Enable mobile layout; rearrange components |

---

## 📞 Support

- **Owner:** Rior Systems
- **Created:** 2026-03-04
- **Version:** 1.0.0
- **Dashboard Type:** Looker Studio + BigQuery

---

## 🎯 Next Steps

1. Run the SQL views in BigQuery
2. Follow the [setup guide](docs/setup-guide.md)
3. Test with sample data
4. Customize metrics for your needs
5. Share with stakeholders

---

*Built for profit intelligence. Designed for action.*
