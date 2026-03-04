# Connection Guide: BigQuery ↔ Looker Studio

## Prerequisites

1. **Google Cloud Project:** `johnboat` with BigQuery enabled
2. **Dataset:** `rior_prod` created in BigQuery
3. **Permissions:** Looker Studio account with BigQuery access
4. **Billing:** Google Cloud billing enabled for queries

---

## Step 1: Verify BigQuery Access

### Test Query
Run in BigQuery console to verify setup:

```sql
-- Check dataset exists
SELECT schema_name
FROM `johnboat.INFORMATION_SCHEMA.SCHEMATA`
WHERE schema_name = 'rior_prod';

-- Check tables exist
SELECT table_name, row_count
FROM `johnboat.rior_prod.INFORMATION_SCHEMA.TABLES`;

-- Expected output:
-- orders, products, ad_spend, metrics_daily
```

### Create Service Account (If Needed)
If connecting with service account instead of personal:

1. Go to [Google Cloud Console IAM](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click **Create Service Account**
3. Name: `looker-studio-connector`
4. Grant roles:
   - BigQuery Data Viewer
   - BigQuery Job User
5. Create key → JSON
6. Download and store securely

---

## Step 2: Connect Looker Studio to BigQuery

### Method A: Personal Account (Easiest)

1. Open [Looker Studio](https://lookerstudio.google.com)
2. Click **Create > Data Source**
3. Select **BigQuery**
4. Choose **Use standard connection**
5. Authorize with your Google account
6. Select:
   - **Billing Project:** `johnboat`
   - **Project:** `johnboat`
   - **Dataset:** `rior_prod`
   - **Table:** Start with `vw_executive_summary`
7. Click **Connect**

### Method B: Service Account (Enterprise)

1. In Looker Studio, go to **Admin settings**
2. Navigate to **Data sources**
3. Click **Add > BigQuery**
4. Select **Use service account**
5. Upload the JSON key file
6. Configure project and dataset as above

---

## Step 3: Configure Data Sources

### Create All Required Connections

Repeat for each view:

| # | Data Source Name | BigQuery View | Purpose |
|---|------------------|---------------|---------|
| 1 | Executive Summary | `vw_executive_summary` | Page 1 KPIs |
| 2 | Product Performance | `vw_product_performance` | Page 2 products |
| 3 | Marketing | `vw_marketing_performance` | Page 3 campaigns |
| 4 | Alerts | `vw_alerts` | Page 4 signals |
| 5 | Time Series | `vw_time_series` | Trend charts |
| 6 | Campaign ROAS | `vw_campaign_roas` | ROAS calculations |

### Quick Add Method

1. In your report, click **Resource > Manage added data sources**
2. Click **+ Add a data source**
3. Select **BigQuery**
4. Choose **Recent** or search for the view
5. Click **Add**
6. Repeat for all 6 views

---

## Step 4: Field Type Configuration

After connecting each data source, verify and set field types:

### vw_executive_summary
| Field | Type | Format |
|-------|------|--------|
| date | Date | YYYY-MM-DD |
| revenue | Currency | USD |
| gross_profit | Currency | USD |
| net_profit | Currency | USD |
| profit_margin_pct | Percent | 1 decimal |
| roas | Number | 2 decimals |

### vw_product_performance
| Field | Type | Format |
|-------|------|--------|
| product_id | Text | - |
| product_name | Text | - |
| category | Text | - |
| revenue | Currency | USD |
| total_cogs | Currency | USD |
| gross_profit | Currency | USD |
| margin_pct | Percent | 1 decimal |
| units_sold | Number | 0 decimals |

### vw_marketing_performance
| Field | Type | Format |
|-------|------|--------|
| date | Date | YYYY-MM-DD |
| platform | Text | - |
| campaign_name | Text | - |
| spend | Currency | USD |
| impressions | Number | 0 decimals |
| clicks | Number | 0 decimals |
| conversions | Number | 0 decimals |
| ctr_pct | Percent | 2 decimals |
| cvr_pct | Percent | 2 decimals |
| cpc | Currency | USD |
| cpa | Currency | USD |

### vw_alerts
| Field | Type | Format |
|-------|------|--------|
| date | Date | YYYY-MM-DD |
| product_name | Text | - |
| signal_type | Text | - |
| signal_message | Text | - |
| roas | Number | 2 decimals |
| margin | Percent | 1 decimal |
| acknowledged | Boolean | - |
| severity_order | Number | 0 decimals |
| alert_status | Text | - |

---

## Step 5: Data Blending (Joins)

Some charts require blending multiple sources:

### Blend 1: Revenue Attribution
**Purpose:** Connect ad spend to revenue

1. In Looker Studio, click **Resource > Manage blends**
2. Click **Add a blend**
3. **Left table:** `vw_time_series`
   - Key: `date`
4. **Right table:** `vw_marketing_performance`
   - Key: `date`
5. **Join type:** Left outer
6. **Name:** "Revenue Attribution"

### Blend 2: Product Signals
**Purpose:** Connect alerts to product names

1. Add new blend
2. **Left table:** `vw_alerts`
   - Key: `product_name`
3. **Right table:** `vw_product_performance`
   - Key: `product_name`
4. **Join type:** Left outer
5. **Name:** "Product Alerts"

### Using Blends in Charts

1. Select a chart
2. In Data panel, click the data source name
3. Select **Blend data**
4. Choose your blend from the list
5. Configure dimensions and metrics from both tables

---

## Step 6: Data Freshness & Caching

### Set Refresh Options

1. Go to **Resource > Manage added data sources**
2. Click a data source
3. Click **Edit connection** (wrench icon)
4. Set **Data freshness:**
   - For real-time: **1 minute**
   - For daily reports: **12 hours**
   - For hourly: **1 hour**

### Enable Query Caching

1. In BigQuery console, go to **Bi Engine**
2. Enable for `johnboat` project
3. Set preferred tables for acceleration:
   - `vw_executive_summary`
   - `vw_time_series`
   - `vw_alerts`

---

## Step 7: Security & Access

### BigQuery Permissions

Ensure these IAM roles are granted:

**For Editors (can modify):**
```
roles/bigquery.dataEditor
roles/bigquery.jobUser
```

**For Viewers (read-only):**
```
roles/bigquery.dataViewer
roles/bigquery.jobUser
```

### Looker Studio Sharing

1. In report, click **Share**
2. Add people/groups:
   - **Viewer:** Can see data, can't edit
   - **Editor:** Can modify report
3. **Link sharing options:**
   - Restricted: Only added people
   - Organization: Anyone in domain
   - Public: Anyone with link (not recommended)

### Row-Level Security (Optional)

If clients should only see their data:

```sql
-- Add to views
WHERE client_id = SESSION_USER()
-- Or use authorized views with service accounts
```

---

## Troubleshooting Connections

| Issue | Cause | Solution |
|-------|-------|----------|
| "Access Denied" | Missing IAM permissions | Add BigQuery Data Viewer role |
| "Dataset not found" | Wrong project ID | Verify `johnboat` is correct |
| "No data returned" | Empty tables | Run placeholder_data.sql |
| "Query too expensive" | No WHERE clause | Add date filters to charts |
| "Slow loading" | Large table scans | Use views with pre-aggregation |
| "Stale data" | Caching enabled | Reduce data freshness interval |
| "Blend not working" | Wrong join keys | Verify field types match |

---

## Cost Optimization

### BigQuery Query Costs

**Estimate monthly cost:**
```
Daily queries: ~100 (report loads + filters)
Average query: 50 MB
Price: $5 per TB

100 queries × 50 MB × 30 days = 150 GB
Cost: 150 GB × $0.005/GB = $0.75/month
```

### Cost Reduction Tips

1. **Use views** instead of querying raw tables
2. **Add date filters** to every chart
3. **Enable caching** in Looker Studio
4. **Schedule queries** for pre-aggregated data
5. **Set up BigQuery reservations** for predictable costs

---

## Connection Checklist

- [ ] BigQuery project `johnboat` accessible
- [ ] Dataset `rior_prod` exists with tables
- [ ] Views created from `bigquery_views.sql`
- [ ] All 6 data sources connected in Looker Studio
- [ ] Field types configured correctly
- [ ] Data blends created for complex charts
- [ ] Refresh intervals set appropriately
- [ ] IAM permissions granted to team
- [ ] Report sharing configured
- [ ] Cost monitoring enabled

---

## Support Resources

- **BigQuery Docs:** https://cloud.google.com/bigquery/docs
- **Looker Studio Help:** https://support.google.com/looker-studio
- **BigQuery Pricing:** https://cloud.google.com/bigquery/pricing
- **Connection Issues:** Check Cloud IAM logs in GCP Console
