# Google Ads Connector API Documentation

Complete reference for the Google Ads API connector used in Rior Systems.

## Status: Planned Implementation

This connector is currently planned. The documentation below represents the target implementation based on Google Ads API v15 standards.

## Table of Contents

- [Overview](#overview)
- [Google Ads API Setup](#google-ads-api-setup)
- [Developer Token Requirements](#developer-token-requirements)
- [Authentication (OAuth 2.0)](#authentication-oauth-20)
- [Customer ID Format](#customer-id-format)
- [Query Structure (GAQL)](#query-structure-gaql)
- [Common Endpoints](#common-endpoints)
- [Error Codes & Troubleshooting](#error-codes--troubleshooting)
- [Code Examples](#code-examples)

---

## Overview

The Google Ads connector extracts campaign performance data from the Google Ads API for loading into BigQuery. It enables ROAS analysis alongside Meta ad spend.

**Target API Version:** v15

**Features (Planned):**
- OAuth 2.0 authentication with refresh tokens
- GAQL (Google Ads Query Language) for data extraction
- Campaign and ad group level reporting
- Automatic token refresh
- BigQuery MERGE upserts

---

## Google Ads API Setup

### Prerequisites

1. **Google Cloud Project** with billing enabled
2. **Google Ads API enabled** in GCP Console
3. **Developer token** from Google Ads (see below)
4. **OAuth 2.0 credentials** configured

### Enable the API

```bash
# Via gcloud CLI
gcloud services enable googleads.googleapis.com

# Or via GCP Console:
# APIs & Services → Library → Search "Google Ads API" → Enable
```

### Project Structure (Planned)

```
/connectors/google/
├── google_ads_connector.py    # Main connector
├── config.yaml                # Configuration
├── requirements.txt           # Dependencies
├── .env.example              # Environment template
└── README.md                 # Setup guide
```

---

## Developer Token Requirements

### What is a Developer Token?

A developer token identifies your application to the Google Ads API. It's **separate from OAuth credentials** and requires approval from Google.

### Obtaining a Developer Token

1. Sign in to your **manager Google Ads account**
2. Navigate to: Tools & Settings → Setup → API Center
3. Click "Apply for developer token"
4. Complete the application form:
   - Company name and website
   - Intended API use case
   - Estimated API call volume
   - Link to privacy policy

### Token Tiers

| Tier | Access | Approval Time |
|------|--------|---------------|
| **Test** | Test accounts only | Immediate |
| **Basic** | Production accounts, limited | 1-2 weeks |
| **Standard** | Production accounts, full | 2-4 weeks |

### Test Accounts

For development without production access:

```python
# Test account IDs start with specific prefixes
TEST_MANAGER_ACCOUNT_ID = "123-456-7890"
TEST_CLIENT_ACCOUNT_ID = "987-654-3210"

# Test accounts don't require token approval
# Can be created in API Center → Test Accounts
```

---

## Authentication (OAuth 2.0)

### OAuth 2.0 Flow

Google Ads API uses OAuth 2.0 for authentication with these steps:

1. **Authorization** → User grants permission
2. **Token Exchange** → Exchange code for tokens
3. **API Calls** → Use access token for requests
4. **Refresh** → Get new access token when expired

### Setting Up OAuth Credentials

**GCP Console:**
1. APIs & Services → Credentials
2. Create Credentials → OAuth client ID
3. Application type: **Desktop app** (for scripts) or **Web application**
4. Download `client_secret.json`

### Environment Variables

```bash
# Required
export GOOGLE_ADS_DEVELOPER_TOKEN="XXXXXXXXXXXXXXXXXXXXXX"
export GOOGLE_ADS_CLIENT_ID="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
export GOOGLE_ADS_CLIENT_SECRET="XXXXXXXXXXXXXXXXXXXXXXXX"
export GOOGLE_ADS_REFRESH_TOKEN="1//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export GOOGLE_ADS_LOGIN_CUSTOMER_ID="123-456-7890"  # Manager account (with dashes)

# Target account (optional, defaults to login customer)
export GOOGLE_ADS_CUSTOMER_ID="987-654-3210"
```

### Getting a Refresh Token

```python
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/adwords']

def get_refresh_token():
    """Run once to obtain refresh token"""
    flow = InstalledAppFlow.from_client_secrets_file(
        'client_secret.json',
        SCOPES
    )
    
    credentials = flow.run_local_server(port=0)
    
    print(f"Refresh token: {credentials.refresh_token}")
    print(f"Token URI: {credentials.token_uri}")
    
    return credentials.refresh_token

# Run this once, then save the refresh token
if __name__ == "__main__":
    get_refresh_token()
```

### Using google-ads Library

```python
from google.ads.googleads.client import GoogleAdsClient

# Initialize with configuration
googleads_client = GoogleAdsClient.load_from_env()

# Or load from yaml
googleads_client = GoogleAdsClient.load_from_storage("google-ads.yaml")
```

### YAML Configuration (google-ads.yaml)

```yaml
developer_token: "XXXXXXXXXXXXXXXXXXXXXX"
client_id: "xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
client_secret: "XXXXXXXXXXXXXXXXXXXXXXXX"
refresh_token: "1//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
login_customer_id: "1234567890"  # No dashes in YAML
```

---

## Customer ID Format

### Format Rules

| Context | Format | Example |
|---------|--------|---------|
| API requests (REST) | With dashes | `123-456-7890` |
| API requests (gRPC) | No dashes | `1234567890` |
| Environment variables | With dashes | `123-456-7890` |
| google-ads.yaml | No dashes | `1234567890` |

### Account Hierarchy

```
Manager Account (MCC)
    ├── Client Account #1
    ├── Client Account #2
    └── Client Account #3
```

**Login Customer ID:** The manager account that has access to child accounts.

**Customer ID:** The specific account to query (can be same as login for non-MCC).

### Code Example

```python
def format_customer_id(customer_id: str, with_dashes: bool = True) -> str:
    """Format customer ID with or without dashes"""
    clean = customer_id.replace("-", "")
    
    if with_dashes:
        return f"{clean[:3]}-{clean[3:6]}-{clean[6:]}"
    return clean

# Usage
api_id = format_customer_id("1234567890", with_dashes=False)  # For gRPC
env_id = format_customer_id("1234567890", with_dashes=True)   # For env
```

---

## Query Structure (GAQL)

### Google Ads Query Language (GAQL)

GAQL is SQL-like syntax for querying Google Ads data:

```sql
SELECT
  campaign.id,
  campaign.name,
  segments.date,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros
FROM campaign
WHERE segments.date >= '2024-01-01'
  AND segments.date <= '2024-01-31'
```

### Key Concepts

| Concept | Description | Example |
|---------|-------------|---------|
| **Resources** | Tables to query | `campaign`, `ad_group`, `ad` |
| **Segments** | Breakdown dimensions | `segments.date`, `segments.device` |
| **Metrics** | Numerical data | `metrics.clicks`, `metrics.cost_micros` |
| **Attributes** | Resource properties | `campaign.name`, `ad_group.status` |

### Cost Handling

Google Ads returns costs in **micros** (millionths of currency unit):

```python
def micros_to_currency(micros: int) -> float:
    """Convert micros to actual currency value"""
    return micros / 1_000_000

# Example
micros = 125000000  # $125.00 in micros
dollars = micros_to_currency(micros)  # 125.0
```

### Common Queries

**Campaign Performance (Daily):**

```sql
SELECT
  campaign.id,
  campaign.name,
  campaign.status,
  segments.date,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions,
  metrics.conversions_value
FROM campaign
WHERE segments.date BETWEEN '2024-01-01' AND '2024-01-31'
```

**Ad Group Performance:**

```sql
SELECT
  ad_group.id,
  ad_group.name,
  campaign.id,
  campaign.name,
  segments.date,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros
FROM ad_group
WHERE segments.date >= '2024-01-01'
```

**Keyword Performance:**

```sql
SELECT
  ad_group_criterion.criterion_id,
  ad_group_criterion.keyword.text,
  ad_group_criterion.keyword.match_type,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions
FROM keyword_view
WHERE segments.date >= '2024-01-01'
```

---

## Common Endpoints

### SearchService

**Method:** `SearchStream` or `Search`

**Purpose:** Execute GAQL queries

```python
from google.ads.googleads.client import GoogleAdsClient

def fetch_campaign_data(client: GoogleAdsClient, customer_id: str):
    """Fetch campaign performance data"""
    ga_service = client.get_service("GoogleAdsService")
    
    query = """
        SELECT
            campaign.id,
            campaign.name,
            segments.date,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions
        FROM campaign
        WHERE segments.date BETWEEN '2024-01-01' AND '2024-01-31'
    """
    
    stream = ga_service.search_stream(
        customer_id=customer_id.replace("-", ""),
        query=query
    )
    
    for batch in stream:
        for row in batch.results:
            print(f"{row.campaign.name}: ${row.metrics.cost_micros / 1_000_000}")
```

### CustomerService

**Purpose:** Get account information

```python
customer_service = client.get_service("CustomerService")
customer = customer_service.get_customer(
    resource_name=f"customers/{customer_id}"
)
print(f"Account: {customer.descriptive_name}")
```

### CampaignService

**Purpose:** Manage campaigns (mutations)

```python
campaign_service = client.get_service("CampaignService")

# Get campaign
campaign = campaign_service.get_campaign(
    resource_name=f"customers/{customer_id}/campaigns/{campaign_id}"
)
```

---

## Error Codes & Troubleshooting

### Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| `AUTHENTICATION_ERROR` | Invalid credentials | Check developer token and OAuth |
| `AUTHORIZATION_ERROR` | Insufficient permissions | Verify account access |
| `DEVELOPER_TOKEN_NOT_APPROVED` | Token pending approval | Wait for Google approval or use test accounts |
| `INVALID_CUSTOMER_ID` | Malformed customer ID | Check format (with/without dashes) |
| `QUOTA_EXCEEDED` | API quota exceeded | Reduce request frequency |
| `QUERY_ERROR` | Invalid GAQL syntax | Check query syntax |

### Authentication Errors

**Error: `USER_PERMISSION_DENIED`**
```
Cause: OAuth user doesn't have access to the Google Ads account
Solution:
- Ensure user has access to the manager account
- Check account hierarchy permissions
- Verify refresh token is for the correct user
```

**Error: `DEVELOPER_TOKEN_PROHIBITED`**
```
Cause: Developer token not approved for production
Solution:
- Use test accounts for development
- Submit token application for production
- Wait for approval (1-4 weeks)
```

### Query Errors

**Error: `SELECT_CLAUSE_REQUIRES_METRICS_OR_SEGMENTS_IF_NON_SEGMENT_RESOURCE_IS_REQUESTED`**
```
Cause: Query selects attributes without metrics or segments
Solution:
- Add metrics or segments to query
- Or query a segmented resource view
```

**Error: `DATE_RANGE_TOO_NARROW` / `DATE_RANGE_TOO_WIDE`**
```
Cause: Invalid date range
Solution:
- Maximum range: 10 years
- Minimum range: 1 day
- Check date format (YYYY-MM-DD)
```

### Rate Limits

| Limit | Value |
|-------|-------|
| Queries per day | 15,000 |
| Operations per day | 10,000 (mutations) |
| Query execution time | 2 minutes max |

---

## Code Examples

### Planned Connector Structure

```python
#!/usr/bin/env python3
"""Google Ads Connector for Rior Systems"""

import os
from datetime import datetime, timedelta
from typing import List, Dict

from google.ads.googleads.client import GoogleAdsClient
from google.cloud import bigquery

class GoogleAdsConnector:
    """Main connector for Google Ads data extraction"""
    
    def __init__(self):
        self.client = GoogleAdsClient.load_from_env()
        self.customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID', '').replace('-', '')
        self.login_customer_id = os.getenv('GOOGLE_ADS_LOGIN_CUSTOMER_ID', '').replace('-', '')
        self.bq_client = bigquery.Client()
    
    def fetch_campaign_insights(
        self, 
        start_date: str, 
        end_date: str
    ) -> List[Dict]:
        """Fetch campaign performance data"""
        ga_service = self.client.get_service("GoogleAdsService")
        
        query = f"""
            SELECT
                campaign.id,
                campaign.name,
                campaign.status,
                segments.date,
                metrics.impressions,
                metrics.clicks,
                metrics.cost_micros,
                metrics.conversions,
                metrics.conversions_value
            FROM campaign
            WHERE segments.date BETWEEN '{start_date}' AND '{end_date}'
        """
        
        results = []
        stream = ga_service.search_stream(
            customer_id=self.customer_id,
            query=query,
            login_customer_id=self.login_customer_id or None
        )
        
        for batch in stream:
            for row in batch.results:
                results.append({
                    'date': row.segments.date,
                    'campaign_id': str(row.campaign.id),
                    'campaign_name': row.campaign.name,
                    'status': row.campaign.status.name,
                    'impressions': row.metrics.impressions,
                    'clicks': row.metrics.clicks,
                    'spend': row.metrics.cost_micros / 1_000_000,
                    'conversions': row.metrics.conversions,
                    'conversion_value': row.metrics.conversions_value
                })
        
        return results
```

### Testing Commands

```bash
# Test API access
google-adsctl --customer-id 123-456-7890 get campaigns

# List accessible accounts
google-adsctl --login-customer-id 123-456-7890 list accounts

# Test GAQL query
google-adsctl query "SELECT campaign.id, campaign.name FROM campaign LIMIT 5"
```

### Environment Setup Script

```bash
#!/bin/bash
# setup_google_ads_env.sh

echo "Setting up Google Ads API environment..."

# Check for required variables
if [ -z "$GOOGLE_ADS_DEVELOPER_TOKEN" ]; then
    echo "Error: GOOGLE_ADS_DEVELOPER_TOKEN not set"
    echo "Get your token from: Google Ads → Tools & Settings → API Center"
    exit 1
fi

if [ -z "$GOOGLE_ADS_REFRESH_TOKEN" ]; then
    echo "Error: GOOGLE_ADS_REFRESH_TOKEN not set"
    echo "Run the OAuth flow to obtain a refresh token"
    exit 1
fi

echo "Environment configured successfully"
echo "Developer Token: ${GOOGLE_ADS_DEVELOPER_TOKEN:0:10}..."
echo "Customer ID: $GOOGLE_ADS_CUSTOMER_ID"
```

---

## BigQuery Schema (Planned)

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | Reporting date |
| `platform` | STRING | Always "google" |
| `account_id` | STRING | Google Ads customer ID |
| `campaign_id` | STRING | Campaign ID |
| `campaign_name` | STRING | Campaign name |
| `campaign_status` | STRING | ENABLED, PAUSED, REMOVED |
| `spend` | FLOAT | Cost in account currency |
| `impressions` | INT | Impressions delivered |
| `clicks` | INT | Clicks received |
| `conversions` | FLOAT | Conversions |
| `conversion_value` | FLOAT | Conversion value |
| `loaded_at` | TIMESTAMP | Load timestamp |

---

## Resources

- **Google Ads API Docs:** https://developers.google.com/google-ads/api/docs/start
- **GAQL Reference:** https://developers.google.com/google-ads/api/fields/v15/overview
- **Developer Token Application:** Google Ads → Tools & Settings → API Center
- **google-ads Python Library:** https://github.com/googleads/google-ads-python
