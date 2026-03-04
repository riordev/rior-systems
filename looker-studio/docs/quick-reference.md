# Quick Reference Card

## Dashboard Access
- **URL:** https://lookerstudio.google.com (create new report)
- **BigQuery Project:** `johnboat`
- **Dataset:** `rior_prod`

## Views for Dashboard
Run these in BigQuery first:
```
vw_executive_summary
vw_product_performance
vw_marketing_performance
vw_alerts
vw_time_series
vw_campaign_roas
```

## Key Metrics Formulas

| Metric | Formula |
|--------|---------|
| Revenue | `SUM(order_total)` |
| Net Profit | `SUM(order_total - cogs - ad_spend)` |
| Profit Margin | `(Net Profit / Revenue) * 100` |
| ROAS | `Revenue / Ad Spend` |
| CTR | `Clicks / Impressions` |
| CPC | `Spend / Clicks` |

## Color Codes

### Backgrounds
- Page: `#0D1117`
- Card: `#161B22`
- Border: `#30363D`

### Accents
- Blue: `#58A6FF`
- Green: `#238636`
- Amber: `#D29922`
- Red: `#DA3633`

### Platforms
- Meta: `#1877F2`
- Google: `#4285F4`
- TikTok: `#FF0050`

## Signal Types

| Type | Color | Action |
|------|-------|--------|
| scale | 🟢 Green | Increase budget |
| warning | 🟡 Amber | Review performance |
| critical | 🔴 Red | Pause immediately |

## File Structure

```
/workspace/rior-systems/looker-studio/
├── README.md                    # Main documentation
├── docs/
│   ├── setup-guide.md          # Step-by-step setup
│   ├── field-configuration.md  # Field mapping
│   └── visual-specifications.md # Design specs
├── sql/
│   ├── bigquery_views.sql      # View definitions
│   └── placeholder_data.sql    # Sample data
└── assets/                     # Screenshots, images
```

## Support
- Dashboard Version: 1.0.0
- Created: 2026-03-04
- Owner: Rior Systems
