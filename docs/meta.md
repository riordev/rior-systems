# Meta Marketing Connector API Documentation

Complete reference for the Meta (Facebook) Marketing API connector used in Rior Systems.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Facebook Login OAuth Flow](#facebook-login-oauth-flow)
- [Ad Account Access](#ad-account-access)
- [Campaign Insights Endpoint](#campaign-insights-endpoint)
- [Attribution Window Settings](#attribution-window-settings)
- [Token Refresh Handling](#token-refresh-handling)
- [Error Codes & Troubleshooting](#error-codes--troubleshooting)
- [Code Examples](#code-examples)

---

## Overview

The Meta connector extracts ad spend, impressions, clicks, and conversion data from Meta Marketing API and loads it to BigQuery for ROAS and attribution analysis.

**Source:** `/connectors/meta/meta_connector.py`

**API Version:** v18.0

**Features:**
- Multi-account support
- Daily campaign-level breakdowns
- Automatic retry with exponential backoff
- BigQuery upsert for idempotent loads

---

## Authentication

### Access Token Types

| Type | Use Case | Expiration |
|------|----------|------------|
| **Short-lived** | Initial OAuth | 1 hour |
| **Long-lived** | Server-to-server | 60 days (refreshable) |
| **System User** | Automated systems | Never (recommended) |

### Environment Variable

```bash
export META_ACCESS_TOKEN="EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Required Permissions

The access token needs these permissions:

| Permission | Purpose |
|------------|---------|
| `ads_read` | Read ad account data, campaigns, insights |
| `ads_management` | Access campaign structures |
| `business_management` | Access business-level ad accounts |

---

## Facebook Login OAuth Flow

### Step 1: Authorization URL

```
https://www.facebook.com/v18.0/dialog/oauth?
  client_id={app-id}
  &redirect_uri={redirect-uri}
  &scope=ads_read,ads_management
  &state={random-state}
```

### Step 2: Exchange Code for Token

```python
import requests

def exchange_code_for_token(code: str, app_id: str, app_secret: str, redirect_uri: str):
    """Exchange authorization code for access token"""
    url = "https://graph.facebook.com/v18.0/oauth/access_token"
    params = {
        "client_id": app_id,
        "client_secret": app_secret,
        "redirect_uri": redirect_uri,
        "code": code
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    return {
        "access_token": data["access_token"],
        "expires_in": data["expires_in"]
    }
```

### Step 3: Exchange for Long-lived Token

```python
def exchange_long_lived_token(short_token: str, app_id: str, app_secret: str):
    """Convert short-lived token to long-lived (60 days)"""
    url = "https://graph.facebook.com/v18.0/oauth/access_token"
    params = {
        "grant_type": "fb_exchange_token",
        "client_id": app_id,
        "client_secret": app_secret,
        "fb_exchange_token": short_token
    }
    
    response = requests.get(url, params=params)
    return response.json()["access_token"]
```

### Step 4: Get System User Token (Recommended for Production)

```bash
# Via Business Manager API
curl -X GET "https://graph.facebook.com/v18.0/{business-id}/system_users" \
  -F "access_token={admin-token}"

# Generate system user token
curl -X POST "https://graph.facebook.com/v18.0/{system-user-id}/access_tokens" \
  -F "access_token={admin-token}" \
  -F "app_id={app-id}" \
  -F "scope=ads_read"
```

---

## Ad Account Access

### Fetching Ad Accounts

```python
from meta_connector import MetaAPIClient

client = MetaAPIClient(access_token="EAA...")

# Get all accessible ad accounts
accounts = client.get_ad_accounts()
# Returns: [{"id": "act_123456789", "name": "Main Account"}]
```

### API Endpoint

**GET** `/me/adaccounts`

**Parameters:**

| Parameter | Description |
|-----------|-------------|
| `fields` | Fields to return: `id,name,account_status` |
| `limit` | Maximum results (default 25, max 100) |

**Account Status Codes:**

| Code | Status |
|------|--------|
| `1` | Active |
| `2` | Disabled |
| `3` | Unsettled |
| `7` | Pending Risk Review |
| `9` | In Grace Period |
| `100` | Pending Closure |
| `101` | Closed |
| `201` | Any Active |
| `202` | Any Closed |

### Required Roles

To access an ad account, the user/system user needs one of:

| Role | Permissions |
|------|-------------|
| `ADMIN` | Full access |
| `ADVERTISER` | Create/edit campaigns, view insights |
| `ANALYST` | View insights only |
| `SALES` | Limited access |

---

## Campaign Insights Endpoint

### Endpoint

**GET** `/{ad-account-id}/insights`

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `fields` | string | Comma-separated metrics |
| `time_range` | JSON | `{"since":"YYYY-MM-DD","until":"YYYY-MM-DD"}` |
| `time_increment` | int | `1` for daily, `7` for weekly, `monthly` for monthly |
| `level` | string | `account`, `campaign`, `adset`, `ad` |
| `filtering` | JSON | Filter results |
| `limit` | int | Max results per page (default 25, max 500) |

### Available Fields

**Spend & Performance:**

| Field | Description |
|-------|-------------|
| `spend` | Amount spent in account currency |
| `impressions` | Number of impressions |
| `clicks` | Number of clicks |
| `conversions` | Number of conversions |
| `conversion_values` | Total conversion value |

**Attribution:**

| Field | Description |
|-------|-------------|
| `actions` | Breakdown of actions (purchases, adds to cart) |
| `action_values` | Values for each action type |
| `attribution_setting` | Account's attribution setting |

### Request Example

```python
insights = client.get_insights(
    ad_account_id="act_123456789",
    start_date="2024-01-01",
    end_date="2024-01-31",
    campaign_id="123456789"  # Optional filter
)
```

### Response Format

```json
{
  "data": [
    {
      "date_start": "2024-01-01",
      "date_stop": "2024-01-01",
      "campaign_id": "123456789",
      "campaign_name": "Holiday Sale 2024",
      "spend": "125.50",
      "impressions": "15000",
      "clicks": "450",
      "conversions": [{"action_type": "purchase", "value": "5"}]
    }
  ],
  "paging": {
    "cursors": {
      "after": "MTIzNDU2"
    },
    "next": "https://graph.facebook.com/..."
  }
}
```

---

## Attribution Window Settings

### Understanding Attribution Windows

Meta supports different attribution windows that affect how conversions are credited:

| Window | Description |
|--------|-------------|
| `1d_click` | 1 day after click |
| `7d_click` | 7 days after click (default) |
| `28d_click` | 28 days after click |
| `1d_view` | 1 day after view |
| `7d_view` | 7 days after view (default) |

### Account-Level Attribution Setting

The attribution window is set at the ad account level and affects all insights data:

```python
# Get account attribution setting
GET /{ad-account-id}?fields=attribution_setting

# Response:
{
  "attribution_setting": "7d_click_1d_view"
}
```

### Comparing Attribution Windows

To compare different windows, request `actions` with `action_attribution_windows`:

```python
params = {
    "fields": "spend,impressions,actions",
    "action_attribution_windows": ["1d_click", "7d_click", "28d_click"],
    "time_range": {"since": "2024-01-01", "until": "2024-01-31"}
}
```

### Breakdown by Attribution

```json
{
  "actions": [
    {
      "action_type": "purchase",
      "value": "10",
      "1d_click": "3",
      "7d_click": "8",
      "28d_click": "10"
    }
  ]
}
```

---

## Token Refresh Handling

### Token Expiration Behavior

| Token Type | Expires | Refreshable? |
|------------|---------|--------------|
| Short-lived | 1 hour | Must re-authorize |
| Long-lived | 60 days | Yes, before expiry |
| System User | Never | No |

### Refreshing Long-lived Tokens

Long-lived tokens can be refreshed without user interaction before they expire:

```python
def refresh_long_lived_token(token: str, app_id: str, app_secret: str) -> str:
    """Refresh a long-lived token before expiry"""
    url = "https://graph.facebook.com/v18.0/oauth/access_token"
    params = {
        "grant_type": "fb_exchange_token",
        "client_id": app_id,
        "client_secret": app_secret,
        "fb_exchange_token": token
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    return data["access_token"]
```

**Best Practice:** Refresh tokens every 30 days to ensure continuity.

### Token Validation

```python
def validate_token(access_token: str) -> dict:
    """Check token validity and get metadata"""
    url = "https://graph.facebook.com/debug_token"
    params = {
        "input_token": access_token,
        "access_token": f"{app_id}|{app_secret}"
    }
    
    response = requests.get(url, params=params)
    data = response.json()["data"]
    
    return {
        "is_valid": data["is_valid"],
        "expires_at": data.get("expires_at"),
        "scopes": data.get("scopes", []),
        "app_id": data.get("app_id")
    }
```

---

## Error Codes & Troubleshooting

### HTTP Status Codes

| Code | Meaning | Solution |
|------|---------|----------|
| `200` | Success | - |
| `400` | Bad request | Check parameters |
| `401` | Unauthorized | Token expired or invalid |
| `403` | Forbidden | Missing permissions |
| `404` | Not found | Resource doesn't exist |
| `429` | Rate limited | Slow down requests |
| `500` | Server error | Retry with backoff |

### Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| `1` | Unknown error | Retry |
| `4` | API rate limit | Implement backoff |
| `10` | Permission denied | Check token scopes |
| `17` | User request limit | Too many API calls |
| `102` | Session expired | Refresh token |
| `190` | Access token expired | Get new token |
| `200` | Authorization failed | Re-authenticate |
| `803` | Unknown ad account | Check account ID |
| `80004` | There have been too many calls | Rate limited |

### Rate Limiting

Meta uses multiple rate limits:

| Level | Limit |
|-------|-------|
| User | 200 calls/hour/user |
| App | Rate varies by app tier |
| Ad Account | 100-200 calls/minute |

**Best Practices:**
- Use pagination with `after` cursor
- Implement exponential backoff (connector has this built-in)
- Cache results when possible
- Batch requests when possible

---

## Code Examples

### Basic Usage

```python
from meta_connector import MetaConnector

# Initialize with config
connector = MetaConnector("config.yaml")

# Run extraction for date range
results = connector.run(
    start_date="2024-01-01",
    end_date="2024-01-31"
)

print(f"Loaded {results['records_loaded']} records")
```

### Direct API Client

```python
from meta_connector import MetaAPIClient

client = MetaAPIClient(access_token="EAA...")

# Get ad accounts
accounts = client.get_ad_accounts()
for account in accounts:
    print(f"{account['id']}: {account['name']}")

# Get campaigns
for account in accounts:
    campaigns = client.get_campaigns(account["id"])
    for campaign in campaigns:
        print(f"  - {campaign['name']} ({campaign['status']})")
```

### Custom Insights Query

```python
insights = client.get_insights(
    ad_account_id="act_123456789",
    start_date="2024-01-01",
    end_date="2024-01-31",
    campaign_id="123456789"  # Optional
)

for insight in insights:
    print(f"{insight['date_start']}: ${insight['spend']}")
```

### CLI Usage

```bash
# Basic (last 30 days)
python meta_connector.py

# Specific date range
python meta_connector.py --start-date 2024-01-01 --end-date 2024-01-31

# Dry run (fetch only, no BigQuery load)
python meta_connector.py --dry-run

# Verbose output
python meta_connector.py --verbose
```

### Testing Connection

```bash
# Test token validity
curl "https://graph.facebook.com/debug_token" \
  -F "input_token=$META_ACCESS_TOKEN" \
  -F "access_token=$APP_ID|$APP_SECRET"

# List ad accounts
curl "https://graph.facebook.com/v18.0/me/adaccounts" \
  -F "access_token=$META_ACCESS_TOKEN" \
  -F "fields=id,name,account_status"

# Get insights
curl "https://graph.facebook.com/v18.0/act_123456789/insights" \
  -F "access_token=$META_ACCESS_TOKEN" \
  -F "fields=spend,impressions,clicks" \
  -F "time_range={\"since\":\"2024-01-01\",\"until\":\"2024-01-31\"}"
```

---

## Configuration File

### config.yaml

```yaml
# Meta Marketing API Connector Configuration

# Ad account IDs to extract data from
# If empty, connector will fetch all accessible accounts
ad_accounts:
  - "act_123456789"
  - "act_987654321"

# BigQuery configuration
bigquery:
  project: "rior-prod"
  dataset: "rior_prod"
  table: "ad_spend"

# Extraction settings
extraction:
  # Fields to fetch from insights API
  fields:
    - spend
    - impressions
    - clicks
    - conversions
  
  # Breakdowns (daily, by campaign)
  breakdowns:
    - day
    - campaign
```

---

## BigQuery Schema

The connector loads data to `ad_spend` table:

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | Reporting date |
| `ad_account_id` | STRING | Meta ad account ID |
| `campaign_id` | STRING | Campaign ID |
| `campaign_name` | STRING | Campaign name |
| `spend` | FLOAT | Amount spent |
| `impressions` | INT | Impressions delivered |
| `clicks` | INT | Clicks received |
| `conversions` | FLOAT | Conversions (optional) |
| `platform` | STRING | Always "meta" |
| `loaded_at` | TIMESTAMP | Load timestamp |

---

## Related Files

- **Main Connector:** `/connectors/meta/meta_connector.py`
- **Test Suite:** `/connectors/meta/test_connector.py`
- **Config Example:** `/connectors/meta/config.yaml`
- **Env Example:** `/connectors/meta/.env.example`
