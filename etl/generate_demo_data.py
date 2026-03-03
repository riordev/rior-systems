#!/usr/bin/env python3
"""
Harbor Goods Co. - Demo Data Generator
Generates realistic e-commerce data for a $80k/month Shopify brand

Context:
- $80k/month revenue target
- 35% COGS target
- $22k/month ad spend
- 3 core products
- 90 days of historical data
"""

import json
import random
import uuid
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional
import csv
import os


@dataclass
class Product:
    """Harbor Goods product definition"""
    product_id: str
    sku: str
    name: str
    category: str
    retail_price: float
    cogs_per_unit: float
    shipping_cost: float
    weight_grams: int


@dataclass
class Campaign:
    """Ad campaign definition"""
    platform: str
    campaign_id: str
    name: str
    daily_budget: float
    target_roas: float


# Harbor Goods Co. Product Catalog
# 35% COGS target, premium positioning
PRODUCTS = [
    Product(
        product_id="prod_001",
        sku="HG-TSHIRT-001",
        name="Heritage Cotton Tee",
        category="Apparel",
        retail_price=48.00,
        cogs_per_unit=16.80,  # 35% COGS
        shipping_cost=4.50,
        weight_grams=250
    ),
    Product(
        product_id="prod_002",
        sku="HG-CAP-001",
        name="Canvas Field Cap",
        category="Accessories",
        retail_price=38.00,
        cogs_per_unit=13.30,  # 35% COGS
        shipping_cost=3.50,
        weight_grams=150
    ),
    Product(
        product_id="prod_003",
        sku="HG-BAG-001",
        name="Waxed Tote Bag",
        category="Bags",
        retail_price=85.00,
        cogs_per_unit=29.75,  # 35% COGS
        shipping_cost=6.00,
        weight_grams=450
    ),
]

# Meta (Facebook/Instagram) Campaigns
# Representing ~60% of ad spend = ~$13,200/month
META_CAMPAIGNS = [
    Campaign("meta", "camp_meta_001", "Prospecting - Broad", 180.00, 3.0),
    Campaign("meta", "camp_meta_002", "Retargeting - ATC", 120.00, 5.0),
    Campaign("meta", "camp_meta_003", "Retargeting - View Content", 80.00, 4.0),
    Campaign("meta", "camp_meta_004", "Lookalike - Top 5%", 150.00, 2.5),
]

# Google Ads Campaigns
# Representing ~30% of ad spend = ~$6,600/month
GOOGLE_CAMPAIGNS = [
    Campaign("google", "camp_g_001", "Search - Brand", 90.00, 8.0),
    Campaign("google", "camp_g_002", "Search - Non-Brand", 110.00, 2.5),
    Campaign("google", "camp_g_003", "Shopping - PLA", 100.00, 3.0),
]

ALL_CAMPAIGNS = META_CAMPAIGNS + GOOGLE_CAMPAIGNS


