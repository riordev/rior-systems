# Rior Systems Connectors - API Documentation

Technical reference and onboarding guide for Rior Systems data connectors.

---

## Quick Links

| Connector | Status | Documentation |
|-----------|--------|---------------|
| **Shopify** | ✅ Active | [shopify.md](./shopify.md) |
| **Meta Marketing** | ✅ Active | [meta.md](./meta.md) |
| **Google Ads** | 📝 Planned | [google-ads.md](./google-ads.md) |
| **BigQuery Schema** | ✅ Active | [bigquery-schema.md](./bigquery-schema.md) |

---

## Overview

This documentation covers the data connectors that power Rior Systems' profit intelligence platform. Each connector extracts data from e-commerce and marketing platforms and loads it into BigQuery for unified analytics.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Data Sources                               │
├─────────────┬─────────────┬─────────────┬─────────────────────┤
│   Shopify   │    Meta     │ Google Ads  │   (Future: TikTok,  │
│    Admin    │ Marketing   │   API v15   │   Pinterest, etc)   │
│     API     │    API      │  (planned)  │                     │
└──────┬──────┴──────┬──────┴──────┬──────┴──────────┬──────────┘
       │             │             │                 │
       └─────────────┴──────┬──────┴─────────────────┘
                            │
                   ┌────────▼────────┐
                   │  Connectors     │
                   │  (Python CLI)   │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │    BigQuery     │
                   │   (rior_prod)   │
                   └────────┬────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
    │ Looker  │       │ Alert   │       │  ML/AI  │
    │ Studio  │       │ System  │       │ Models  │
    │Dashboard│       │         │       │         │
    └─────────┘       └─────────┘       └─────────┘
```

---

## Connectors

### 1. Shopify Connector

Extracts orders, products, customers, and refunds from Shopify Admin API.

**Use Cases:**
- Revenue tracking
- Product performance analysis
- Customer cohort analysis
- Refund rate monitoring

**Quick Start:**
```bash
cd /connectors/shopify
export SHOPIFY_API_KEY="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
python shopify_connector.py --shop mystore.myshopify.com
```

**Key Features:**
- API key authentication
- Incremental sync with date filtering
- Automatic pagination (250 records/page)
- Calculated metrics (gross/net revenue, refunds)
- BigQuery MERGE upserts

[Full Documentation →](./shopify.md)

---

### 2. Meta Marketing Connector

Extracts ad spend, impressions, and conversion data from Meta Marketing API.

**Use Cases:**
- ROAS calculation
- Campaign performance tracking
- Attribution analysis
- Multi-touch attribution

**Quick Start:**
```bash
cd /connectors/meta
export META_ACCESS_TOKEN="EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
python meta_connector.py --start-date 2024-01-01 --end-date 2024-01-31
```

**Key Features:**
- OAuth 2.0 authentication
- Multi-account support
- Daily campaign-level breakdowns
- Attribution window support
- Automatic retry with exponential backoff

[Full Documentation →](./meta.md)

---

### 3. Google Ads Connector

Extracts campaign performance data from Google Ads API.

**Status:** 📝 Planned implementation

**Planned Features:**
- OAuth 2.0 with refresh tokens
- GAQL query support
- Campaign and ad group reporting
- Keyword performance tracking
- Automatic token refresh

**Quick Start (Planned):**
```bash
cd /connectors/google
export GOOGLE_ADS_DEVELOPER_TOKEN="XXXXXXXXXXXXXXXXXXXXXX"
export GOOGLE_ADS_REFRESH_TOKEN="1//xxxxxxxxxxxxxxxxxxxxx"
python google_ads_connector.py
```

[Full Documentation →](./google-ads.md)

---

## BigQuery Data Model

### Core Tables

| Table | Description | Data Source |
|-------|-------------|-------------|
| `orders` | Order headers with financials | Shopify |
| `order_items` | Line items per order | Shopify |
| `products` | Product catalog | Shopify |
| `ad_spend` | Marketing spend by platform | Meta, Google |
| `costs` | Additional variable costs | Manual/Calculated |
| `metrics_daily` | Pre-aggregated daily metrics | Computed |

### Key Metrics

| Metric | Formula | Source |
|--------|---------|--------|
| **Gross Revenue** | Order subtotal | Shopify |
| **Net Revenue** | Gross - discounts - refunds | Calculated |
| **COGS** | Unit cost × quantity | Products table |
| **Gross Profit** | Net Revenue - COGS | Calculated |
| **ROAS** | Revenue / Ad Spend | Revenue + Ad Spend |
| **Contribution Margin** | Revenue - all costs | Calculated |

[Full Schema Documentation →](./bigquery-schema.md)

---

## Environment Setup

### Required Environment Variables

```bash
# Shopify
export SHOPIFY_API_KEY="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"

