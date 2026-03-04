#!/usr/bin/env python3
"""
Rior Systems Alert Engine
Monitors client metrics and sends alerts when thresholds are crossed.
"""

import os
import sys
import argparse
import json
import yaml
import logging
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from typing import Optional, List, Dict, Any
from enum import Enum
import hashlib

# BigQuery
from google.cloud import bigquery
from google.cloud.bigquery import QueryJobConfig

# Notifications
import requests

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class AlertSeverity(Enum):
    SCALE_SIGNAL = "scale_signal"           # Green
    UNDERPERFORMANCE = "underperformance"   # Amber
    CRITICAL = "critical"                   # Red
    DATA_INTEGRITY = "data_integrity"       # Blue


@dataclass
class Alert:
    id: str
    client_id: str
    product_id: str
    severity: AlertSeverity
    message: str
    action: str
    triggered_at: datetime
    acknowledged: bool = False
    acknowledged_at: Optional[datetime] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'client_id': self.client_id,
            'product_id': self.product_id,
            'severity': self.severity.value,
            'message': self.message,
            'action': self.action,
            'triggered_at': self.triggered_at.isoformat(),
            'acknowledged': self.acknowledged,
            'acknowledged_at': self.acknowledged_at.isoformat() if self.acknowledged_at else None
        }


