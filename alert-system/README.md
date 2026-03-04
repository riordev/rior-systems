# Rior Alert System

Automated monitoring and alerting system for Rior Systems clients.

## Overview

The Alert Engine continuously monitors client metrics from BigQuery and sends notifications when performance thresholds are crossed.

## Alert Types

| Severity | Color | Trigger | Action |
|----------|-------|---------|--------|
| **Scale Signal** | 🟢 Green | ROAS > break-even + 30% for 3+ days | Increase ad spend 20% |
| **Underperformance** | 🟡 Amber | ROAS < break-even for 2+ days | Review targeting |
| **Critical** | 🔴 Red | ROAS < break-even - 20% OR no sales 24h | Pause campaigns |
| **Data Integrity** | 🔵 Blue | Missing data > 6 hours | Check connections |

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

```bash
export BIGQUERY_PROJECT_ID="your-gcp-project"
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
```

### 3. Update Configuration

Edit `alerts_config.yaml` with your client settings:

```yaml
clients:
  client_name:
    products:
      - name: "Product Name"
        product_id: "prod_123"
        break_even_roas: 2.5
    thresholds:
      scale_signal:
        roas_threshold_pct: 30
        consecutive_days: 3
```

### 4. Run Alert Check

```bash
python alert_engine.py --check-now
```

## CLI Commands

```bash
# Run alert check immediately
python alert_engine.py --check-now

# List active (unacknowledged) alerts
python alert_engine.py --list-active

# Acknowledge an alert
python alert_engine.py --acknowledge ALERT_ID

# Use custom config file
python alert_engine.py --config /path/to/config.yaml --check-now
```

## Scheduler Setup

### Option 1: Cron (Recommended)

Edit crontab:
```bash
crontab -e
```

Add hourly check:
```cron
# Rior Alert Engine - Run every hour
0 * * * * cd /workspace/rior-systems/alert-system && /usr/bin/python3 alert_engine.py --check-now >> /var/log/rior-alerts.log 2>&1
```

### Option 2: Systemd Timer

Create service file:
```bash
sudo tee /etc/systemd/system/rior-alerts.service << 'EOF'
[Unit]
Description=Rior Alert Engine
After=network.target

[Service]
Type=oneshot
WorkingDirectory=/workspace/rior-systems/alert-system
ExecStart=/usr/bin/python3 alert_engine.py --check-now
Environment=GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
Environment=BIGQUERY_PROJECT_ID=your-project
Environment=DISCORD_WEBHOOK_URL=your-webhook
EOF
```

Create timer file:
```bash
sudo tee /etc/systemd/system/rior-alerts.timer << 'EOF'
[Unit]
Description=Run Rior Alert Engine every hour

[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target
EOF
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable rior-alerts.timer
sudo systemctl start rior-alerts.timer
```

Check status:
```bash
systemctl list-timers --all
journalctl -u rior-alerts.service
```

## BigQuery Schema

### Metrics Table (`client_metrics`)

```sql
CREATE TABLE `{project}.{dataset}.client_metrics` (
    date DATE,
    client_id STRING,
    product_id STRING,
    roas FLOAT64,
    ad_spend FLOAT64,
    revenue FLOAT64,
    conversions INT64,
    updated_at TIMESTAMP
);
```

### Alerts Table (`alerts`)

```sql
CREATE TABLE `{project}.{dataset}.alerts` (
    id STRING,
    client_id STRING,
    product_id STRING,
    severity STRING,
    message STRING,
    action STRING,
    triggered_at TIMESTAMP,
    acknowledged BOOL,
    acknowledged_at TIMESTAMP
);
```

## Discord Integration

The alert engine sends rich embeds to Discord with:
- Color-coded severity indicators
- Alert details and required actions
- Quick action buttons (Acknowledge, View Dashboard)
- For critical alerts: Pause Campaigns button

### Setting up Discord Webhook

1. In Discord, go to Server Settings → Integrations → Webhooks
2. Create New Webhook
3. Copy the webhook URL
4. Set as `DISCORD_WEBHOOK_URL` environment variable

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BIGQUERY_PROJECT_ID` | Yes | GCP project ID |
| `DISCORD_WEBHOOK_URL` | No | Discord webhook for notifications |
| `GOOGLE_APPLICATION_CREDENTIALS` | Yes | Path to service account JSON |
| `EMAIL_USER` | No | SMTP username (if email enabled) |
| `EMAIL_PASS` | No | SMTP password (if email enabled) |

## Testing

Test the alert engine without BigQuery:

```bash
# Test config loading
python -c "from alert_engine import AlertEngine; e = AlertEngine(); print('Config loaded:', list(e.config['clients'].keys()))"
```

## Troubleshooting

### BigQuery Connection Issues

1. Verify service account has BigQuery Data Viewer and Editor roles
2. Check `GOOGLE_APPLICATION_CREDENTIALS` is set correctly
3. Ensure project ID matches your GCP project

### Discord Webhook Not Working

1. Verify webhook URL is valid
2. Check webhook hasn't been deleted in Discord
3. Test webhook: `curl -X POST -H "Content-Type: application/json" -d '{"content":"test"}' WEBHOOK_URL`

### No Alerts Generated

1. Verify metrics data exists in BigQuery
2. Check `client_id` and `product_id` match config
3. Review threshold settings in config
4. Check cooldown periods haven't suppressed alerts

## Directory Structure

```
rior-systems/alert-system/
├── alert_engine.py          # Main Python script
├── alerts_config.yaml       # Client configuration
├── requirements.txt         # Python dependencies
├── README.md               # This file
└── .env                    # Environment variables (not in git)
```

## License

Internal use only — Rior Systems