# Meta
export META_ACCESS_TOKEN="EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Google Ads (planned)
export GOOGLE_ADS_DEVELOPER_TOKEN="XXXXXXXXXXXXXXXXXXXXXX"
export GOOGLE_ADS_CLIENT_ID="xxxxxxxxxxxx.apps.googleusercontent.com"
export GOOGLE_ADS_CLIENT_SECRET="XXXXXXXXXXXXXXXXXXXXXXXX"
export GOOGLE_ADS_REFRESH_TOKEN="1//xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export GOOGLE_ADS_LOGIN_CUSTOMER_ID="123-456-7890"

# BigQuery (GCP)
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
export GOOGLE_CLOUD_PROJECT="rior-prod"
```

### GCP Service Account Permissions

The service account needs these BigQuery roles:

| Role | Purpose |
|------|---------|
| `roles/bigquery.dataEditor` | Read/write table data |
| `roles/bigquery.jobUser` | Run queries and load jobs |

---

## Development Workflow

### 1. Local Development

```bash
# Clone/navigate to connector
cd connectors/shopify

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy config
cp config.example.json config.json

# Run tests
python test_connector.py

# Run connector
python shopify_connector.py --shop mystore.myshopify.com --dry-run
```

### 2. Testing

Each connector includes test files:

```bash
# Meta connector tests
python /connectors/meta/test_connector.py

# Shopify tests (if available)
python /connectors/shopify/test_connector.py
```

### 3. Deployment

```bash
# Schedule with cron (daily at 2 AM)
0 2 * * * cd /path/to/connector && python connector.py >> /var/log/connector.log 2>&1

# Or use Google Cloud Scheduler + Cloud Run
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **401 Unauthorized** | Check API key/token; regenerate if needed |
| **403 Forbidden** | Verify permissions/scopes; check account access |
| **429 Rate Limited** | Implement backoff; reduce request frequency |
| **BigQuery errors** | Verify service account permissions; check table exists |
| **Data not appearing** | Check sync date range; verify no filters excluding data |

### Debug Mode

All connectors support verbose logging:

```bash
python connector.py --verbose  # or -v
```

### Dry Run

Test extraction without loading to BigQuery:

```bash
python connector.py --dry-run
```

---

## Data Flow Diagram

```
Day 1: Extract & Load
─────────────────────
02:00  Shopify Connector → orders, order_items, products
02:30  Meta Connector    → ad_spend (platform='meta')
03:00  (Google Ads)      → ad_spend (platform='google')

Day 1: Transform
────────────────
04:00  metrics_daily refresh
04:30  Looker Studio cache refresh

Day 2+: Analytics
─────────────────
Dashboards updated
Alerts evaluated
Reports generated
```

---

## Contributing

### Adding a New Connector

1. Create directory: `/connectors/{platform}/`
2. Implement connector class with standard interface:
   - `__init__(config)`
   - `authenticate()`
   - `extract(start_date, end_date)`
   - `load(data)`
3. Add configuration file
4. Write tests
5. Update documentation

### Connector Standards

- Use Python 3.10+
- Include type hints
- Implement retry logic
- Support incremental sync
- Log to stdout/stderr
- Exit codes: 0=success, 1=error

---

## Support

For technical issues:

1. Check connector-specific documentation
2. Review troubleshooting section
3. Check logs with `--verbose` flag
4. Contact: [Rior Systems Support]

---

## License

Internal use only - Rior Systems

---

## Changelog

| Date | Change |
|------|--------|
| 2024-03-04 | Initial documentation created |
| 2024-03-04 | Shopify connector v1.0 documented |
| 2024-03-04 | Meta connector v1.0 documented |
| 2024-03-04 | BigQuery schema documented |
| 2024-03-04 | Google Ads connector planned |
