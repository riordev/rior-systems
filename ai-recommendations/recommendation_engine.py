#!/usr/bin/env python3
"""
Rior Systems AI Recommendations Engine

Generates actionable recommendations from profit data.
Input: BigQuery data (orders, products, ad_spend)
Output: recommendations.json with scored recommendations
"""

import json
import argparse
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import logging

# BigQuery imports
try:
    from google.cloud import bigquery
    from google.oauth2 import service_account
    GCP_AVAILABLE = True
except ImportError:
    GCP_AVAILABLE = False
    print("Warning: google-cloud-bigquery not installed. Using mock data mode.")


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class ConfidenceLevel(Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


class RecommendationType(Enum):
    SCALE_SIGNAL = "scale_signal"
    UNDERPERFORMANCE_ALERT = "underperformance_alert"
    BUDGET_REALLOCATION = "budget_reallocation"
    PRODUCT_OPPORTUNITY = "product_opportunity"
    SEASONAL_PATTERN = "seasonal_pattern"


@dataclass
class Recommendation:
    id: str
    type: str
    type_label: str
    title: str
    message: str
    confidence: int  # 0-100
    confidence_level: str
    potential_profit_impact: float
    product_id: Optional[str]
    product_name: Optional[str]
    platform: Optional[str]
    metrics: Dict[str, Any]
    created_at: str
    priority: int  # 1-5, 1 = highest


class BigQueryClient:
    """Client for fetching data from BigQuery."""
    
    def __init__(self, project_id: str, credentials_path: Optional[str] = None):
        self.project_id = project_id
        self.client = None
        
        if GCP_AVAILABLE:
            if credentials_path and os.path.exists(credentials_path):
                credentials = service_account.Credentials.from_service_account_file(
                    credentials_path
                )
                self.client = bigquery.Client(project=project_id, credentials=credentials)
            else:
                self.client = bigquery.Client(project=project_id)
    
    def fetch_orders(self, client_id: str, days: int) -> List[Dict]:
        """Fetch order data for the specified period."""
        if not self.client:
            return self._get_mock_orders(client_id, days)
        
        query = f"""
        SELECT 
            order_id,
            product_id,
            product_name,
            platform,
            order_date,
            revenue,
            cost,
            units_sold,
            ad_spend
        FROM `{self.project_id}.rior_data.orders`
        WHERE client_id = '{client_id}'
          AND order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL {days} DAY)
        ORDER BY order_date DESC
        """
        
        results = self.client.query(query).result()
        return [dict(row) for row in results]
    
    def fetch_products(self, client_id: str) -> List[Dict]:
        """Fetch product data including margins."""
        if not self.client:
            return self._get_mock_products(client_id)
        
        query = f"""
        SELECT 
            product_id,
            product_name,
            category,
            cost_price,
            sale_price,
            margin_percent
        FROM `{self.project_id}.rior_data.products`
        WHERE client_id = '{client_id}'
        """
        
        results = self.client.query(query).result()
        return [dict(row) for row in results]
    
    def fetch_ad_spend(self, client_id: str, days: int) -> List[Dict]:
        """Fetch ad spend data by platform and product."""
        if not self.client:
            return self._get_mock_ad_spend(client_id, days)
        
        query = f"""
        SELECT 
            date,
            platform,
            product_id,
            spend,
            impressions,
            clicks,
            conversions,
            revenue as attributed_revenue
        FROM `{self.project_id}.rior_data.ad_spend`
        WHERE client_id = '{client_id}'
          AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL {days} DAY)
        ORDER BY date DESC
        """
        
        results = self.client.query(query).result()
        return [dict(row) for row in results]
    
    def _get_mock_orders(self, client_id: str, days: int) -> List[Dict]:
        """Generate mock order data for testing."""
        import random
        products = ["Sailor Tee", "Anchor Hat", "Dock Shorts", "Marina Dress", "Captain Hoodie"]
        platforms = ["Meta", "TikTok", "Google"]
        
        orders = []
        base_date = datetime.now() - timedelta(days=days)
        
        for i in range(days * 5):  # 5 orders per day
            product = random.choice(products)
            platform = random.choice(platforms)
            day_offset = i // 5
            
            # ROAS varies by product and platform
            roas_multipliers = {
                "Sailor Tee": 3.4,
                "Anchor Hat": 1.8,
                "Dock Shorts": 2.9,
                "Marina Dress": 2.2,
                "Captain Hoodie": 2.5
            }
            
            platform_multipliers = {
                "Meta": 1.3,
                "TikTok": 0.9,
                "Google": 1.1
            }
            
            base_roas = roas_multipliers[product] * platform_multipliers[platform]
            ad_spend = random.uniform(50, 200)
            revenue = ad_spend * base_roas * random.uniform(0.9, 1.1)
            
            orders.append({
                "order_id": f"ORD-{client_id}-{i}",
                "product_id": f"PROD-{product.replace(' ', '')}",
                "product_name": product,
                "platform": platform,
                "order_date": (base_date + timedelta(days=day_offset)).strftime("%Y-%m-%d"),
                "revenue": round(revenue, 2),
                "cost": round(revenue * 0.4, 2),
                "units_sold": random.randint(1, 5),
                "ad_spend": round(ad_spend, 2)
            })
        
        return orders
    
    def _get_mock_products(self, client_id: str) -> List[Dict]:
        """Generate mock product data."""
        products = [
            {"product_id": "PROD-SailorTee", "product_name": "Sailor Tee", "category": "Apparel", "cost_price": 15.0, "sale_price": 45.0, "margin_percent": 66.7},
            {"product_id": "PROD-AnchorHat", "product_name": "Anchor Hat", "category": "Accessories", "cost_price": 8.0, "sale_price": 28.0, "margin_percent": 71.4},
            {"product_id": "PROD-DockShorts", "product_name": "Dock Shorts", "category": "Apparel", "cost_price": 18.0, "sale_price": 42.0, "margin_percent": 57.1},
            {"product_id": "PROD-MarinaDress", "product_name": "Marina Dress", "category": "Apparel", "cost_price": 25.0, "sale_price": 65.0, "margin_percent": 61.5},
            {"product_id": "PROD-CaptainHoodie", "product_name": "Captain Hoodie", "category": "Apparel", "cost_price": 22.0, "sale_price": 58.0, "margin_percent": 62.1},
        ]
        return products
    
    def _get_mock_ad_spend(self, client_id: str, days: int) -> List[Dict]:
        """Generate mock ad spend data."""
        import random
        products = ["Sailor Tee", "Anchor Hat", "Dock Shorts", "Marina Dress", "Captain Hoodie"]
        platforms = ["Meta", "TikTok", "Google"]
        
        ad_spends = []
        base_date = datetime.now() - timedelta(days=days)
        
        for day in range(days):
            for platform in platforms:
                for product in products:
                    spend = random.uniform(100, 500)
                    roas = random.uniform(1.5, 4.5)
                    
                    ad_spends.append({
                        "date": (base_date + timedelta(days=day)).strftime("%Y-%m-%d"),
                        "platform": platform,
                        "product_id": f"PROD-{product.replace(' ', '')}",
                        "spend": round(spend, 2),
                        "impressions": random.randint(5000, 50000),
                        "clicks": random.randint(50, 500),
                        "conversions": random.randint(5, 50),
                        "attributed_revenue": round(spend * roas, 2)
                    })
        
        return ad_spends


class RecommendationEngine:
    """Engine for generating AI recommendations from profit data."""
    
    def __init__(self, bq_client: BigQueryClient, break_even_roas: float = 2.5):
        self.bq_client = bq_client
        self.break_even_roas = break_even_roas
        self.recommendations: List[Recommendation] = []
    
    def generate_recommendations(self, client_id: str, days: int) -> List[Recommendation]:
        """Generate all recommendation types."""
        logger.info(f"Generating recommendations for client {client_id} over {days} days")
        
        # Fetch data
        orders = self.bq_client.fetch_orders(client_id, days)
        products = self.bq_client.fetch_products(client_id)
        ad_spend = self.bq_client.fetch_ad_spend(client_id, days)
        
        logger.info(f"Fetched {len(orders)} orders, {len(products)} products, {len(ad_spend)} ad spend records")
        
        # Generate each recommendation type
        self._detect_scale_signals(orders, products, ad_spend)
        self._detect_underperformance(orders, products, ad_spend)
        self._detect_budget_reallocation(ad_spend)
        self._detect_product_opportunities(products, ad_spend)
        self._detect_seasonal_patterns(orders, ad_spend)
        
        # Sort by priority and confidence
        self.recommendations.sort(key=lambda x: (x.priority, -x.confidence))
        
        logger.info(f"Generated {len(self.recommendations)} recommendations")
        return self.recommendations
    
    def _detect_scale_signals(self, orders: List[Dict], products: List[Dict], ad_spend: List[Dict]):
        """
        Detect products with ROAS exceeding break-even by 30%+ for 3+ days.
        Trigger: Product ROAS exceeds break-even by 30%+ for 3+ days
        """
        from collections import defaultdict
        
        # Group ad spend by product and date
        product_daily = defaultdict(lambda: defaultdict(lambda: {"spend": 0, "revenue": 0}))
        
        for record in ad_spend:
            product_id = record.get("product_id")
            date = record.get("date")
            if product_id and date:
                product_daily[product_id][date]["spend"] += record.get("spend", 0)
                product_daily[product_id][date]["revenue"] += record.get("attributed_revenue", 0)
        
        # Check for scale signals
        for product_id, daily_data in product_daily.items():
            high_roas_days = 0
            total_roas = 0
            total_spend = 0
            total_revenue = 0
            
            for date, metrics in daily_data.items():
                if metrics["spend"] > 0:
                    roas = metrics["revenue"] / metrics["spend"]
                    if roas >= self.break_even_roas * 1.3:  # 30% above break-even
                        high_roas_days += 1
                    total_roas += roas
                    total_spend += metrics["spend"]
                    total_revenue += metrics["revenue"]
            
            if high_roas_days >= 3:
                product_name = self._get_product_name(product_id, products)
                avg_roas = total_revenue / total_spend if total_spend > 0 else 0
                
                # Calculate potential impact
                current_daily_spend = total_spend / len(daily_data) if daily_data else 0
                increased_spend = current_daily_spend * 1.2  # 20% increase
                potential_additional_profit = (increased_spend * (avg_roas - self.break_even_roas)) * 30  # 30 days
                
                # Confidence based on number of high ROAS days
                confidence = min(95, 60 + (high_roas_days * 10))
                confidence_level = ConfidenceLevel.HIGH if confidence >= 80 else ConfidenceLevel.MEDIUM
                
                rec = Recommendation(
                    id=f"scale_{product_id}_{datetime.now().strftime('%Y%m%d')}",
                    type=RecommendationType.SCALE_SIGNAL.value,
                    type_label="Scale Signal",
                    title=f"Scale {product_name}",
                    message=f"Increase {product_name} budget by 20%. Current ROAS: {avg_roas:.1f}x, Target: {self.break_even_roas}x. High performance sustained for {high_roas_days} days.",
                    confidence=confidence,
                    confidence_level=confidence_level.value,
                    potential_profit_impact=round(potential_additional_profit, 2),
                    product_id=product_id,
                    product_name=product_name,
                    platform=None,
                    metrics={
                        "current_roas": round(avg_roas, 2),
                        "break_even_roas": self.break_even_roas,
                        "high_roas_days": high_roas_days,
                        "current_daily_spend": round(current_daily_spend, 2)
                    },
                    created_at=datetime.now().isoformat(),
                    priority=1
                )
                self.recommendations.append(rec)
    
    def _detect_underperformance(self, orders: List[Dict], products: List[Dict], ad_spend: List[Dict]):
        """
        Detect products with ROAS below break-even.
        Trigger: Product ROAS drops below break-even
        """
        from collections import defaultdict
        
        # Group by product
        product_metrics = defaultdict(lambda: {"spend": 0, "revenue": 0})
        
        for record in ad_spend:
            product_id = record.get("product_id")
            if product_id:
                product_metrics[product_id]["spend"] += record.get("spend", 0)
                product_metrics[product_id]["revenue"] += record.get("attributed_revenue", 0)
        
        for product_id, metrics in product_metrics.items():
            if metrics["spend"] > 0:
                roas = metrics["revenue"] / metrics["spend"]
                if roas < self.break_even_roas:
                    product_name = self._get_product_name(product_id, products)
                    
                    # Calculate potential savings
                    daily_loss = (self.break_even_roas - roas) * (metrics["spend"] / max(1, len(ad_spend) // len(product_metrics)))
                    
                    confidence = min(90, 70 + int((self.break_even_roas - roas) * 10))
                    confidence_level = ConfidenceLevel.HIGH if confidence >= 75 else ConfidenceLevel.MEDIUM
                    
                    rec = Recommendation(
                        id=f"underperf_{product_id}_{datetime.now().strftime('%Y%m%d')}",
                        type=RecommendationType.UNDERPERFORMANCE_ALERT.value,
                        type_label="Underperformance Alert",
                        title=f"{product_name} Losing Money",
                        message=f"{product_name} is losing money at {roas:.1f}x ROAS (break-even: {self.break_even_roas}x). Consider pausing or adjusting targeting. Potential daily savings: ${daily_loss:.0f}.",
                        confidence=confidence,
                        confidence_level=confidence_level.value,
                        potential_profit_impact=round(daily_loss * 30, 2),  # 30 days
                        product_id=product_id,
                        product_name=product_name,
                        platform=None,
                        metrics={
                            "current_roas": round(roas, 2),
                            "break_even_roas": self.break_even_roas,
                            "ad_spend": round(metrics["spend"], 2),
                            "revenue": round(metrics["revenue"], 2)
                        },
                        created_at=datetime.now().isoformat(),
                        priority=1
                    )
                    self.recommendations.append(rec)
    
    def _detect_budget_reallocation(self, ad_spend: List[Dict]):
        """
        Detect opportunities to shift budget between platforms.
        Trigger: Significant ROAS difference between platforms (e.g., Meta 4.5x, TikTok 1.9x)
        """
        from collections import defaultdict
        
        # Group by platform
        platform_metrics = defaultdict(lambda: {"spend": 0, "revenue": 0})
        
        for record in ad_spend:
            platform = record.get("platform")
            if platform:
                platform_metrics[platform]["spend"] += record.get("spend", 0)
                platform_metrics[platform]["revenue"] += record.get("attributed_revenue", 0)
        
        # Calculate ROAS for each platform
        platform_roas = {}
        for platform, metrics in platform_metrics.items():
            if metrics["spend"] > 0:
                platform_roas[platform] = metrics["revenue"] / metrics["spend"]
        
        # Find reallocation opportunities
        if len(platform_roas) >= 2:
            sorted_platforms = sorted(platform_roas.items(), key=lambda x: x[1], reverse=True)
            best_platform, best_roas = sorted_platforms[0]
            worst_platform, worst_roas = sorted_platforms[-1]
            
            roas_diff = best_roas - worst_roas
            
            # Trigger if difference is significant (>1.0x) and worst is below break-even
            if roas_diff > 1.0 and worst_roas < self.break_even_roas:
                worst_spend = platform_metrics[worst_platform]["spend"]
                reallocation_amount = worst_spend * 0.3  # Shift 30% of underperforming budget
                
                # Calculate impact
                current_profit_worst = worst_spend * (worst_roas - self.break_even_roas)
                potential_profit_best = reallocation_amount * (best_roas - self.break_even_roas)
                profit_improvement = potential_profit_best - current_profit_worst
                
                confidence = min(90, 60 + int(roas_diff * 15))
                confidence_level = ConfidenceLevel.HIGH if confidence >= 80 else ConfidenceLevel.MEDIUM
                
                rec = Recommendation(
                    id=f"realloc_{best_platform}_{worst_platform}_{datetime.now().strftime('%Y%m%d')}",
                    type=RecommendationType.BUDGET_REALLOCATION.value,
                    type_label="Budget Reallocation",
                    title=f"Shift Budget from {worst_platform} to {best_platform}",
                    message=f"{best_platform} ROAS is {best_roas:.1f}x vs {worst_platform} at {worst_roas:.1f}x. Shift ${reallocation_amount:.0f}/day from {worst_platform} to {best_platform} retargeting for +${profit_improvement:.0f} daily profit.",
                    confidence=confidence,
                    confidence_level=confidence_level.value,
                    potential_profit_impact=round(profit_improvement * 30, 2),
                    product_id=None,
                    product_name=None,
                    platform=f"{worst_platform} → {best_platform}",
                    metrics={
                        "from_platform": worst_platform,
                        "from_roas": round(worst_roas, 2),
                        "to_platform": best_platform,
                        "to_roas": round(best_roas, 2),
                        "reallocation_amount": round(reallocation_amount, 2),
                        "roas_difference": round(roas_diff, 2)
                    },
                    created_at=datetime.now().isoformat(),
                    priority=2
                )
                self.recommendations.append(rec)
    
    def _detect_product_opportunities(self, products: List[Dict], ad_spend: List[Dict]):
        """
        Detect high-margin products with low ad spend.
        Trigger: High margin (60%+) but low ad spend (<$5k in period)
        """
        from collections import defaultdict
        
        # Calculate ad spend per product
        product_spend = defaultdict(float)
        for record in ad_spend:
            product_id = record.get("product_id")
            if product_id:
                product_spend[product_id] += record.get("spend", 0)
        
        for product in products:
            margin = product.get("margin_percent", 0)
            product_id = product.get("product_id")
            spend = product_spend.get(product_id, 0)
            
            # Trigger: High margin (60%+) but low spend
            if margin >= 60 and spend < 5000:
                product_name = product.get("product_name")
                
                # Potential impact estimate
                recommended_spend = 5000
                estimated_roas = 2.8  # Conservative estimate for high-margin product
                potential_profit = recommended_spend * (estimated_roas - self.break_even_roas) * 6  # 6 months
                
                confidence = min(85, 50 + int((margin - 60) * 2))
                confidence_level = ConfidenceLevel.MEDIUM if confidence >= 60 else ConfidenceLevel.LOW
                
                rec = Recommendation(
                    id=f"opportunity_{product_id}_{datetime.now().strftime('%Y%m%d')}",
                    type=RecommendationType.PRODUCT_OPPORTUNITY.value,
                    type_label="Product Opportunity",
                    title=f"Scale {product_name} - High Margin, Low Spend",
                    message=f"{product_name} has {margin:.0f}% margin but only ${spend:.0f} ad spend. Test scaling to $5k/month. High-margin products typically convert better.",
                    confidence=confidence,
                    confidence_level=confidence_level.value,
                    potential_profit_impact=round(potential_profit, 2),
                    product_id=product_id,
                    product_name=product_name,
                    platform=None,
                    metrics={
                        "margin_percent": margin,
                        "current_ad_spend": round(spend, 2),
                        "recommended_spend": recommended_spend,
                        "estimated_roas": estimated_roas
                    },
                    created_at=datetime.now().isoformat(),
                    priority=3
                )
                self.recommendations.append(rec)
    
    def _detect_seasonal_patterns(self, orders: List[Dict], ad_spend: List[Dict]):
        """
        Detect day-of-week patterns in ROAS.
        Trigger: Weekend ROAS significantly higher than weekday
        """
        from collections import defaultdict
        from datetime import datetime
        
        # Group by day of week
        dow_metrics = defaultdict(lambda: {"spend": 0, "revenue": 0, "count": 0})
        
        for record in ad_spend:
            date_str = record.get("date")
            if date_str:
                try:
                    date = datetime.strptime(str(date_str), "%Y-%m-%d")
                    dow = date.strftime("%A")  # Full day name
                    is_weekend = dow in ["Saturday", "Sunday"]
                    
                    category = "weekend" if is_weekend else "weekday"
                    dow_metrics[category]["spend"] += record.get("spend", 0)
                    dow_metrics[category]["revenue"] += record.get("attributed_revenue", 0)
                    dow_metrics[category]["count"] += 1
                except (ValueError, TypeError):
                    continue
        
        # Check for weekend uplift
        if "weekend" in dow_metrics and "weekday" in dow_metrics:
            weekend = dow_metrics["weekend"]
            weekday = dow_metrics["weekday"]
            
            if weekend["spend"] > 0 and weekday["spend"] > 0:
                weekend_roas = weekend["revenue"] / weekend["spend"]
                weekday_roas = weekday["revenue"] / weekday["spend"]
                
                if weekend_roas > weekday_roas * 1.15:  # 15% uplift
                    uplift_pct = ((weekend_roas - weekday_roas) / weekday_roas) * 100
                    
                    # Estimate impact of increasing weekend budgets
                    current_weekday_daily = weekday["spend"] / max(1, weekday["count"])
                    potential_weekend_increase = current_weekday_daily * 0.25 * 8  # 25% increase, 8 weekend days/month
                    additional_profit = potential_weekend_increase * (weekend_roas - self.break_even_roas)
                    
                    confidence = min(85, 50 + int(uplift_pct * 2))
                    confidence_level = ConfidenceLevel.HIGH if confidence >= 75 else ConfidenceLevel.MEDIUM
                    
                    rec = Recommendation(
                        id=f"seasonal_weekend_{datetime.now().strftime('%Y%m%d')}",
                        type=RecommendationType.SEASONAL_PATTERN.value,
                        type_label="Seasonal Pattern",
                        title="Increase Weekend Ad Budgets",
                        message=f"Weekend ROAS is {uplift_pct:.0f}% higher than weekdays ({weekend_roas:.1f}x vs {weekday_roas:.1f}x). Increase weekend budgets by 25% to capture +${additional_profit:.0f}/month.",
                        confidence=confidence,
                        confidence_level=confidence_level.value,
                        potential_profit_impact=round(additional_profit * 12, 2),  # Annual
                        product_id=None,
                        product_name=None,
                        platform=None,
                        metrics={
                            "weekend_roas": round(weekend_roas, 2),
                            "weekday_roas": round(weekday_roas, 2),
                            "uplift_percent": round(uplift_pct, 1),
                            "weekend_days_analyzed": weekend["count"],
                            "weekday_days_analyzed": weekday["count"]
                        },
                        created_at=datetime.now().isoformat(),
                        priority=3
                    )
                    self.recommendations.append(rec)
    
    def _get_product_name(self, product_id: str, products: List[Dict]) -> str:
        """Get product name from ID."""
        for product in products:
            if product.get("product_id") == product_id:
                return product.get("product_name", product_id)
        return product_id


def main():
    parser = argparse.ArgumentParser(description="Rior Systems AI Recommendations Engine")
    parser.add_argument("--client-id", required=True, help="Client ID to analyze")
    parser.add_argument("--days", type=int, default=30, help="Number of days to analyze (default: 30)")
    parser.add_argument("--project-id", default=os.getenv("GCP_PROJECT_ID", "rior-systems"), help="GCP Project ID")
    parser.add_argument("--credentials", default=os.getenv("GOOGLE_APPLICATION_CREDENTIALS"), help="Path to service account JSON")
    parser.add_argument("--break-even-roas", type=float, default=2.5, help="Break-even ROAS threshold")
    parser.add_argument("--output", default="recommendations.json", help="Output file path")
    parser.add_argument("--mock", action="store_true", help="Use mock data instead of BigQuery")
    
    args = parser.parse_args()
    
    # Initialize BigQuery client
    if args.mock or not GCP_AVAILABLE:
        bq_client = BigQueryClient(project_id=args.project_id)
    else:
        bq_client = BigQueryClient(project_id=args.project_id, credentials_path=args.credentials)
    
    # Generate recommendations
    engine = RecommendationEngine(bq_client, break_even_roas=args.break_even_roas)
    recommendations = engine.generate_recommendations(args.client_id, args.days)
    
    # Convert to JSON-serializable format
    output = {
        "generated_at": datetime.now().isoformat(),
        "client_id": args.client_id,
        "days_analyzed": args.days,
        "break_even_roas": args.break_even_roas,
        "total_recommendations": len(recommendations),
        "recommendations": [
            {
                "id": r.id,
                "type": r.type,
                "type_label": r.type_label,
                "title": r.title,
                "message": r.message,
                "confidence": r.confidence,
                "confidence_level": r.confidence_level,
                "potential_profit_impact": r.potential_profit_impact,
                "product_id": r.product_id,
                "product_name": r.product_name,
                "platform": r.platform,
                "metrics": r.metrics,
                "created_at": r.created_at,
                "priority": r.priority
            }
            for r in recommendations
        ]
    }
    
    # Write output
    with open(args.output, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"Generated {len(recommendations)} recommendations")
    print(f"Output written to: {args.output}")
    
    # Print summary
    by_type = {}
    by_priority = {}
    for r in recommendations:
        by_type[r.type_label] = by_type.get(r.type_label, 0) + 1
        priority_label = {1: "High", 2: "Medium", 3: "Low"}.get(r.priority, "Other")
        by_priority[priority_label] = by_priority.get(priority_label, 0) + 1
    
    print("\nBy Type:")
    for type_label, count in sorted(by_type.items()):
        print(f"  {type_label}: {count}")
    
    print("\nBy Priority:")
    for priority, count in sorted(by_priority.items(), key=lambda x: {"High": 0, "Medium": 1, "Low": 2}.get(x[0], 3)):
        print(f"  {priority}: {count}")
    
    total_impact = sum(r.potential_profit_impact for r in recommendations)
    print(f"\nTotal Potential Profit Impact: ${total_impact:,.2f}")


if __name__ == "__main__":
    main()
