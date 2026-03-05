#!/usr/bin/env python3
"""
Rior Systems Proposal Generator
Generates customized HTML proposals from templates and client data.

Usage:
    python generate.py --client client-data.json --tier tier1 --output proposal.html
    python generate.py --client client-data.json --tier tier2 --output proposal.html
    python generate.py --client client-data.json --tier enterprise --output proposal.html
"""

import argparse
import json
import re
import os
import sys
from datetime import datetime
from pathlib import Path

# Template directory
TEMPLATE_DIR = Path(__file__).parent / "templates"

# Default values for missing fields
DEFAULTS = {
    "CLIENT_NAME": "Your Company",
    "STORE_URL": "your-store.myshopify.com",
    "AD_SPEND": "$10,000+",
    "DATE": datetime.now().strftime("%B %d, %Y"),
    "PROPOSAL_ID": f"RS-{datetime.now().strftime('%Y%m%d')}-001"
}


def load_template(tier: str) -> str:
    """Load the appropriate template file."""
    template_map = {
        "tier1": "tier1.html",
        "tier2": "tier2.html", 
        "enterprise": "enterprise.html",
        "1": "tier1.html",
        "2": "tier2.html",
        "3": "enterprise.html"
    }
    
    template_file = template_map.get(tier.lower())
    if not template_file:
        raise ValueError(f"Unknown tier: {tier}. Use tier1, tier2, or enterprise")
    
    template_path = TEMPLATE_DIR / template_file
    if not template_path.exists():
        raise FileNotFoundError(f"Template not found: {template_path}")
    
    return template_path.read_text(encoding='utf-8')


