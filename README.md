# Harbor Goods Co. - Demo System

A complete demo data system for Harbor Goods Co., a fictional $80k/month Shopify brand. This system generates realistic e-commerce data, calculates profit metrics, and provides a scaffold for BigQuery integration.

## Quick Start

```bash
# 1. Generate demo data (90 days)
python etl/generate_demo_data.py

# 2. Calculate profit metrics
python etl/profit_calculator.py

# 3. (Optional) Load to BigQuery
python etl/load_to_bigquery.py --project YOUR_PROJECT --dataset harbor_goods
```

## System Overview

### Business Context

Harbor Goods Co. is a heritage-inspired lifestyle brand with:
- **Revenue:** $80k/month target
- **COGS Target:** 35%
- **Ad Spend:** $22k/month (Meta 60%, Google 30%, Other 10%)
- **Products:** 3 core SKUs (tee, cap, tote)
- **Customer Mix:** 65% new, 35% repeat

### Architecture

```
rior-systems/
├── bigquery/schema/     # SQL table definitions
├── config/              # Brand configuration
├── etl/                 # Python data pipelines
├── data/                # Generated CSVs (gitignored)
└── README.md           # This file
```

## Components

### 1. Data Generator (`etl/generate_demo_data.py`)

Generates 90 days of realistic data:
- **Orders:** ~150-200/day with AOV ~$65
- **Line Items:** Full SKU-level detail
- **Ad Spend:** Platform and campaign-level
- **Products & Costs:** Master data

Features:
- Day-of-week seasonality (weekends +20%)
- 15% discount usage rate
- 3% refund rate
- Campaign-specific conversion rates

### 2. Profit Calculator (`etl/profit_calculator.py`)

Calculates key metrics:
- **Net Profit:** After all variable costs
- **Contribution Margin:** Before ad spend
- **Break-Even ROAS:** 1 / contribution margin %
- **Blended CAC:** Total ad spend / new customers

Outputs:
- `sku_metrics.csv` - Per-product profitability
- `daily_metrics.csv` - Time-series KPIs
- Console report with summary

### 3. BigQuery Loader (`etl/load_to_bigquery.py`)

Scaffold for GCP loading:
- Creates dataset
- Loads CSVs to tables
- Runs SQL transformations
- **Requires:** GCP service account credentials

### 4. Schema Definitions (`bigquery/schema/`)

Six core tables:
- `orders` - Order-level data
- `order_items` - Line items with cost allocation
- `products` - Product catalog
- `costs` - COGS and fee structure
- `ad_spend` - Marketing spend by campaign
- `metrics_daily` - Pre-calculated KPIs

## Key Metrics Explained

### Contribution Margin
Revenue minus variable costs (COGS + shipping + payment fees). This is what you have left to spend on marketing.

### Break-Even ROAS
`1 / Contribution Margin %`

Example: If contribution margin is 40%, break-even ROAS is 2.5x. You need $2.50 in revenue for every $1 spent on ads to break even.

### Blended CAC
`Total Ad Spend / New Customers`

Your average cost to acquire a new customer across all channels.

## Configuration

Edit `config/harbor_goods.yaml` to customize:
- Product catalog and pricing
- COGS percentages
- Marketing channel mix
- Customer behavior assumptions

## Sample Output

```
📊 OVERALL PERFORMANCE (90 Days)
   Total Revenue:        $ 239,847.23
   Total COGS:           $  83,946.53 (35.0%)
   Total Shipping:       $  21,586.14 (9.0%)
   Total Payment Fees:   $   7,195.42 (3.0%)
   ────────────────────────────────────────
   Contribution Margin:  $ 127,119.14 (53.0%)
   Total Ad Spend:       $  66,000.00 (27.5%)
   ────────────────────────────────────────
   NET PROFIT:           $  61,119.14 (25.5%)
```

## BigQuery Setup

1. Create a GCP service account with BigQuery Data Editor role
2. Download JSON key
3. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
   ```
4. Uncomment BigQuery code in `load_to_bigquery.py`
5. Run the loader

## Extending the System

### Add More Products
Edit `PRODUCTS` array in `generate_demo_data.py` and update `config/harbor_goods.yaml`.

### Add New Channels
Add campaigns to `ALL_CAMPAIGNS` in the generator and update budget percentages in config.

### Custom Metrics
Extend `calculate_daily_metrics()` in `profit_calculator.py`.

### Real Shopify Data
Replace `generate_demo_data.py` with Shopify API connector using `shopify-python-api`.

## Dependencies

```bash
pip install pandas pyyaml

# For BigQuery (optional)
pip install google-cloud-bigquery
```

## File Outputs

All data written to `data/` directory:
- `orders.csv` - ~13,500 orders
- `order_items.csv` - ~21,600 line items
- `products.csv` - 3 products
- `costs.csv` - 3 cost records
- `ad_spend.csv` - 630 campaign-day records
- `sku_metrics.csv` - Profitability by SKU
- `daily_metrics.csv` - Daily KPIs

## Notes

- Data is randomized but realistic for the business model
- Some variance is built in (±15% daily revenue, ±25% ad spend)
- Refunds are applied to 3% of orders
- Attribution is simplified (70% of orders have UTM params)

## License

Internal use only - Harbor Goods Co. is a fictional brand for demo purposes.