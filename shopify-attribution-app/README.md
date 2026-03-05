# Shopify Attribution App

A comprehensive multi-touch attribution solution for Shopify merchants. Track customer journeys across all marketing channels and accurately attribute revenue using first-click, last-click, linear, time-decay, and data-driven models.

## Features

- **Multi-Touch Attribution Models**
  - First Click: 100% credit to first touchpoint
  - Last Click: 100% credit to last touchpoint
  - Linear: Equal credit distribution
  - Time Decay: Exponential decay based on recency
  - Data-Driven: ML-powered attribution (beta)

- **Comprehensive Tracking**
  - UTM parameter capture
  - Cross-channel journey mapping
  - Device and browser tracking
  - Referrer analysis
  - Shopify webhook integration

- **Interactive Dashboard**
  - Real-time attribution analytics
  - Channel performance comparison
  - Customer journey visualization
  - Revenue trend analysis
  - Model comparison tools

## Tech Stack

- **Frontend**: Next.js 14 + React + Shopify Polaris
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Charts**: Recharts
- **Deployment**: Docker-ready

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Shopify Partner account

### Installation

1. **Clone and setup**
```bash
git clone <repository>
cd shopify-attribution-app
```

2. **Database Setup**
```bash
# Create PostgreSQL database
createdb shopify_attribution

# Run migrations
psql shopify_attribution < database/schema.sql
```

3. **Backend Setup**
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

4. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

5. **Install the Shopify App**
- Visit `https://your-app.com/auth?shop=yourstore.myshopify.com`
- Complete OAuth flow
- App will be installed automatically

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopify_attribution
DB_USER=postgres
DB_PASSWORD=your_password

# Shopify
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_APP_URL=https://your-app.com

# App
FRONTEND_URL=http://localhost:3000
PORT=3001
JWT_SECRET=your_secret_key
```

## Tracking Integration

### Method 1: JavaScript Snippet

Add to your Shopify theme's `<head>`:

```html
<script src="https://your-app.com/tracking/attribution-tracker.js" 
  data-shop="{{ shop.domain }}"
  data-api-url="https://your-app.com"
  async>
</script>
```

### Method 2: Shopify Webhooks

Configure these webhooks in your Shopify app settings:

- **Orders/create**: `https://your-app.com/api/tracking/webhook/order`

### Method 3: Tracking Pixel

For email campaigns or external sites:

```html
<img src="https://your-app.com/api/tracking/pixel?shop=yourstore.myshopify.com&cid={{ customer.id }}&utm_source=email&utm_campaign=welcome" width="1" height="1" />
```

## API Endpoints

### Authentication
- `GET /auth` - Initiate Shopify OAuth
- `GET /auth/callback` - OAuth callback

### Tracking
- `POST /api/tracking/event` - Track custom events
- `GET /api/tracking/pixel` - Tracking pixel
- `POST /api/tracking/webhook/order` - Shopify order webhook

### Attribution
- `POST /api/attribution/calculate` - Calculate attribution for order
- `POST /api/attribution/batch-calculate` - Batch calculate
- `GET /api/attribution/order/:orderId` - Get attribution for order
- `GET /api/attribution/summary` - Attribution summary

### Dashboard
- `GET /api/dashboard/overview` - Overview stats
- `GET /api/dashboard/channels` - Channel breakdown
- `GET /api/dashboard/journeys` - Customer journeys
- `GET /api/dashboard/model-comparison` - Compare models

### Shop
- `GET /api/shop/settings` - Get settings
- `PUT /api/shop/settings` - Update settings
- `GET /api/shop/stats` - Shop statistics
- `GET /api/shop/tracking-script` - Get tracking script

## Attribution Models Explained

### First Click
Attributes 100% of revenue to the first touchpoint in the customer journey. Best for understanding brand discovery channels.

### Last Click
Attributes 100% of revenue to the final touchpoint before conversion. Traditional e-commerce standard.

### Linear
Distributes credit equally across all touchpoints. Good for understanding the full journey.

### Time Decay
Uses exponential decay (7-day half-life) to give more credit to recent touchpoints. Ideal for short sales cycles.

### Data-Driven (Beta)
Uses machine learning to calculate optimal attribution weights based on your actual customer behavior patterns.

## Database Schema

### Key Tables

- `shops` - Connected Shopify stores
- `touchpoints` - Individual customer interactions
- `customer_journeys` - Journey summaries
- `attribution_results` - Calculated attribution data
- `daily_channel_stats` - Aggregated statistics
- `tracking_events` - Raw event logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file

## Support

For support, email support@your-app.com or open an issue on GitHub.

## Roadmap

- [ ] Machine learning data-driven attribution
- [ ] Facebook/Meta Conversions API integration
- [ ] Google Analytics 4 connector
- [ ] TikTok Events API integration
- [ ] Predictive analytics
- [ ] Cohort analysis
- [ ] Custom attribution model builder
