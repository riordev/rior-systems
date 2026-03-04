# BigQuery Infrastructure Setup Complete ✅

**Project:** johnboat  
**Dataset:** rior_prod  
**Location:** US  
**Completed:** 2025-03-04

---

## Tables Created

| Table | Rows | Description |
|-------|------|-------------|
| products | 3 | Product catalog with COGS |
| orders | 1,575 | Order headers |
| order_items | 2,443 | Line items with cost snapshots |
| costs | 3,150 | Processing fees, platform fees |
| ad_spend | 360 | Marketing spend by campaign |
| metrics_daily | 90 | Pre-calculated daily KPIs |

---

## Demo Data Summary

**90-Day Harbor Goods Dataset:**
- 3 artisan home goods products
- $286,654.96 net revenue
- $70,307.14 net profit
- 24.43% profit margin
- 1,575 orders, 2,443 line items

---

## Key Files

- `README.md` - Full documentation with connection instructions
- `schema.sql` - BigQuery table definitions
- `test_queries.sql` - Validation and sample queries
- `generate_data.py` - Demo data generator

---

## Quick Connect

```bash
# CLI
bq query --use_legacy_sql=false 'SELECT * FROM `johnboat.rior_prod.metrics_daily` LIMIT 5'

# Python
from google.cloud import bigquery
client = bigquery.Client(project='johnboat')
```
