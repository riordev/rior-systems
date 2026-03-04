# Meta Marketing API Connector

Python connector for extracting ad spend data from Meta Marketing API and loading to BigQuery.

## Setup

1. Set environment variable:
```bash
export META_ACCESS_TOKEN="your_meta_access_token"
```

2. Configure ad accounts in `config.yaml`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

```bash
# Basic usage (last 30 days)
python meta_connector.py

# Specific date range
python meta_connector.py --start-date 2024-01-01 --end-date 2024-03-01

# Dry run (fetch only, no load)
python meta_connector.py --dry-run
```

## Configuration

Edit `config.yaml`:
```yaml
ad_accounts:
  - "act_123456789"
  - "act_987654321"

bigquery:
  project: "rior-prod"
  dataset: "rior_prod"
  table: "ad_spend"
```
