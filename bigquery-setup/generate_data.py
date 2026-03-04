#!/usr/bin/env python3
"""
Generate Harbor Goods demo data for BigQuery
Targets: 90 days, 3 products, $238k revenue, 23.8% margin
"""

import json
import random
import uuid
from datetime import datetime, timedelta
from decimal import Decimal

# Set seed for reproducibility
random.seed(42)

# Configuration
START_DATE = datetime(2025, 12, 1)
DAYS = 90
TARGET_REVENUE = 238000
TARGET_MARGIN = 0.238

# Products - 3 products for Harbor Goods (artisan home goods)
PRODUCTS = [
    {
        "product_id": "prod_001",
        "sku": "HG-CER-VASE-001",
        "name": "Handcrafted Ceramic Vase",
        "description": "Artisan ceramic vase, hand-thrown by local craftspeople",
        "category": "Home Decor",
        "base_cost": 24.00,
        "shipping_cost": 8.50,
        "packaging_cost": 3.25,
        "handling_cost": 2.50,
        "return_rate": 0.03,
        "sale_price": 89.00,
        "weight": 1
    },
    {
        "product_id": "prod_002",
        "sku": "HG-TEX-THRW-002",
        "name": "Organic Cotton Throw Blanket",
        "description": "Soft organic cotton throw, sustainably sourced",
        "category": "Textiles",
        "base_cost": 32.00,
        "shipping_cost": 6.00,
        "packaging_cost": 2.75,
        "handling_cost": 2.00,
        "return_rate": 0.05,
        "sale_price": 129.00,
        "weight": 2
    },
    {
        "product_id": "prod_003",
        "sku": "HG-WOD-CUTB-003",
        "name": "Walnut Cutting Board",
        "description": "Solid walnut cutting board with natural finish",
        "category": "Kitchen",
        "base_cost": 18.50,
        "shipping_cost": 7.00,
        "packaging_cost": 2.50,
        "handling_cost": 2.00,
        "return_rate": 0.02,
        "sale_price": 79.00,
        "weight": 3
    }
]

# Campaigns for ad spend
CAMPAIGNS = [
    {"platform": "meta", "name": "Brand Awareness Q4", "target_roas": 2.5},
    {"platform": "meta", "name": "Retargeting - Cart Abandoners", "target_roas": 4.2},
    {"platform": "google", "name": "Search - Artisan Home Goods", "target_roas": 3.8},
    {"platform": "google", "name": "Shopping - Product Feed", "target_roas": 3.2},
    {"platform": "tiktok", "name": "Viral Home Aesthetic", "target_roas": 2.1},
    {"platform": "pinterest", "name": "Holiday Decor Inspiration", "target_roas": 2.8},
]

def generate_products():
    """Generate product catalog data"""
    products = []
    now = datetime.now().isoformat()
    for p in PRODUCTS:
        products.append({
            "product_id": p["product_id"],
            "sku": p["sku"],
            "name": p["name"],
            "description": p["description"],
            "category": p["category"],
            "base_cost": float(p["base_cost"]),
            "shipping_cost": float(p["shipping_cost"]),
            "packaging_cost": float(p["packaging_cost"]),
            "handling_cost": float(p["handling_cost"]),
            "return_rate": float(p["return_rate"]),
            "is_active": True,
            "created_at": now,
            "updated_at": now
        })
    return products