class HarborDataGenerator:
    """Generates realistic demo data for Harbor Goods Co."""
    
    def __init__(self, start_date: datetime, days: int = 90):
        self.start_date = start_date
        self.days = days
        self.end_date = start_date + timedelta(days=days)
        
        # Business metrics targets
        self.monthly_revenue_target = 80000
        self.daily_revenue_target = self.monthly_revenue_target / 30
        self.cogs_target_pct = 0.35
        self.monthly_ad_spend = 22000
        self.daily_ad_spend = self.monthly_ad_spend / 30
        
        # Seasonality factor (slight variance by day of week)
        self.dow_multiplier = {
            0: 0.85,  # Monday
            1: 0.90,  # Tuesday
            2: 0.95,  # Wednesday
            3: 0.95,  # Thursday
            4: 1.15,  # Friday
            5: 1.20,  # Saturday
            6: 1.00,  # Sunday
        }
        
    def generate_orders(self, output_dir: str):
        """Generate orders and order items for the date range"""
        orders = []
        order_items = []
        
        order_counter = 10001
        customer_pool = []  # For repeat customer simulation
        
        for day_offset in range(self.days):
            current_date = self.start_date + timedelta(days=day_offset)
            date_str = current_date.strftime("%Y-%m-%d")
            
            # Calculate day's target with seasonality
            dow = current_date.weekday()
            daily_target = self.daily_revenue_target * self.dow_multiplier[dow]
            
            # Add some randomness (±15%)
            daily_target *= random.uniform(0.85, 1.15)
            
            # Generate orders until we hit the daily target
            daily_revenue = 0
            daily_orders = 0
            
            while daily_revenue < daily_target and daily_orders < 200:
                # Determine order characteristics
                is_new_customer = random.random() < 0.65  # 35% repeat rate
                
                if not is_new_customer and customer_pool:
                    customer_id = random.choice(customer_pool)
                else:
                    customer_id = f"cust_{uuid.uuid4().hex[:12]}"
                    customer_pool.append(customer_id)
                
                # Determine number of items in order
                num_items = random.choices([1, 2, 3, 4], weights=[45, 35, 15, 5])[0]
                
                # Select products
                order_products = random.choices(PRODUCTS, k=num_items)
                quantities = [random.choices([1, 2, 3], weights=[80, 15, 5])[0] 
                             for _ in range(num_items)]
                
                # Calculate order totals
                gross_revenue = sum(p.retail_price * q for p, q in zip(order_products, quantities))
                
                # Apply discounts occasionally (15% of orders)
                discount = 0
                if random.random() < 0.15:
                    discount_pct = random.choice([0.10, 0.15, 0.20])
                    discount = round(gross_revenue * discount_pct, 2)
                
                # Shipping revenue (free over $75)
                shipping_revenue = 0 if gross_revenue >= 75 else 7.99
                
                # Taxes (varies by state, average 6%)
                tax_rate = random.uniform(0.04, 0.095)
                taxes = round((gross_revenue - discount + shipping_revenue) * tax_rate, 2)
                
                # Generate order
                order_id = f"ord_{uuid.uuid4().hex[:16]}"
                order_number = f"HG{order_counter}"
                
                # UTM tracking (70% have attribution)
                has_attribution = random.random() < 0.70
                campaign = random.choice(ALL_CAMPAIGNS) if has_attribution else None
                
                order = {
                    "order_id": order_id,
                    "order_number": order_number,
                    "order_date": date_str,
                    "customer_id": customer_id,
                    "email": f"customer{order_counter}@example.com",
                    "gross_revenue": round(gross_revenue, 2),
                    "discounts": discount,
                    "refunds": 0,  # Will add some refunds separately
                    "net_revenue": round(gross_revenue - discount, 2),
                    "taxes_collected": taxes,
                    "shipping_revenue": shipping_revenue,
                    "financial_status": "paid",
                    "fulfillment_status": "fulfilled",
                    "source_name": "web",
                    "referring_site": f"https://{campaign.platform}.com" if campaign else "direct",
                    "landing_site": "https://harborgoods.co/collections/all",
                    "utm_source": campaign.platform if campaign else None,
                    "utm_medium": "paid_social" if campaign and campaign.platform == "meta" else "paid_search" if campaign else None,
                    "utm_campaign": campaign.name if campaign else None,
                    "utm_content": None,
                    "created_at": current_date.isoformat(),
                    "updated_at": current_date.isoformat(),
                }
                orders.append(order)
                
                # Generate line items
                for product, qty in zip(order_products, quantities):
                    line_item = {
                        "line_item_id": f"li_{uuid.uuid4().hex[:16]}",
                        "order_id": order_id,
                        "order_number": order_number,
                        "order_date": date_str,
                        "product_id": product.product_id,
                        "variant_id": f"var_{product.sku}",
                        "sku": product.sku,
                        "product_name": product.name,
                        "variant_title": "One Size" if product.category != "Apparel" else random.choice(["S", "M", "L", "XL"]),
                        "quantity": qty,
                        "unit_price": product.retail_price,
                        "line_total": round(product.retail_price * qty, 2),
                        "cogs_per_unit": product.cogs_per_unit,
                        "shipping_cost_per_unit": product.shipping_cost,
                        "payment_processing_rate": 0.029,
                        "payment_processing_fixed": 0.30,
                        "total_cogs": round(product.cogs_per_unit * qty, 2),
                        "total_shipping_cost": round(product.shipping_cost * qty, 2),
                        "processing_fees": 0,  # Calculated in profit calculator
                        "contribution_margin": 0,  # Calculated in profit calculator
                        "created_at": current_date.isoformat(),
                    }
                    order_items.append(line_item)
                
                daily_revenue += gross_revenue
                daily_orders += 1
                order_counter += 1
                
                # Cap daily orders for realism
                if daily_orders >= 150:
                    break
        
        # Add some refunds (3% of orders)
        refund_count = int(len(orders) * 0.03)
        for order in random.sample(orders, refund_count):
            order["refunds"] = round(order["net_revenue"] * random.uniform(0.5, 1.0), 2)
            order["net_revenue"] = round(order["net_revenue"] - order["refunds"], 2)
            order["financial_status"] = "refunded" if order["refunds"] >= order["gross_revenue"] - order["discounts"] else "partially_refunded"
        
        # Write to CSV
        os.makedirs(output_dir, exist_ok=True)
        
        with open(f"{output_dir}/orders.csv", "w", newline="") as f:
            if orders:
                writer = csv.DictWriter(f, fieldnames=orders[0].keys())
                writer.writeheader()
                writer.writerows(orders)
        
        with open(f"{output_dir}/order_items.csv", "w", newline="") as f:
            if order_items:
                writer = csv.DictWriter(f, fieldnames=order_items[0].keys())
                writer.writeheader()
                writer.writerows(order_items)
        
        print(f"Generated {len(orders)} orders with {len(order_items)} line items")
        print(f"Total revenue: ${sum(o['net_revenue'] for o in orders):,.2f}")
        
        return orders, order_items
    
    def generate_ad_spend(self, output_dir: str):
        """Generate daily ad spend by campaign"""
        ad_spend = []
        
        for day_offset in range(self.days):
            current_date = self.start_date + timedelta(days=day_offset)
            date_str = current_date.strftime("%Y-%m-%d")
            dow = current_date.weekday()
            
            for campaign in ALL_CAMPAIGNS:
                # Add variance to daily spend (±25%)
                variance = random.uniform(0.75, 1.25)
                daily_spend = round(campaign.daily_budget * variance, 2)
                
                # Weekend boost for Meta (15% higher on Sat/Sun)
                if campaign.platform == "meta" and dow in [5, 6]:
                    daily_spend *= 1.15
                
                # Calculate derived metrics based on spend
                cpm = 12.50 if campaign.platform == "meta" else 2.80  # Google Search has lower CPM
                cpc = 1.25 if campaign.platform == "meta" else 2.40
                
                impressions = int((daily_spend / cpm) * 1000)
                clicks = int(daily_spend / cpc)
                
                # Conversion rate varies by campaign type
                if "Retargeting" in campaign.name:
                    conv_rate = 0.035  # 3.5% for retargeting
                elif "Prospecting" in campaign.name:
                    conv_rate = 0.012  # 1.2% for prospecting
                elif "Search - Brand" in campaign.name:
                    conv_rate = 0.080  # 8% for brand search
                else:
                    conv_rate = 0.025  # 2.5% average
                
                conversions = int(clicks * conv_rate)
                
                # ROAS varies - some hit target, some don't
                roas_variance = random.uniform(0.7, 1.3)
                actual_roas = round(campaign.target_roas * roas_variance, 2)
                conversion_value = round(daily_spend * actual_roas, 2)
                
                record = {
                    "date": date_str,
                    "platform": campaign.platform,
                    "campaign_id": campaign.campaign_id,
                    "campaign_name": campaign.name,
                    "ad_set_id": f"as_{uuid.uuid4().hex[:12]}",
                    "ad_set_name": f"Ad Set {random.randint(1, 5)}",
                    "spend": round(daily_spend, 2),
                    "currency": "USD",
                    "impressions": impressions,
                    "clicks": clicks,
                    "conversions": conversions,
                    "conversion_value": conversion_value,
                    "cpm": round((daily_spend / impressions) * 1000, 2) if impressions > 0 else 0,
                    "cpc": round(daily_spend / clicks, 2) if clicks > 0 else 0,
                    "ctr": round(clicks / impressions, 4) if impressions > 0 else 0,
                    "roas": actual_roas,
                    "cpa": round(daily_spend / conversions, 2) if conversions > 0 else 0,
                    "attribution_window": "7d_click_1d_view" if campaign.platform == "meta" else "30d_click",
                    "imported_at": datetime.now().isoformat(),
                    "raw_data": json.dumps({"api_version": "v1"}),
                }
                ad_spend.append(record)
        
        # Write to CSV
        os.makedirs(output_dir, exist_ok=True)
        
        with open(f"{output_dir}/ad_spend.csv", "w", newline="") as f:
            if ad_spend:
                writer = csv.DictWriter(f, fieldnames=ad_spend[0].keys())
                writer.writeheader()
                writer.writerows(ad_spend)
        
        total_spend = sum(a["spend"] for a in ad_spend)
        print(f"Generated {len(ad_spend)} ad spend records")
        print(f"Total ad spend: ${total_spend:,.2f}")
        print(f"Meta spend: ${sum(a['spend'] for a in ad_spend if a['platform'] == 'meta'):,.2f}")
        print(f"Google spend: ${sum(a['spend'] for a in ad_spend if a['platform'] == 'google'):,.2f}")
        
        return ad_spend
    
    def generate_products_csv(self, output_dir: str):
        """Export product catalog to CSV"""
        products = []
        for p in PRODUCTS:
            products.append({
                "product_id": p.product_id,
                "variant_id": f"var_{p.sku}",
                "sku": p.sku,
                "product_name": p.name,
                "variant_title": "Default",
                "category": p.category,
                "product_type": p.category,
                "vendor": "Harbor Goods Co.",
                "retail_price": p.retail_price,
                "compare_at_price": None,
                "weight_grams": p.weight_grams,
                "requires_shipping": True,
                "status": "active",
                "tags": json.dumps(["heritage", "usa-made", "premium"]),
                "created_at": self.start_date.isoformat(),
                "updated_at": self.start_date.isoformat(),
            })
        
        os.makedirs(output_dir, exist_ok=True)
        
        with open(f"{output_dir}/products.csv", "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=products[0].keys())
            writer.writeheader()
            writer.writerows(products)
        
        print(f"Exported {len(products)} products")
        return products
    
    def generate_costs_csv(self, output_dir: str):
        """Export cost structure to CSV"""
        costs = []
        for p in PRODUCTS:
            costs.append({
                "sku": p.sku,
                "effective_date": self.start_date.strftime("%Y-%m-%d"),
                "manufacturing_cost": round(p.cogs_per_unit * 0.75, 2),  # 75% of COGS is manufacturing
                "packaging_cost": round(p.cogs_per_unit * 0.15, 2),     # 15% is packaging
                "fulfillment_cost": round(p.cogs_per_unit * 0.10, 2),   # 10% is fulfillment
                "cogs_per_unit": p.cogs_per_unit,
                "cogs_percentage": round(p.cogs_per_unit / p.retail_price, 4),
                "shipping_cost_domestic": p.shipping_cost,
                "shipping_cost_international": round(p.shipping_cost * 2.5, 2),
                "free_shipping_threshold": 75.00,
                "stripe_rate": 0.029,
                "stripe_fixed": 0.30,
                "shopify_payments_rate": 0.029,
                "shopify_payments_fixed": 0.30,
                "paypal_rate": 0.0349,
                "paypal_fixed": 0.49,
                "overhead_percentage": 0.05,
                "notes": "Standard cost structure",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            })
        
        os.makedirs(output_dir, exist_ok=True)
        
        with open(f"{output_dir}/costs.csv", "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=costs[0].keys())
            writer.writeheader()
            writer.writerows(costs)
        
        print(f"Exported {len(costs)} cost records")
        return costs


def main():
    """Main entry point"""
    # Generate 90 days of data ending yesterday
    end_date = datetime.now() - timedelta(days=1)
    start_date = end_date - timedelta(days=90)
    
    output_dir = "/Users/johnbot/.openclaw/workspace/rior-systems/data"
    
    print("=" * 60)
    print("Harbor Goods Co. - Demo Data Generator")
    print("=" * 60)
    print(f"Date range: {start_date.date()} to {end_date.date()}")
    print(f"Output directory: {output_dir}")
    print()
    
    generator = HarborDataGenerator(start_date, 90)
    
    # Generate all data
    generator.generate_orders(output_dir)
    print()
    generator.generate_ad_spend(output_dir)
    print()
    generator.generate_products_csv(output_dir)
    print()
    generator.generate_costs_csv(output_dir)
    
    print()
    print("=" * 60)
    print("Demo data generation complete!")
    print(f"Files written to: {output_dir}")
    print("=" * 60)


if __name__ == "__main__":
    main()