class AlertEngine:
    def __init__(self, config_path: str = "alerts_config.yaml"):
        self.config = self._load_config(config_path)
        self.bq_client = None
        self._init_bigquery()
    
    def _load_config(self, path: str) -> Dict:
        """Load configuration from YAML file."""
        with open(path, 'r') as f:
            config = yaml.safe_load(f)
        
        # Expand environment variables
        config_str = yaml.dump(config)
        config_str = os.path.expandvars(config_str)
        return yaml.safe_load(config_str)
    
    def _init_bigquery(self):
        """Initialize BigQuery client."""
        try:
            project_id = self.config['bigquery']['project_id']
            self.bq_client = bigquery.Client(project=project_id)
            logger.info(f"BigQuery client initialized for project: {project_id}")
        except Exception as e:
            logger.error(f"Failed to initialize BigQuery: {e}")
            self.bq_client = None
    
    def _generate_alert_id(self, client_id: str, product_id: str, severity: str) -> str:
        """Generate unique alert ID."""
        data = f"{client_id}:{product_id}:{severity}:{datetime.utcnow().strftime('%Y%m%d')}"
        return hashlib.md5(data.encode()).hexdigest()[:12]
    
    def _check_cooldown(self, client_id: str, product_id: str, severity: AlertSeverity) -> bool:
        """Check if alert is in cooldown period."""
        if not self.bq_client:
            return False
        
        dataset = self.config['bigquery']['dataset']
        table = self.config['bigquery']['alerts_table']
        cooldown_hours = self.config['clients'].get(client_id, {}).get('cooldowns', {}).get(severity.value, 24)
        
        query = f"""
        SELECT COUNT(*) as recent_count
        FROM `{dataset}.{table}`
        WHERE client_id = @client_id
          AND product_id = @product_id
          AND severity = @severity
          AND triggered_at > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL @cooldown_hours HOUR)
          AND (acknowledged = FALSE OR acknowledged_at > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL @cooldown_hours HOUR))
        """
        
        job_config = QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("client_id", "STRING", client_id),
                bigquery.ScalarQueryParameter("product_id", "STRING", product_id),
                bigquery.ScalarQueryParameter("severity", "STRING", severity.value),
                bigquery.ScalarQueryParameter("cooldown_hours", "INT64", cooldown_hours),
            ]
        )
        
        try:
            result = self.bq_client.query(query, job_config=job_config).result()
            row = list(result)[0]
            return row.recent_count > 0
        except Exception as e:
            logger.error(f"Cooldown check failed: {e}")
            return False
    
    def _get_metrics(self, client_id: str, product_id: str, days: int = 7) -> List[Dict]:
        """Fetch recent metrics from BigQuery."""
        if not self.bq_client:
            logger.error("BigQuery client not available")
            return []
        
        dataset = self.config['bigquery']['dataset']
        table = self.config['bigquery']['metrics_table']
        
        query = f"""
        SELECT 
            date,
            roas,
            ad_spend,
            revenue,
            conversions,
            updated_at
        FROM `{dataset}.{table}`
        WHERE client_id = @client_id
          AND product_id = @product_id
          AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY)
        ORDER BY date DESC
        """
        
        job_config = QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("client_id", "STRING", client_id),
                bigquery.ScalarQueryParameter("product_id", "STRING", product_id),
                bigquery.ScalarQueryParameter("days", "INT64", days),
            ]
        )
        
        try:
            results = self.bq_client.query(query, job_config=job_config).result()
            return [dict(row) for row in results]
        except Exception as e:
            logger.error(f"Failed to fetch metrics: {e}")
            return []
    
    def _check_scale_signal(self, metrics: List[Dict], thresholds: Dict, break_even_roas: float) -> Optional[Alert]:
        """Check for scale signal (green alert)."""
        required_days = thresholds['consecutive_days']
        threshold_pct = thresholds['roas_threshold_pct']
        target_roas = break_even_roas * (1 + threshold_pct / 100)
        
        if len(metrics) < required_days:
            return None
        
        recent_days = metrics[:required_days]
        all_above_threshold = all(
            day.get('roas', 0) >= target_roas and day.get('conversions', 0) > 0
            for day in recent_days
        )
        
        if all_above_threshold:
            return {
                'severity': AlertSeverity.SCALE_SIGNAL,
                'message': f"ROAS above {target_roas:.2f} (break-even + {threshold_pct}%) for {required_days}+ consecutive days",
                'action': "Ready to scale — increase ad spend 20%"
            }
        return None
    
    def _check_underperformance(self, metrics: List[Dict], thresholds: Dict, break_even_roas: float) -> Optional[Alert]:
        """Check for underperformance (amber alert)."""
        required_days = thresholds['roas_below_break_even_days']
        
        if len(metrics) < required_days:
            return None
        
        recent_days = metrics[:required_days]
        all_below_break_even = all(
            0 < day.get('roas', float('inf')) < break_even_roas
            for day in recent_days
        )
        
        if all_below_break_even:
            return {
                'severity': AlertSeverity.UNDERPERFORMANCE,
                'message': f"ROAS below break-even ({break_even_roas}) for {required_days}+ consecutive days",
                'action': "Below break-even — review targeting"
            }
        return None
    
    def _check_critical(self, metrics: List[Dict], thresholds: Dict, break_even_roas: float) -> Optional[Alert]:
        """Check for critical conditions (red alert)."""
        critical_threshold = break_even_roas * (1 - thresholds['roas_below_break_even_pct'] / 100)
        no_sales_hours = thresholds['no_sales_hours']
        
        if not metrics:
            # Check for missing data
            return {
                'severity': AlertSeverity.CRITICAL,
                'message': f"No metrics data available for {no_sales_hours}+ hours",
                'action': "Urgent: Check Shopify/Meta connection — pause campaigns if needed"
            }
        
        latest = metrics[0]
        
        # Check ROAS critical threshold
        if latest.get('roas', float('inf')) < critical_threshold:
            return {
                'severity': AlertSeverity.CRITICAL,
                'message': f"ROAS critically low: {latest.get('roas', 0):.2f} (below {critical_threshold:.2f})",
                'action': "Urgent: Product hemorrhaging — pause campaigns"
            }
        
        # Check no sales
        last_updated = latest.get('updated_at')
        if last_updated:
            hours_since_update = (datetime.utcnow() - last_updated).total_seconds() / 3600
            if hours_since_update > no_sales_hours or latest.get('conversions', 0) == 0:
                return {
                    'severity': AlertSeverity.CRITICAL,
                    'message': f"No sales for {no_sales_hours}+ hours",
                    'action': "Urgent: Check Shopify/Meta connection — pause campaigns"
                }
        
        return None
    
    def _check_data_integrity(self, metrics: List[Dict], thresholds: Dict) -> Optional[Alert]:
        """Check for data integrity issues."""
        missing_data_hours = thresholds['missing_data_hours']
        
        if not metrics:
            return {
                'severity': AlertSeverity.DATA_INTEGRITY,
                'message': "No recent metrics data available",
                'action': "Check Shopify/Meta connection"
            }
        
        latest = metrics[0]
        last_updated = latest.get('updated_at')
        
        if last_updated:
            hours_since_update = (datetime.utcnow() - last_updated).total_seconds() / 3600
            if hours_since_update > missing_data_hours:
                return {
                    'severity': AlertSeverity.DATA_INTEGRITY,
                    'message': f"Data stale: Last update {hours_since_update:.1f} hours ago",
                    'action': "Check Shopify/Meta connection"
                }
        
        return None
    
    def check_client(self, client_id: str) -> List[Alert]:
        """Check all products for a client and generate alerts."""
        client_config = self.config['clients'].get(client_id)
        if not client_config:
            logger.warning(f"No configuration found for client: {client_id}")
            return []
        
        alerts = []
        thresholds = client_config['thresholds']
        
        for product in client_config['products']:
            product_id = product['product_id']
            product_name = product['name']
            break_even_roas = product['break_even_roas']
            
            logger.info(f"Checking {client_id}/{product_name}...")
            
            metrics = self._get_metrics(client_id, product_id)
            
            # Check conditions in order of severity (critical first)
            checks = [
                self._check_critical(metrics, thresholds['critical'], break_even_roas),
                self._check_data_integrity(metrics, thresholds['data_integrity']),
                self._check_underperformance(metrics, thresholds['underperformance'], break_even_roas),
                self._check_scale_signal(metrics, thresholds['scale_signal'], break_even_roas),
            ]
            
            for alert_data in checks:
                if alert_data:
                    severity = alert_data['severity']
                    
                    # Check cooldown
                    if self._check_cooldown(client_id, product_id, severity):
                        logger.info(f"Alert in cooldown: {severity.value} for {product_name}")
                        continue
                    
                    alert = Alert(
                        id=self._generate_alert_id(client_id, product_id, severity.value),
                        client_id=client_id,
                        product_id=product_id,
                        severity=severity,
                        message=f"[{product_name}] {alert_data['message']}",
                        action=alert_data['action'],
                        triggered_at=datetime.utcnow()
                    )
                    alerts.append(alert)
                    logger.warning(f"ALERT: {alert.message}")
                    break  # Only highest severity alert per product
        
        return alerts
    
    def check_all(self) -> List[Alert]:
        """Check all configured clients."""
        all_alerts = []
        for client_id in self.config['clients']:
            alerts = self.check_client(client_id)
            all_alerts.extend(alerts)
        return all_alerts
    
    def store_alert(self, alert: Alert):
        """Store alert in BigQuery."""
        if not self.bq_client:
            logger.error("Cannot store alert: BigQuery not available")
            return False
        
        dataset = self.config['bigquery']['dataset']
        table = self.config['bigquery']['alerts_table']
        
        query = f"""
        INSERT INTO `{dataset}.{table}` (id, client_id, product_id, severity, message, action, triggered_at, acknowledged)
        VALUES (@id, @client_id, @product_id, @severity, @message, @action, @triggered_at, @acknowledged)
        """
        
        job_config = QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("id", "STRING", alert.id),
                bigquery.ScalarQueryParameter("client_id", "STRING", alert.client_id),
                bigquery.ScalarQueryParameter("product_id", "STRING", alert.product_id),
                bigquery.ScalarQueryParameter("severity", "STRING", alert.severity.value),
                bigquery.ScalarQueryParameter("message", "STRING", alert.message),
                bigquery.ScalarQueryParameter("action", "STRING", alert.action),
                bigquery.ScalarQueryParameter("triggered_at", "TIMESTAMP", alert.triggered_at),
                bigquery.ScalarQueryParameter("acknowledged", "BOOL", alert.acknowledged),
            ]
        )
        
        try:
            self.bq_client.query(query, job_config=job_config).result()
            logger.info(f"Alert stored: {alert.id}")
            return True
        except Exception as e:
            logger.error(f"Failed to store alert: {e}")
            return False
    
    def send_discord_notification(self, alert: Alert):
        """Send Discord webhook notification."""
        if not self.config['notifications']['discord']['enabled']:
            return
        
        webhook_url = self.config['notifications']['discord']['webhook_url']
        if not webhook_url or webhook_url == "${DISCORD_WEBHOOK_URL}":
            logger.warning("Discord webhook URL not configured")
            return
        
        colors = self.config['severity_colors']
        color = colors.get(alert.severity.value, 3447003)
        
        emoji_map = {
            'scale_signal': '🟢',
            'underperformance': '🟡',
            'critical': '🔴',
            'data_integrity': '🔵'
        }
        emoji = emoji_map.get(alert.severity.value, '⚠️')
        
        embed = {
            "title": f"{emoji} Rior Alert: {alert.severity.value.replace('_', ' ').title()}",
            "description": alert.message,
            "color": color,
            "fields": [
                {
                    "name": "📋 Action Required",
                    "value": alert.action,
                    "inline": False
                },
                {
                    "name": "🏢 Client",
                    "value": alert.client_id,
                    "inline": True
                },
                {
                    "name": "🆔 Alert ID",
                    "value": alert.id,
                    "inline": True
                }
            ],
            "timestamp": alert.triggered_at.isoformat(),
            "footer": {
                "text": "Rior Systems Alert Engine"
            }
        }
        
        payload = {
            "embeds": [embed],
            "components": [
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "label": "✅ Acknowledge",
                            "style": 3,
                            "custom_id": f"ack_{alert.id}"
                        },
                        {
                            "type": 2,
                            "label": "📊 View Dashboard",
                            "style": 5,
                            "url": f"https://riorsystems.com/dashboard/{alert.client_id}"
                        }
                    ]
                }
            ] if alert.severity != AlertSeverity.CRITICAL else [
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "label": "🛑 Pause Campaigns",
                            "style": 4,
                            "custom_id": f"pause_{alert.id}"
                        },
                        {
                            "type": 2,
                            "label": "✅ Acknowledge",
                            "style": 3,
                            "custom_id": f"ack_{alert.id}"
                        }
                    ]
                }
            ]
        }
        
        try:
            response = requests.post(webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            logger.info(f"Discord notification sent for alert {alert.id}")
        except Exception as e:
            logger.error(f"Failed to send Discord notification: {e}")
    
    def list_active_alerts(self) -> List[Alert]:
        """List all active (unacknowledged) alerts."""
        if not self.bq_client:
            logger.error("BigQuery not available")
            return []
        
        dataset = self.config['bigquery']['dataset']
        table = self.config['bigquery']['alerts_table']
        
        query = f"""
        SELECT id, client_id, product_id, severity, message, action, triggered_at, acknowledged, acknowledged_at
        FROM `{dataset}.{table}`
        WHERE acknowledged = FALSE
        ORDER BY 
            CASE severity
                WHEN 'critical' THEN 1
                WHEN 'underperformance' THEN 2
                WHEN 'data_integrity' THEN 3
                WHEN 'scale_signal' THEN 4
            END,
            triggered_at DESC
        """
        
        try:
            results = self.bq_client.query(query).result()
            alerts = []
            for row in results:
                alert = Alert(
                    id=row.id,
                    client_id=row.client_id,
                    product_id=row.product_id,
                    severity=AlertSeverity(row.severity),
                    message=row.message,
                    action=row.action,
                    triggered_at=row.triggered_at,
                    acknowledged=row.acknowledged,
                    acknowledged_at=row.acknowledged_at
                )
                alerts.append(alert)
            return alerts
        except Exception as e:
            logger.error(f"Failed to list alerts: {e}")
            return []
    
    def acknowledge_alert(self, alert_id: str) -> bool:
        """Acknowledge an alert by ID."""
        if not self.bq_client:
            logger.error("BigQuery not available")
            return False
        
        dataset = self.config['bigquery']['dataset']
        table = self.config['bigquery']['alerts_table']
        
        query = f"""
        UPDATE `{dataset}.{table}`
        SET acknowledged = TRUE, acknowledged_at = CURRENT_TIMESTAMP()
        WHERE id = @alert_id
        """
        
        job_config = QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("alert_id", "STRING", alert_id),
            ]
        )
        
        try:
            result = self.bq_client.query(query, job_config=job_config).result()
            logger.info(f"Alert acknowledged: {alert_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to acknowledge alert: {e}")
            return False
    
    def run_check(self) -> List[Alert]:
        """Run full alert check cycle."""
        logger.info("=" * 50)
        logger.info("Starting Rior Alert Engine check")
        logger.info("=" * 50)
        
        alerts = self.check_all()
        
        for alert in alerts:
            self.store_alert(alert)
            self.send_discord_notification(alert)
        
        logger.info(f"Check complete. Generated {len(alerts)} alerts.")
        return alerts