def generate_orders_and_items():
    """Generate orders with realistic patterns"""
    orders = []
    order_items = []
    costs = []
    
    # Daily order volume varies (more on weekends, holiday season)
    base_daily_orders = 12
    
    for day in range(DAYS):
        current_date = START_DATE + timedelta(days=day)
        date_str = current_date.strftime("%Y-%m-%d")
        
        # Seasonal factor (increases toward end of December/holidays)
        day_of_year = (current_date - datetime(2025, 1, 1)).days
        seasonal_factor = 1 + (0.5 * (day / DAYS))  # 50% increase over period
        
        # Weekend bump
        weekend_factor = 1.3 if current_date.weekday() >= 5 else 1.0
        
        # Random daily variation
        daily_variation = random.uniform(0.8, 1.4)
        
        daily_orders = int(base_daily_orders * seasonal_factor * weekend_factor * daily_variation)
        
        for _ in range(daily_orders):
            order_id = f"ord_{uuid.uuid4().hex[:12]}"
            order_number = f"HG-{random.randint(100000, 999999)}"
            customer_id = f"cust_{random.randint(10000, 99999)}"
            
            # Attribution mix
            source_roll = random.random()
            if source_roll < 0.45:
                source = "paid_social"
                utm_source = "meta"
                utm_medium = "paid"
                utm_campaign = random.choice(["Brand Awareness Q4", "Retargeting - Cart Abandoners"])
            elif source_roll < 0.70:
                source = "paid_search"
                utm_source = "google"
                utm_medium = "cpc"
                utm_campaign = random.choice(["Search - Artisan Home Goods", "Shopping - Product Feed"])
            elif source_roll < 0.85:
                source = "organic"
                utm_source = "google"
                utm_medium = "organic"
                utm_campaign = None
            else:
                source = "direct"
                utm_source = None
                utm_medium = None
                utm_campaign = None
            
            # 1-3 items per order weighted toward 1-2
            num_items = random.choices([1, 2, 3], weights=[0.55, 0.35, 0.10])[0]
            
            order_gross = 0
            order_discount = 0
            order_refund = 0
            is_new_customer = random.random() < 0.65  # 65% new customers
            
            for item_idx in range(num_items):
                product = random.choice(PRODUCTS)
                quantity = random.choices([1, 2, 3], weights=[0.75, 0.20, 0.05])[0]
                
                unit_price = product["sale_price"]
                line_total = unit_price * quantity
                
                # Occasional discounts (15% of orders)
                item_discount = 0
                if random.random() < 0.15:
                    item_discount = line_total * random.uniform(0.10, 0.25)
                
                net_line_total = line_total - item_discount
                
                # Unit costs at time of order
                unit_cogs = product["base_cost"]
                unit_shipping = product["shipping_cost"]
                unit_packaging = product["packaging_cost"]
                unit_handling = product["handling_cost"]
                
                total_cogs = (unit_cogs + unit_shipping + unit_packaging + unit_handling) * quantity
                
                # Returns (based on product return rate)
                is_returned = random.random() < product["return_rate"]
                return_amount = net_line_total if is_returned else 0
                
                order_gross += line_total
                order_discount += item_discount
                order_refund += return_amount
                
                order_items.append({
                    "order_item_id": f"oi_{uuid.uuid4().hex[:12]}",
                    "order_id": order_id,
                    "product_id": product["product_id"],
                    "quantity": quantity,
                    "unit_price": float(unit_price),
                    "line_total": float(line_total),
                    "discount_amount": float(round(item_discount, 2)),
                    "net_line_total": float(round(net_line_total, 2)),
                    "unit_cogs": float(unit_cogs),
                    "unit_shipping_cost": float(unit_shipping),
                    "unit_packaging_cost": float(unit_packaging),
                    "unit_handling_cost": float(unit_handling),
                    "total_cogs": float(round(total_cogs, 2)),
                    "is_returned": is_returned,
                    "return_amount": float(round(return_amount, 2)),
                    "created_at": f"{date_str}T{random.randint(8,22)}:{random.randint(0,59):02d}:{random.randint(0,59):02d}"
                })
            
            net_revenue = order_gross - order_discount
            
            # Payment processing fee (2.9% + $0.30)
            processing_fee = (net_revenue * 0.029) + 0.30
            
            orders.append({
                "order_id": order_id,
                "order_number": order_number,
                "order_date": date_str,
                "customer_id": customer_id,
                "gross_revenue": float(round(order_gross, 2)),
                "discount_amount": float(round(order_discount, 2)),
                "net_revenue": float(round(net_revenue, 2)),
                "tax_amount": float(round(net_revenue * 0.08, 2)),  # 8% tax
                "shipping_revenue": float(round(random.choice([0, 9.95, 14.95]), 2)),
                "total_refunds": float(round(order_refund, 2)),
                "status": "delivered" if not order_refund else "partially_refunded",
                "fulfillment_status": "fulfilled",
                "source": source,
                "utm_source": utm_source,
                "utm_medium": utm_medium,
                "utm_campaign": utm_campaign,
                "customer_email": f"customer{customer_id}@example.com",
                "is_new_customer": is_new_customer,
                "created_at": f"{date_str}T10:00:00",
                "updated_at": f"{date_str}T10:00:00"
            })
            
            # Add processing fee to costs
            costs.append({
                "cost_id": f"cost_{uuid.uuid4().hex[:8]}",
                "order_id": order_id,
                "product_id": None,
                "cost_type": "payment_processing",
                "cost_category": "variable",
                "amount": float(round(processing_fee, 2)),
                "percentage_of_revenue": 0.029,
                "description": "Stripe processing fee",
                "date_applied": date_str,
                "created_at": f"{date_str}T10:00:00"
            })
            
            # Shopify/platform fee
            costs.append({
                "cost_id": f"cost_{uuid.uuid4().hex[:8]}",
                "order_id": order_id,
                "product_id": None,
                "cost_type": "platform_fee",
                "cost_category": "variable",
                "amount": 0.29 if random.random() < 0.5 else 0.00,  # Basic vs Shopify Plus mix
                "percentage_of_revenue": None,
                "description": "Shopify transaction fee",
                "date_applied": date_str,
                "created_at": f"{date_str}T10:00:00"
            })
    
    return orders, order_items, costs

