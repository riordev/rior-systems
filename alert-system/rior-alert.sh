#!/bin/bash
# Rior Alert Engine CLI wrapper
# Usage: ./rior-alert.sh [check|list|ack ID]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_PATH="${SCRIPT_DIR}/venv"
PYTHON="${VENV_PATH}/bin/python"
CONFIG="${SCRIPT_DIR}/alerts_config.yaml"

# Check if virtual environment exists, warn if not
if [[ ! -f "$PYTHON" ]]; then
    PYTHON="python3"
    echo "⚠️  Virtual environment not found. Using system Python."
fi

# Load environment variables from .env if exists
if [[ -f "${SCRIPT_DIR}/.env" ]]; then
    export $(grep -v '^#' "${SCRIPT_DIR}/.env" | xargs)
fi

# Validate required env vars
if [[ -z "$BIGQUERY_PROJECT_ID" ]]; then
    echo "❌ Error: BIGQUERY_PROJECT_ID not set"
    echo "   Set it in .env file or export BIGQUERY_PROJECT_ID=your-project"
    exit 1
fi

case "${1:-check}" in
    check|now|--check-now)
        echo "🔍 Running alert check..."
        $PYTHON "${SCRIPT_DIR}/alert_engine.py" --config "$CONFIG" --check-now
        ;;
    list|ls|--list-active)
        echo "📋 Listing active alerts..."
        $PYTHON "${SCRIPT_DIR}/alert_engine.py" --config "$CONFIG" --list-active
        ;;
    ack|acknowledge)
        if [[ -z "${2:-}" ]]; then
            echo "❌ Error: Alert ID required"
            echo "   Usage: $0 ack ALERT_ID"
            exit 1
        fi
        echo "✅ Acknowledging alert ${2}..."
        $PYTHON "${SCRIPT_DIR}/alert_engine.py" --config "$CONFIG" --acknowledge "$2"
        ;;
    test|t)
        echo "🧪 Testing configuration..."
        $PYTHON -c "from alert_engine import AlertEngine; e = AlertEngine('${CONFIG}'); print('✅ Config loaded successfully'); print('Clients:', list(e.config['clients'].keys()))"
        ;;
    help|--help|-h)
        cat << 'EOF'
Rior Alert Engine CLI

Usage: ./rior-alert.sh [COMMAND] [ARGS]

Commands:
  check, now          Run alert check immediately (default)
  list, ls            List active (unacknowledged) alerts
  ack ID              Acknowledge alert by ID
  test, t             Test configuration loading
  help                Show this help message

Examples:
  ./rior-alert.sh check              # Run alert check
  ./rior-alert.sh list               # Show active alerts
  ./rior-alert.sh ack abc123def      # Acknowledge alert
  ./rior-alert.sh test               # Verify config

Environment:
  Set variables in .env file or export them:
    BIGQUERY_PROJECT_ID       Required: GCP project ID
    DISCORD_WEBHOOK_URL       Optional: Discord webhook
    GOOGLE_APPLICATION_...    Required: Path to service account JSON

EOF
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "   Run './rior-alert.sh help' for usage"
        exit 1
        ;;
esac
