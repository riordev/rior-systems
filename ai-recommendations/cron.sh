#!/bin/bash
# Daily cron job for AI Recommendations Engine
# Add to crontab: 0 6 * * * /Users/johnbot/.openclaw/workspace/rior-systems/ai-recommendations/cron.sh

cd /Users/johnbot/.openclaw/workspace/rior-systems/ai-recommendations

# Load environment variables
export GOOGLE_APPLICATION_CREDENTIALS="${GOOGLE_APPLICATION_CREDENTIALS:-/path/to/service-account.json}"
export GCP_PROJECT_ID="${GCP_PROJECT_ID:-rior-systems}"

# Run for each client
CLIENTS=("client_001" "client_002" "client_003")

for CLIENT_ID in "${CLIENTS[@]}"; do
    echo "Processing recommendations for $CLIENT_ID..."
    
    python3 recommendation_engine.py \
        --client-id="$CLIENT_ID" \
        --days=30 \
        --output="output/${CLIENT_ID}_$(date +%Y%m%d).json"
    
    # Send to Discord (optional webhook)
    if [ -n "$DISCORD_WEBHOOK_URL" ]; then
        python3 send_to_discord.py \
            --input="output/${CLIENT_ID}_$(date +%Y%m%d).json" \
            --webhook-url="$DISCORD_WEBHOOK_URL"
    fi
    
    # Upload to Looker Studio bucket
    if [ -n "$LOOKER_STUDIO_BUCKET" ]; then
        gsutil cp "output/${CLIENT_ID}_$(date +%Y%m%d).json" \
            "gs://${LOOKER_STUDIO_BUCKET}/recommendations/"
    fi
done

echo "Recommendations generated at $(date)"