def generate_ad_spend(orders):
    """Generate ad spend data based on order attribution"""
    ad_spend = []
    
    # Calculate daily revenue by source for ad spend allocation
    daily_revenue = {}
    for order in orders:
        date = order["order_date"]
        source = order.get("utm_source", "organic")
        if source not in ["meta", "google", "tiktok", "pinterest"]:
            continue
        if date not in daily_revenue:
            daily_revenue[date] = {}
        if source not in daily_revenue[date]:
            daily_revenue[date][source] = 0
        daily_revenue[date][source] += order["net_revenue"]
    
    for date, sources in daily_revenue.items():
        for platform, revenue in sources.items():
            # Ad spend is roughly 25-35% of attributed revenue
            daily_spend = revenue * random.uniform(0.25, 0.35)
            
            # Distribute across campaigns
            if platform == "meta":
                campaigns = ["Brand Awareness Q4", "Retargeting - Cart Abandoners"]
                weights = [0.6, 0.4]
            elif platform == "google":
                campaigns = ["Search - Artisan Home Goods", "Shopping - Product Feed"]
                weights = [0.5, 0.5]
            else:
                campaigns = [f"{platform.title()} Campaign"]
                weights = [1.0]
            
            for campaign, weight in zip(campaigns, weights):
                campaign_spend = daily_spend * weight
                
                # Generate realistic metrics
                impressions = int(campaign_spend * random.uniform(800, 1500))
                clicks = int(impressions * random.uniform(0.015, 0.035))
                conversions = max(1, int(clicks * random.uniform(0.02, 0.06)))
                
                ad_spend.append({
                    "spend_id": f"spend_{uuid.uuid4().hex[:12]}",
                    "date": date,
                    "platform": platform,
                    "account_id": f"act_{platform[:3]}_{random.randint(1000, 9999)}",
                    "account_name": f"Harbor Goods {platform.title()}",
                    "campaign_id": f"camp_{uuid.uuid4().hex[:8]}",
                    "campaign_name": campaign,
                    "ad_set_id": f"adset_{uuid.uuid4().hex[:8]}",
                    "ad_set_name": f"Ad Set {random.randint(1, 5)}",
                    "ad_id": f"ad_{uuid.uuid4().hex[:8]}",
                    "ad_name": f"Creative {random.randint(1, 10)}",
                    "spend": float(round(campaign_spend, 2)),
                    "impressions": impressions,
                    "clicks": clicks,
                    "conversions": conversions,
                    "conversion_value": float(round(revenue * weight, 2)),
                    "utm_source": platform,
                    "utm_medium": "paid",
                    "utm_campaign": campaign,
                    "created_at": f"{date}T08:00:00",
                    "updated_at": f"{date}T08:00:00"
                })
    
    return ad_spend

