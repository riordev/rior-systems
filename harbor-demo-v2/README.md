# Harbor Goods Demo v2

A fully functional, interactive profit dashboard for Harbor Goods Co. — a fictional Shopify brand showcasing Rior Systems' Profit Intelligence platform.

## Features

### 1. Live Dashboard (`/demo/dashboard`)
- Real-time profit metrics with sample data
- Interactive charts using Recharts:
  - Revenue over time (area chart)
  - ROAS comparison by campaign (bar chart)
  - Product performance (horizontal bars)
- Key metrics cards with glass effect
- Date range selector (7d, 30d, 90d)

### 2. Product Deep Dive (`/demo/products`)
- Table of all 3 Harbor Goods products
- Per-product metrics:
  - Margin
  - ROAS
  - Break-even ROAS
  - Scale signal
- Click to expand detailed view
- Sortable columns
- Mobile-optimized expandable cards

### 3. Alerts Feed (`/demo/alerts`)
- Real-time alert stream with sample data
- Scale signals (green glow effect)
- Underperformance warnings (amber glow effect)
- Acknowledge/dismiss actions
- Filter by alert type

### 4. Mobile View
- Fully responsive design
- Swipe-friendly mobile navigation
- Touch-optimized controls
- Optimized chart sizing for mobile screens

## Tech Stack

- **Next.js 14** - React framework
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Glass Aesthetic

The dashboard features an iOS-style glass UI:
- Backdrop blur effects (`backdrop-blur-xl`)
- Subtle gradient accents
- Refined opacity layers
- Animated glow effects for alerts
- Premium dark theme

## Sample Data

- Revenue: $237,876 (90 days)
- Net Profit: $56,685 (23.8%)
- Blended ROAS: 3.10x
- Break-even ROAS: 1.92x
- 3 products: Sailor Tee, Dock Shorts, Anchor Hat

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── demo/
│   │   ├── dashboard/     # Main dashboard page
│   │   ├── products/      # Product deep dive
│   │   └── alerts/        # Alerts feed
│   ├── globals.css        # Global styles with glass effects
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Redirect to dashboard
├── components/
│   └── Navigation.tsx     # Sidebar navigation
└── lib/
    └── data.ts            # Sample data and helpers
```

## License

© 2024 Rior Systems. All rights reserved.