def load_client_data(client_path: str) -> dict:
    """Load client data from JSON file."""
    with open(client_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Flatten nested structures for template substitution
    flattened = {}
    
    def flatten(obj, prefix=""):
        if isinstance(obj, dict):
            for key, value in obj.items():
                new_key = f"{prefix}{key.upper()}" if prefix else key.upper()
                if isinstance(value, (dict, list)):
                    flatten(value, f"{new_key}_")
                else:
                    flattened[new_key] = str(value) if value is not None else ""
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                flatten(item, f"{prefix}{i}_")
    
    flatten(data)
    return flattened


def fill_template(template: str, data: dict) -> str:
    """Replace template variables with client data."""
    # Merge with defaults
    merged = {**DEFAULTS, **data}
    
    # Replace {{VARIABLE}} patterns
    def replace_var(match):
        var_name = match.group(1).upper()
        return merged.get(var_name, match.group(0))
    
    filled = re.sub(r'\{\{(\w+)\}\}', replace_var, template)
    
    return filled


def validate_data(data: dict, tier: str) -> list:
    """Check for missing critical fields and return warnings."""
    warnings = []
    
    critical_fields = ["CLIENT_NAME", "STORE_URL"]
    recommended_fields = ["AD_SPEND", "CONTACT_NAME", "CONTACT_EMAIL"]
    
    for field in critical_fields:
        if field not in data or not data[field]:
            warnings.append(f"⚠️  Missing critical field: {field}")
    
    for field in recommended_fields:
        if field not in data or not data[field]:
            warnings.append(f"ℹ️  Missing recommended field: {field}")
    
    return warnings


def generate_proposal(client_data_path: str, tier: str, output_path: str = None) -> str:
    """Generate a complete proposal."""
    # Load data
    client_data = load_client_data(client_data_path)
    
    # Load template
    template = load_template(tier)
    
    # Validate
    warnings = validate_data(client_data, tier)
    for warning in warnings:
        print(warning, file=sys.stderr)
    
    # Fill template
    proposal = fill_template(template, client_data)
    
    # Determine output path
    if not output_path:
        client_name = client_data.get("CLIENT_NAME", "client").replace(" ", "-").lower()
        output_path = f"proposal-{client_name}-{tier}-{datetime.now().strftime('%Y%m%d')}.html"
    
    # Write output
    output_file = Path(output_path)
    output_file.write_text(proposal, encoding='utf-8')
    
    return str(output_file.absolute())


def interactive_mode():
    """Run in interactive mode to collect client data."""
    print("🚀 Rior Systems Proposal Generator")
    print("=" * 50)
    print()
    
    data = {}
    
    print("Let's collect client information:")
    print("-" * 30)
    
    data["client_name"] = input("Client company name: ").strip()
    data["store_url"] = input("Shopify store URL: ").strip()
    data["ad_spend"] = input("Monthly ad spend (e.g., $15,000): ").strip() or "$10,000+"
    data["contact_name"] = input("Primary contact name: ").strip()
    data["contact_email"] = input("Primary contact email: ").strip()
    data["industry"] = input("Industry/niche: ").strip()
    data["notes"] = input("Any specific notes/challenges: ").strip()
    
    print()
    print("Select proposal tier:")
    print("  1. Tier 1 - Looker Studio Dashboard ($2,500-$4,000 setup)")
    print("  2. Tier 2 - Custom Web Application ($5,000-$8,000 setup)")
    print("  3. Enterprise - Multi-Store Platform (Custom pricing)")
    
    tier_choice = input("Enter 1, 2, or 3: ").strip()
    tier_map = {"1": "tier1", "2": "tier2", "3": "enterprise"}
    tier = tier_map.get(tier_choice, "tier1")
    
    # Save to temp file
    temp_file = Path("temp-client-data.json")
    temp_file.write_text(json.dumps(data, indent=2), encoding='utf-8')
    
    try:
        output = generate_proposal(str(temp_file), tier)
        print()
        print(f"✅ Proposal generated: {output}")
        
        # Save the client data for future use
        client_file = f"client-{data['client_name'].replace(' ', '-').lower()}.json"
        temp_file.rename(client_file)
        print(f"💾 Client data saved: {client_file}")
        
    finally:
        if temp_file.exists():
            temp_file.unlink()


def main():
    parser = argparse.ArgumentParser(
        description="Generate Rior Systems profit intelligence proposals",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Interactive mode
  python generate.py

  # Generate from JSON file
  python generate.py --client acme-corp.json --tier tier1
  
  # Specify output file
  python generate.py --client data.json --tier enterprise --output proposal.html
        """
    )
    
    parser.add_argument(
        "--client", "-c",
        help="Path to client JSON data file"
    )
    
    parser.add_argument(
        "--tier", "-t",
        choices=["tier1", "tier2", "enterprise", "1", "2", "3"],
        help="Proposal tier (tier1, tier2, or enterprise)"
    )
    
    parser.add_argument(
        "--output", "-o",
        help="Output HTML file path (optional)"
    )
    
    parser.add_argument(
        "--validate", "-v",
        action="store_true",
        help="Validate client data without generating"
    )
    
    args = parser.parse_args()
    
    # Interactive mode if no args
    if not args.client and not args.tier:
        interactive_mode()
        return
    
    # Validate required args for non-interactive mode
    if not args.client:
        parser.error("--client is required (or run without args for interactive mode)")
    if not args.tier:
        parser.error("--tier is required (or run without args for interactive mode)")
    
    # Validate mode
    if args.validate:
        data = load_client_data(args.client)
        warnings = validate_data(data, args.tier)
        if warnings:
            print("Validation warnings:")
            for w in warnings:
                print(f"  {w}")
        else:
            print("✅ All critical fields present")
        return
    
    # Generate proposal
    try:
        output = generate_proposal(args.client, args.tier, args.output)
        print(f"✅ Proposal generated: {output}")
        
        # Print next steps
        print()
        print("Next steps:")
        print(f"  1. Review the generated HTML: open '{output}'")
        print(f"  2. Convert to PDF: Open in browser → Print → Save as PDF")
        print(f"  3. Send to client with a personalized email")
        
    except FileNotFoundError as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
    except ValueError as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