def calculate_metrics_daily(orders, order_items, costs, ad_spend):
    """Calculate daily aggregated metrics"""
    metrics = []
    
    # Group data by date
    daily_orders = {}
    for order in orders:
        date = order["order_date"]
        if date not in daily_orders:
            daily_orders[date] = []
        daily_orders[date].append(order)
    
    daily_items = {}
    for item in order_items:
        date = item["created_at"][:10]
        if date not in daily_items:
            daily_items[date] = []
        daily_items[date].append(item)
    
    daily_costs = {}
    for cost in costs:
        date = cost["date_applied"]
        if date not in daily_costs:
            daily_costs[date] = []
        daily_costs[date].append(cost)
    
    daily_ad_spend = {}
    for spend in ad_spend:
        date = spend["date"]
        if date not in daily_ad_spend:
            daily_ad_spend[date] = []
        daily_ad_spend[date].append(spend)
    
    all_dates = sorted(set(list(daily_orders.keys()) + list(daily_items.keys())))
    
    for date in all_dates:
        orders_today = daily_orders.get(date, [])
        items_today = daily_items.get(date, [])
        costs_today = daily_costs.get(date, [])
        ad_spend_today = daily_ad_spend.get(date, [])
        
        # Revenue metrics
        total_orders = len(orders_today)
        total_revenue = sum(o["net_revenue"] for o in orders_today)
        total_refunds = sum(o["total_refunds"] for o in orders_today)
        net_revenue = total_revenue - total_refunds
        
        # Cost breakdown
        total_cogs = sum(i["total_cogs"] for i in items_today)
        processing_fees = sum(c["amount"] for c in costs_today if c["cost_type"] == "payment_processing")
        platform_fees = sum(c["amount"] for c in costs_today if c["cost_type"] == "platform_fee")
        total_processing_fees = processing_fees + platform_fees
        
        # Shipping, packaging, handling included in COGS from items
        total_shipping = sum(i["unit_shipping_cost"] * i["quantity"] for i in items_today)
        total_packaging = sum(i["unit_packaging_cost"] * i["quantity"] for i in items_today)
        total_handling = sum(i["unit_handling_cost"] * i["quantity"] for i in items_today)
        
        # Ad spend
        total_ad_spend = sum(s["spend"] for s in ad_spend_today)
        
        # Other operating costs (estimated as % of revenue)
        other_ops = net_revenue * 0.05  # 5% for overhead, software, etc
        total_operating_costs = total_processing_fees + other_ops
        
        # Profitability
        gross_profit = net_revenue - total_cogs
        net_profit = gross_profit - total_operating_costs - total_ad_spend
        profit_margin = net_profit / net_revenue if net_revenue > 0 else 0
        
        # Unit economics
        aov = net_revenue / total_orders if total_orders > 0 else 0
        new_customers = sum(1 for o in orders_today if o["is_new_customer"])
        returning_customers = total_orders - new_customers
        cac = total_ad_spend / new_customers if new_customers > 0 else 0
        
        # ROAS and MER
        ad_revenue = sum(s["conversion_value"] for s in ad_spend_today)
        roas = ad_revenue / total_ad_spend if total_ad_spend > 0 else 0
        mer = net_revenue / total_ad_spend if total_ad_spend > 0 else 0
        
        # Product metrics
        units_sold = sum(i["quantity"] for i in items_today)
        returned_units = sum(i["quantity"] for i in items_today if i["is_returned"])
        return_rate = returned_units / units_sold if units_sold > 0 else 0
        
        metrics.append({
            "date": date,
            "total_orders": total_orders,
            "total_revenue": float(round(total_revenue, 2)),
            "total_refunds": float(round(total_refunds, 2)),
            "net_revenue": float(round(net_revenue, 2)),
            "total_cogs": float(round(total_cogs, 2)),
            "total_shipping_costs": float(round(total_shipping, 2)),
            "total_packaging_costs": float(round(total_packaging, 2)),
            "total_handling_costs": float(round(total_handling, 2)),
            "total_processing_fees": float(round(total_processing_fees, 2)),
            "total_ad_spend": float(round(total_ad_spend, 2)),
            "total_operating_costs": float(round(total_operating_costs, 2)),
            "gross_profit": float(round(gross_profit, 2)),
            "net_profit": float(round(net_profit, 2)),
            "profit_margin": float(round(profit_margin, 4)),
            "aov": float(round(aov, 2)),
            "cac": float(round(cac, 2)),
            "roas": float(round(roas, 4)),
            "mer": float(round(mer, 4)),
            "new_customers": new_customers,
            "returning_customers": returning_customers,
            "units_sold": units_sold,
            "return_rate": float(round(return_rate, 4)),
            "updated_at": datetime.now().isoformat()
        })
    
    return metrics

