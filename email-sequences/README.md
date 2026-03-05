# Email Sequences — Personalization Guide

## How to Use These Templates

These templates use `{{placeholder}}` syntax. Replace each placeholder with prospect-specific details before sending.

---

## Required Placeholders (All Templates)

| Placeholder | Description | Where to Find It |
|-------------|-------------|------------------|
| `{{first_name}}` | Prospect's first name | Discovery call notes, LinkedIn, email signature |
| `{{company_name}}` | Prospect's company/brand name | Discovery call, Shopify store name |
| `{{sender_name}}` | Your name | — |
| `{{calendar_link}}` | Your booking link | Calendly, SavvyCal, etc. |

---

## Template-Specific Placeholders

### Template 1: Same Day Follow-Up

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{{pain_point_1}}` | First pain point they mentioned | "You're not sure which SKUs are actually profitable" |
| `{{pain_point_2}}` | Second pain point they mentioned | "Your COGS numbers are scattered across spreadsheets" |
| `{{pain_point_3}}` | Third pain point they mentioned | "Shopify's 'profit' doesn't match your actual bank account" |
| `{{proposal_filename}}` | Name of attached proposal file | "Rior-Systems-Proposal-Acme-Co.pdf" |

### Template 3: 1-Week Follow-Up

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{{testimonial_name}}` | Name of testimonial giver | "Sarah Chen" |
| `{{testimonial_company}}` | Company of testimonial giver | "Bloom Cosmetics" |

**Note:** Keep 2-3 testimonials in rotation. Pick the one most relevant to the prospect's industry/size.

---

## Personalization Rules

### Do:
- Reference specific numbers they mentioned (ad spend, revenue, margin targets)
- Mention their actual product category if you know it
- Use their language — if they called it "a mess," say "clean up that mess"
- Keep it short. These templates are already concise — don't bloat them.

### Don't:
- Use generic "I hope this finds you well" filler
- Make up testimonials or social proof
- Send the same template to two people at the same company
- Use {{placeholder}} syntax in the actual email (always replace it)

---

## Sending Schedule

| Template | Timing | Condition |
|----------|--------|-----------|
| Template 1 | Same day | After every discovery call |
| Template 2 | +3 days | If no response to Template 1 |
| Template 3 | +1 week | If no response to Template 2 |
| Template 4 | +2 weeks | If no response to Template 3 (breakup email) |
| Template 5 | +6 months | If prospect went cold (re-engagement) |

---

## Tone Checklist

Before sending, verify your email hits these notes:

- [ ] Sounds like a peer talking to a peer (not a vendor begging for business)
- [ ] Gets to the point in the first 2 sentences
- [ ] Has one clear call-to-action
- [ ] No exclamation points (or very few)
- [ ] No "just following up" or "touching base" language
- [ ] Would you open this if it landed in your inbox?

---

## Version Control

When you customize these for a specific prospect, save a copy in:
```
/prospects/{{company_name}}/emails/
```

This keeps your sent emails organized and lets you reference what you actually said later.
