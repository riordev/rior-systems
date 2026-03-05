# 🤖 Rior Systems AI Recommendations Engine

A Python service that generates actionable recommendations from profit data by analyzing BigQuery datasets (orders, products, ad_spend).

## Features

### 5 Recommendation Types

1. **Scale Signals** 🚀
   - Trigger: Product ROAS exceeds break-even by 30%+ for 3+ days
   - Action: Increase budget by 20%
   - Example: *"Increase Sailor Tee budget by 20%. Current ROAS: 3.4x, Target: 2.5x"*

2. **Underperformance Alerts** ⚠️
   - Trigger: Product ROAS drops below break-even
   - Action: Pause or adjust targeting
   - Example: *"Anchor Hat losing money at 1.8x ROAS. Consider pausing or adjusting targeting."*

3. **Budget Reallocation** 💰
   - Trigger: Significant ROAS difference between platforms
   - Action: Shift budget from low to high performers
   - Example: *"Shift $500/day from TikTok to Meta retargeting for +$XXX profit."*

4. **Product Opportunities** 💎
   - Trigger: High margin (60%+) but low ad spend
   - Action: Test scaling high-margin products
   - Example: *"Dock Shorts has 57% margin but only $2k ad spend. Test scaling."*

5. **Seasonal Patterns** 📅
   - Trigger: Day-of-week ROAS variations (e.g., weekend uplift)
   - Action: Adjust daily budgets
   - Example: *"Weekend ROAS 20% higher. Increase weekend budgets."*

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Set up Google Cloud credentials (for BigQuery access)
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
export GCP_PROJECT_ID=rior-systems
```

## Usage

### Basic Usage

```bash
# Generate recommendations for a client
python recommendation_engine.py --client-id=CLIENT_001 --days=30

# Custom break-even ROAS
python recommendation_engine.py --client-id=CLIENT_001 --days=30 --break-even-roas=2.0

# Use mock data (no BigQuery connection needed)
python recommendation_engine.py --client-id=CLIENT_001 --days=30 --mock
```

### CLI Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| `--client-id` | Required | Client identifier |
| `--days` | 30 | Days of data to analyze |
| `--project-id` | `rior-systems` | GCP Project ID |
| `--credentials` | env var | Path to service account JSON |
| `--break-even-roas` | 2.5 | Break-even ROAS threshold |
| `--output` | `recommendations.json` | Output file path |
| `--mock` | false | Use mock data instead of BigQuery |

## Output Format

The engine generates a JSON file with the following structure:

```json
{
  "generated_at": "2024-01-15T08:30:00",
  "client_id": "CLIENT_001",
  "days_analyzed": 30,
  "break_even_roas": 2.5,
  "total_recommendations": 5,
  "recommendations": [
    {
      "id": "scale_PROD-123_20240115",
      "type": "scale_signal",
      "type_label": "Scale Signal",
      "title": "Scale Sailor Tee",
      "message": "Increase Sailor Tee budget by 20%...",
      "confidence": 85,
      "confidence_level": "High",
      "potential_profit_impact": 12500.00,
      "product_id": "PROD-123",
      "product_name": "Sailor Tee",
      "platform": null,
      "metrics": {
        "current_roas": 3.4,
        "break_even_roas": 2.5,
        "high_roas_days": 5
      },
      "created_at": "2024-01-15T08:30:00",
      "priority": 1
    }
  ]
}
```

## Integration

### Daily Cron Job

Add to crontab for daily execution:

```bash
# Edit crontab
crontab -e

# Add line (runs at 6 AM daily)
0 6 * * * /Users/johnbot/.openclaw/workspace/rior-systems/ai-recommendations/cron.sh
```

### Looker Studio

1. Upload recommendations to a GCS bucket
2. Connect Looker Studio to the JSON/CSV data
3. Create dashboards showing:
   - Open recommendations by type
   - Confidence scores over time
   - Potential profit impact

### Discord Alerts

```bash
# Send recommendations to Discord webhook
export DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
python send_to_discord.py --input=recommendations.json
```

Or use the cron.sh script which includes Discord integration.

## BigQuery Schema

### Expected Tables

**orders**
- order_id (STRING)
- client_id (STRING)
- product_id (STRING)
- product_name (STRING)
- platform (STRING)
- order_date (DATE)
- revenue (FLOAT)
- cost (FLOAT)
- units_sold (INTEGER)
- ad_spend (FLOAT)

**products**
- product_id (STRING)
- client_id (STRING)
- product_name (STRING)
- category (STRING)
- cost_price (FLOAT)
- sale_price (FLOAT)
- margin_percent (FLOAT)

**ad_spend**
- date (DATE)
- client_id (STRING)
- platform (STRING)
- product_id (STRING)
- spend (FLOAT)
- impressions (INTEGER)
- clicks (INTEGER)
- conversions (INTEGER)
- revenue (FLOAT)

## Configuration

Edit `config.json` to customize thresholds:

```json
{
  "break_even_roas": 2.5,
  "scale_signal_threshold": 1.3,
  "scale_signal_days": 3,
  "min_margin_percent": 60,
  "low_spend_threshold": 5000,
  "weekend_uplift_threshold": 1.15
}
```

## Testing

Run with mock data to test the engine:

```bash
python recommendation_engine.py --client-id=TEST_CLIENT --days=30 --mock --output=test_output.json
cat test_output.json | python -m json.tool
```

## License

Private - Rior Systems