def main():
    print("Generating Harbor Goods demo data...")
    
    # Generate data
    products = generate_products()
    orders, order_items, costs = generate_orders_and_items()
    ad_spend = generate_ad_spend(orders)
    metrics = calculate_metrics_daily(orders, order_items, costs, ad_spend)
    
    # Output summary
    total_revenue = sum(o["net_revenue"] for o in orders)
    total_refunds = sum(o["total_refunds"] for o in orders)
    net_revenue = total_revenue - total_refunds
    total_cogs = sum(i["total_cogs"] for i in order_items)
    total_ad_spend = sum(s["spend"] for s in ad_spend)
    total_costs = sum(c["amount"] for c in costs)
    net_profit = net_revenue - total_cogs - total_costs - total_ad_spend
    margin = net_profit / net_revenue if net_revenue > 0 else 0
    
    print(f"\n📊 Generated Data Summary:")
    print(f"   Products: {len(products)}")
    print(f"   Orders: {len(orders)}")
    print(f"   Order Items: {len(order_items)}")
    print(f"   Cost Records: {len(costs)}")
    print(f"   Ad Spend Records: {len(ad_spend)}")
    print(f"   Daily Metrics: {len(metrics)}")
    print(f"\n💰 Financial Targets:")
    print(f"   Target Revenue: ${TARGET_REVENUE:,.2f}")
    print(f"   Actual Revenue: ${net_revenue:,.2f}")
    print(f"   Target Margin: {TARGET_MARGIN:.1%}")
    print(f"   Actual Margin: {margin:.1%}")
    
    # Write to files
    with open("/Users/johnbot/.openclaw/workspace/rior-systems/bigquery-setup/products.json", "w") as f:
        for p in products:
            f.write(json.dumps(p) + "\n")
    
    with open("/Users/johnbot/.openclaw/workspace/rior-systems/bigquery-setup/orders.json", "w") as f:
        for o in orders:
            f.write(json.dumps(o) + "\n")
    
    with open("/Users/johnbot/.openclaw/workspace/rior-systems/bigquery-setup/order_items.json", "w") as f:
        for i in order_items:
            f.write(json.dumps(i) + "\n")
    
    with open("/Users/johnbot/.openclaw/workspace/rior-systems/bigquery-setup/costs.json", "w") as f:
        for c in costs:
            f.write(json.dumps(c) + "\n")
    
    with open("/Users/johnbot/.openclaw/workspace/rior-systems/bigquery-setup/ad_spend.json", "w") as f:
        for s in ad_spend:
            f.write(json.dumps(s) + "\n")
    
    with open("/Users/johnbot/.openclaw/workspace/rior-systems/bigquery-setup/metrics_daily.json", "w") as f:
        for m in metrics:
            f.write(json.dumps(m) + "\n")
    
    print(f"\n✅ Data files written to /workspace/rior-systems/bigquery-setup/")

if __name__ == "__main__":
    main()