def main():
    parser = argparse.ArgumentParser(
        description="Rior Systems Alert Engine",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python alert_engine.py --check-now          Run alert check immediately
  python alert_engine.py --list-active        List active alerts
  python alert_engine.py --acknowledge ABC123 Acknowledge alert by ID
        """
    )
    
    parser.add_argument('--config', default='alerts_config.yaml',
                        help='Path to configuration file')
    parser.add_argument('--check-now', action='store_true',
                        help='Run alert check immediately')
    parser.add_argument('--list-active', action='store_true',
                        help='List active (unacknowledged) alerts')
    parser.add_argument('--acknowledge', metavar='ALERT_ID',
                        help='Acknowledge alert by ID')
    
    args = parser.parse_args()
    
    engine = AlertEngine(args.config)
    
    if args.check_now:
        alerts = engine.run_check()
        if alerts:
            print(f"\n{'='*60}")
            print(f"🚨 {len(alerts)} ALERT(S) GENERATED")
            print(f"{'='*60}")
            for alert in alerts:
                emoji = {'scale_signal': '🟢', 'underperformance': '🟡', 'critical': '🔴', 'data_integrity': '🔵'}.get(alert.severity.value, '⚠️')
                print(f"\n{emoji} [{alert.severity.value.upper()}] {alert.id}")
                print(f"   {alert.message}")
                print(f"   → {alert.action}")
        else:
            print("\n✅ No alerts generated — all systems normal.")
    
    elif args.list_active:
        alerts = engine.list_active_alerts()
        if alerts:
            print(f"\n{'='*60}")
            print(f"🚨 {len(alerts)} ACTIVE ALERT(S)")
            print(f"{'='*60}")
            for alert in alerts:
                emoji = {'scale_signal': '🟢', 'underperformance': '🟡', 'critical': '🔴', 'data_integrity': '🔵'}.get(alert.severity.value, '⚠️')
                age = (datetime.utcnow() - alert.triggered_at).total_seconds() / 3600
                print(f"\n{emoji} [{alert.severity.value.upper()}] ID: {alert.id}")
                print(f"   Client: {alert.client_id} | Product: {alert.product_id}")
                print(f"   Message: {alert.message}")
                print(f"   Age: {age:.1f} hours | To acknowledge: --acknowledge {alert.id}")
        else:
            print("\n✅ No active alerts.")
    
    elif args.acknowledge:
        success = engine.acknowledge_alert(args.acknowledge)
        if success:
            print(f"✅ Alert {args.acknowledge} acknowledged")
        else:
            print(f"❌ Failed to acknowledge alert {args.acknowledge}")
            sys.exit(1)
    
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
