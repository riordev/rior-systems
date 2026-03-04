#!/bin/bash
# Rior Alert Engine Setup Script
# Run this to set up the alert system

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "🚀 Setting up Rior Alert Engine..."
echo "   Directory: $SCRIPT_DIR"

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | grep -oP '\d+\.\d+')
REQUIRED_VERSION="3.8"

if ! python3 -c "import sys; exit(0 if sys.version_info >= (3, 8) else 1)" 2>/dev/null; then
    echo "❌ Python 3.8+ required. Found: $PYTHON_VERSION"
    exit 1
fi

echo "✅ Python version: $PYTHON_VERSION"

# Create virtual environment
echo ""
echo "📦 Creating virtual environment..."
if [[ ! -d "${SCRIPT_DIR}/venv" ]]; then
    python3 -m venv "${SCRIPT_DIR}/venv"
    echo "✅ Virtual environment created"
else
    echo "⚠️  Virtual environment already exists"
fi

# Activate and install dependencies
echo ""
echo "📦 Installing dependencies..."
source "${SCRIPT_DIR}/venv/bin/activate"
pip install --upgrade pip
pip install -r "${SCRIPT_DIR}/requirements.txt"
echo "✅ Dependencies installed"

# Make scripts executable
echo ""
echo "🔧 Setting permissions..."
chmod +x "${SCRIPT_DIR}/alert_engine.py"
chmod +x "${SCRIPT_DIR}/rior-alert.sh"
echo "✅ Scripts are executable"

# Check for .env file
echo ""
if [[ ! -f "${SCRIPT_DIR}/.env" ]]; then
    echo "⚠️  Environment file not found"
    echo "   Copying .env.example to .env..."
    cp "${SCRIPT_DIR}/.env.example" "${SCRIPT_DIR}/.env"
    echo "✅ Created .env file - EDIT THIS FILE WITH YOUR SETTINGS"
else
    echo "✅ .env file exists"
fi

# Test configuration loading
echo ""
echo "🧪 Testing configuration..."
if python3 -c "import yaml; yaml.safe_load(open('${SCRIPT_DIR}/alerts_config.yaml'))" 2>/dev/null; then
    echo "✅ Configuration file is valid YAML"
else
    echo "❌ Configuration file has errors"
fi

echo ""
echo "=" 
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit ${SCRIPT_DIR}/.env with your credentials"
echo "  2. Update ${SCRIPT_DIR}/alerts_config.yaml with client settings"
echo "  3. Set up BigQuery tables (see README.md)"
echo "  4. Test with: ./rior-alert.sh test"
echo "  5. Run first check: ./rior-alert.sh check"
echo ""
echo "To schedule automatic checks, see README.md (Cron/Systemd sections)"
echo "=" 
