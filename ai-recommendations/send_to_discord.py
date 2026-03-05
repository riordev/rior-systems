#!/usr/bin/env python3
"""
Send recommendations to Discord via webhook.
"""

import json
import argparse
import os
from datetime import datetime
from typing import Dict, List, Any

# Try to use discord-webhook library, fallback to requests
try:
    from discord_webhook import DiscordWebhook, DiscordEmbed
    DISCORD_WEBHOOK_AVAILABLE = True
except ImportError:
    DISCORD_WEBHOOK_AVAILABLE = False
    import urllib.request
    import urllib.parse


def format_currency(value: float) -> str:
    """Format as currency."""
    return f"${value:,.2f}"


def get_color_by_priority(priority: int) -> str:
    """Get embed color based on priority."""
    colors = {
        1: "E74C3C",  # High - Red
        2: "F39C12",  # Medium - Orange
        3: "3498DB",  # Low - Blue
    }
    return colors.get(priority, "95A5A6")


def get_color_by_type(rec_type: str) -> str:
    """Get embed color based on recommendation type."""
    colors = {
        "scale_signal": "2ECC71",  # Green
        "underperformance_alert": "E74C3C",  # Red
        "budget_reallocation": "9B59B6",  # Purple
        "product_opportunity": "3498DB",  # Blue
        "seasonal_pattern": "F1C40F",  # Yellow
    }
    return colors.get(rec_type, "95A5A6")


def send_to_discord_webhook(recommendations_data: Dict, webhook_url: str) -> bool:
    """Send recommendations to Discord webhook."""
    
    recs = recommendations_data.get("recommendations", [])
    if not recs:
        print("No recommendations to send")
        return False
    
    # Group by priority for summary
    high_priority = [r for r in recs if r.get("priority") == 1]
    medium_priority = [r for r in recs if r.get("priority") == 2]
    low_priority = [r for r in recs if r.get("priority") == 3]
    
    total_impact = sum(r.get("potential_profit_impact", 0) for r in recs)
    
    if DISCORD_WEBHOOK_AVAILABLE:
        webhook = DiscordWebhook(url=webhook_url)
        
        # Main summary embed
        summary_embed = DiscordEmbed(
            title=f"📊 AI Recommendations - {recommendations_data.get('client_id', 'Unknown')}",
            description=f"Generated {len(recs)} recommendations based on {recommendations_data.get('days_analyzed', 30)} days of data",
            color="3498DB"
        )
        summary_embed.set_timestamp()
        summary_embed.add_embed_field(name="🔴 High Priority", value=str(len(high_priority)), inline=True)
        summary_embed.add_embed_field(name="🟠 Medium Priority", value=str(len(medium_priority)), inline=True)
        summary_embed.add_embed_field(name="🔵 Low Priority", value=str(len(low_priority)), inline=True)
        summary_embed.add_embed_field(name="💰 Total Potential Impact", value=format_currency(total_impact), inline=False)
        webhook.add_embed(summary_embed)
        
        # Individual recommendation embeds (top 5)
        for rec in recs[:5]:
            embed = DiscordEmbed(
                title=f"{rec.get('type_label', 'Recommendation')}: {rec.get('title', '')}",
                description=rec.get("message", ""),
                color=get_color_by_type(rec.get("type", ""))
            )
            embed.add_embed_field(name="Confidence", value=f"{rec.get('confidence', 0)}% ({rec.get('confidence_level', 'Unknown')})", inline=True)
            embed.add_embed_field(name="Potential Impact", value=format_currency(rec.get("potential_profit_impact", 0)), inline=True)
            
            if rec.get("product_name"):
                embed.add_embed_field(name="Product", value=rec["product_name"], inline=True)
            if rec.get("platform"):
                embed.add_embed_field(name="Platform", value=rec["platform"], inline=True)
            
            webhook.add_embed(embed)
        
        response = webhook.execute()
        return response.status_code == 200
    else:
        # Fallback using urllib
        content = {
            "content": f"**📊 AI Recommendations for {recommendations_data.get('client_id', 'Unknown')}**\n"
                      f"Generated {len(recs)} recommendations\n"
                      f"🔴 High: {len(high_priority)} | 🟠 Medium: {len(medium_priority)} | 🔵 Low: {len(low_priority)}\n"
                      f"💰 Total Potential Impact: {format_currency(total_impact)}"
        }
        
        data = json.dumps(content).encode('utf-8')
        req = urllib.request.Request(
            webhook_url,
            data=data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        
        try:
            with urllib.request.urlopen(req) as response:
                return response.status == 204
        except Exception as e:
            print(f"Error sending webhook: {e}")
            return False


def main():
    parser = argparse.ArgumentParser(description="Send recommendations to Discord")
    parser.add_argument("--input", required=True, help="Path to recommendations JSON file")
    parser.add_argument("--webhook-url", default=os.getenv("DISCORD_WEBHOOK_URL"), help="Discord webhook URL")
    
    args = parser.parse_args()
    
    if not args.webhook_url:
        print("Error: No webhook URL provided. Set DISCORD_WEBHOOK_URL env var or use --webhook-url")
        return 1
    
    with open(args.input, 'r') as f:
        data = json.load(f)
    
    success = send_to_discord_webhook(data, args.webhook_url)
    if success:
        print("Successfully sent to Discord")
    else:
        print("Failed to send to Discord")
    
    return 0 if success else 1


if __name__ == "__main__":
    exit(main())
