# Rior Systems Proposal Generator

Professional proposal templates for Profit Intelligence services. Three tiers designed to match client needs and budget.

## Quick Start

```bash
# Interactive mode - answer prompts
cd /Users/johnbot/.openclaw/workspace/rior-systems/proposals
python3 generate.py

# Or use a JSON file
python3 generate.py --client client-data.json --tier tier1
```

## Proposal Tiers

| Tier | Service | Setup | Monthly | Timeline |
|------|---------|-------|---------|----------|
| **Tier 1** | Looker Studio Dashboard | $2,500–$4,000 | $1,500–$2,000 | 24-48 hours |
| **Tier 2** | Custom Web Application | $5,000–$8,000 | $3,000–$4,000 | 1-2 weeks |
| **Enterprise** | Multi-Store Platform | Custom | Custom | 4-6 weeks |

## Files

```
proposals/
├── templates/
│   ├── tier1.html          # Looker Studio proposal
│   ├── tier2.html          # Custom webapp proposal
│   └── enterprise.html     # Enterprise partnership
├── generate.py             # Proposal generator script
├── example-client.json     # Sample client data
└── README.md              # This file
```

## Client Data Format

Create a JSON file with client information:

```json
{
  "client_name": "Company Name",
  "store_url": "store.myshopify.com",
  "ad_spend": "$15,000/month",
  "contact_name": "John Smith",
  "contact_email": "john@example.com",
  "industry": "Fashion/Apparel",
  "current_challenges": ["No visibility into true profit"],
  "primary_goals": ["Understand product-level profitability"]
}
```

## Usage Examples

### Generate all tiers for a prospect
```bash
CLIENT="acme-corp.json"
python3 generate.py -c $CLIENT -t tier1 -o acme-tier1.html
python3 generate.py -c $CLIENT -t tier2 -o acme-tier2.html
python3 generate.py -c $CLIENT -t enterprise -o acme-enterprise.html
```

### Validate client data
```bash
python3 generate.py -c client.json -t tier1 --validate
```

## Converting to PDF

1. Open the generated HTML in Chrome/Safari
2. File → Print
3. Select "Save as PDF"
4. Enable "Background graphics" for glass effect
5. Save and attach to email

## Template Variables

Available in all templates:
- `{{CLIENT_NAME}}` - Company name
- `{{STORE_URL}}` - Shopify store URL
- `{{AD_SPEND}}` - Monthly advertising spend
- `{{CONTACT_NAME}}` - Primary contact
- `{{DATE}}` - Auto-generated proposal date

## Tips

- **Tier 1**: Best for stores doing $500K–$2M, focused on quick wins
- **Tier 2**: Best for stores doing $2M–$5M, want branded experience
- **Enterprise**: Best for multi-store brands, $5M+ or complex needs
- Always customize the case study section for the prospect's industry
- Follow up within 5 days if no response
