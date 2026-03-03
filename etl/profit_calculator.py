#!/usr/bin/env python3
"""
Harbor Goods Co. - Profit Calculator
Calculates net profit, contribution margin, and break-even ROAS per SKU

Key Metrics:
- Net Profit = Revenue - COGS - Shipping - Payment Fees - Ad Spend
- Contribution Margin = Net Profit + Ad Spend (profit before marketing)
- Break-even ROAS = 1 / Contribution Margin %
- Blended CAC = Total Ad Spend / New Customers
"""

import pandas as pd
import json
from datetime import datetime
from typing import Dict, List, Tuple
import os


class ProfitCalculator:
    """Calculate profit metrics for Harbor Goods Co."""
    
    def __init__(self, data_dir: str = "/Users/johnbot/.openclaw/workspace/rior-systems/data"):
        self.data_dir = data_dir
        self.orders_df = None
        self.order_items_df = None
        self.costs_df = None
        self.ad_spend_df = None
        
    def load_data(self):
        """Load all CSV files"""
        print("Loading data...")
        
        self.orders_df = pd.read_csv(f"{self.data_dir}/orders.csv")
        self.order_items_df = pd.read_csv(f"{self.data_dir}/order_items.csv")
        self.costs_df = pd.read_csv(f"{self.data_dir}/costs.csv")
        self.ad_spend_df = pd.read_csv(f"{self.data_dir}/ad_spend.csv")
        
        # Parse dates
        self.orders_df['order_date'] = pd.to_datetime(self.orders_df['order_date'])
        self.order_items_df['order_date'] = pd.to_datetime(self.order_items_df['order_date'])
        self.ad_spend_df['date'] = pd.to_datetime(self.ad_spend_df['date'])
        
        print(f"  Orders: {len(self.orders_df):,}")
        print(f"  Order items: {len(self.order_items_df):,}")
        print(f"  Cost records: {len(self.costs_df)}")
        print(f"  Ad spend records: {len(self.ad_spend_df):,}")
        
    def calculate_order_level_costs(self):
        """Calculate processing fees and contribution margin per line item"""
        print("\nCalculating order-level costs...")
        
        # Join orders to get payment method info (simplified - assume all Stripe)
        merged = self.order_items_df.merge(
            self.orders_df[['order_id', 'net_revenue', 'shipping_revenue']],
            on='order_id',
            suffixes=('', '_order')
        )
        
        # Calculate processing fees (2.9% + $0.30 per order)
        # Note: In real world, this is per transaction, not per line item
        # We'll allocate proportionally
        merged['payment_fees'] = (
            merged['line_total'] * 0.029 + 
            (0.30 * merged['line_total'] / merged.groupby('order_id')['line_total'].transform('sum'))
        ).round(2)
        
        # Calculate contribution margin per line item
        merged['contribution_margin'] = (
            merged['line_total'] - 
            merged['total_cogs'] - 
            merged['total_shipping_cost'] - 
            merged['payment_fees']
        ).round(2)
        
        # Contribution margin percentage
        merged['contribution_margin_pct'] = (
            merged['contribution_margin'] / merged['line_total']
        ).round(4)
        
        self.order_items_df = merged
        
        total_contribution = merged['contribution_margin'].sum()
        total_revenue = merged['line_total'].sum()
        avg_contribution_pct = total_contribution / total_revenue
        
        print(f"  Total contribution margin: ${total_contribution:,.2f}")
        print(f"  Average contribution margin: {avg_contribution_pct:.1%}")
        
    def calculate_sku_metrics(self) -> pd.DataFrame:
        """Calculate per-SKU profit metrics"""
        print("\nCalculating SKU-level metrics...")
        
        sku_metrics = self.order_items_df.groupby('sku').agg({
            'quantity': 'sum',
            'line_total': 'sum',
            'total_cogs': 'sum',
            'total_shipping_cost': 'sum',
            'payment_fees': 'sum',
            'contribution_margin': 'sum',
        }).reset_index()
        
        # Add product names
        sku_info = self.order_items_df[['sku', 'product_name', 'cogs_per_unit', 'unit_price']].drop_duplicates()
        sku_metrics = sku_metrics.merge(sku_info, on='sku')
        
        # Calculate derived metrics
        sku_metrics['revenue_per_unit'] = (sku_metrics['line_total'] / sku_metrics['quantity']).round(2)
        sku_metrics['actual_cogs_pct'] = (sku_metrics['total_cogs'] / sku_metrics['line_total']).round(4)
        sku_metrics['contribution_margin_pct'] = (sku_metrics['contribution_margin'] / sku_metrics['line_total']).round(4)
        
        # Break-even ROAS = 1 / contribution margin %
        # This tells us what ROAS we need to break even after ad spend
        sku_metrics['break_even_roas'] = (1 / sku_metrics['contribution_margin_pct']).round(2)
        
        # Target ROAS (usually break-even + buffer for profit)
        sku_metrics['target_roas'] = (sku_metrics['break_even_roas'] * 1.3).round(2)  # 30% profit buffer
        
        # Sort by contribution margin
        sku_metrics = sku_metrics.sort_values('contribution_margin', ascending=False)
        
        return sku_metrics
    
    def calculate_daily_metrics(self) -> pd.DataFrame:
        """Calculate daily aggregated metrics"""
        print("\nCalculating daily metrics...")
        
        # Aggregate orders by day
        daily_orders = self.orders_df.groupby('order_date').agg({
            'order_id': 'count',
            'net_revenue': 'sum',
            'discounts': 'sum',
            'refunds': 'sum',
        }).rename(columns={'order_id': 'total_orders'})
        
        # Aggregate line items by day
        daily_items = self.order_items_df.groupby('order_date').agg({
            'quantity': 'sum',
            'line_total': 'sum',
            'total_cogs': 'sum',
            'total_shipping_cost': 'sum',
            'payment_fees': 'sum',
            'contribution_margin': 'sum',
        })
        
        # Aggregate ad spend by day
        daily_ads = self.ad_spend_df.groupby('date').agg({
            'spend': 'sum',
            'conversion_value': 'sum',
            'clicks': 'sum',
            'conversions': 'sum',
        })
        
        # Split by platform
        daily_meta = self.ad_spend_df[self.ad_spend_df['platform'] == 'meta'].groupby('date')['spend'].sum().rename('meta_spend')
        daily_google = self.ad_spend_df[self.ad_spend_df['platform'] == 'google'].groupby('date')['spend'].sum().rename('google_spend')
        
        # Combine all metrics
        daily = daily_orders.join(daily_items, how='outer').join(daily_ads, how='outer').join(daily_meta, how='outer').join(daily_google, how='outer')
        daily = daily.fillna(0)
        
        # Calculate derived metrics
        daily['aov'] = (daily['net_revenue'] / daily['total_orders']).round(2)
        daily['gross_profit'] = daily['contribution_margin']  # Before ad spend
        daily['gross_margin_pct'] = (daily['gross_profit'] / daily['net_revenue']).round(4)
        
        # Contribution margin after ad spend
        daily['contribution_margin_after_ads'] = daily['contribution_margin'] - daily['spend']
        daily['contribution_margin_after_ads_pct'] = (daily['contribution_margin_after_ads'] / daily['net_revenue']).round(4)
        
        # Blended ROAS = Revenue / Ad Spend
        daily['blended_roas'] = (daily['net_revenue'] / daily['spend']).round(2)
        
        # Blended CAC = Ad Spend / New Customers
        # We'll approximate new customers as 65% of orders (from generator logic)
        daily['estimated_new_customers'] = (daily['total_orders'] * 0.65).round(0)
        daily['blended_cac'] = (daily['spend'] / daily['estimated_new_customers']).round(2)
        
        # Break-even ROAS for the day
        daily['break_even_roas'] = (1 / daily['gross_margin_pct']).round(2)
        
        # ROAS vs Target
        daily['target_roas'] = 3.0  # Standard target
        daily['roas_vs_target'] = (daily['blended_roas'] / daily['target_roas']).round(2)
        
        # Net profit (after all variable costs including ads)
        daily['net_profit'] = daily['contribution_margin'] - daily['spend']
        daily['net_margin_pct'] = (daily['net_profit'] / daily['net_revenue']).round(4)
        
        return daily.reset_index()
    
    def generate_summary_report(self, sku_metrics: pd.DataFrame, daily_metrics: pd.DataFrame):
        """Generate a summary report"""
        print("\n" + "=" * 60)
        print("HARBOR GOODS CO. - PROFIT SUMMARY REPORT")
        print("=" * 60)
        
        # Overall metrics
        total_revenue = daily_metrics['net_revenue'].sum()
        total_cogs = daily_metrics['total_cogs'].sum()
        total_shipping = daily_metrics['total_shipping_cost'].sum()
        total_payment_fees = daily_metrics['payment_fees'].sum()
        total_ad_spend = daily_metrics['spend'].sum()
        total_contribution = daily_metrics['contribution_margin'].sum()
        total_net_profit = daily_metrics['net_profit'].sum()
        
        print(f"\n📊 OVERALL PERFORMANCE (90 Days)")
        print(f"   Total Revenue:        ${total_revenue:>12,.2f}")
        print(f"   Total COGS:           ${total_cogs:>12,.2f} ({total_cogs/total_revenue:.1%})")
        print(f"   Total Shipping:       ${total_shipping:>12,.2f} ({total_shipping/total_revenue:.1%})")
        print(f"   Total Payment Fees:   ${total_payment_fees:>12,.2f} ({total_payment_fees/total_revenue:.1%})")
        print(f"   ────────────────────────────────────────")
        print(f"   Contribution Margin:  ${total_contribution:>12,.2f} ({total_contribution/total_revenue:.1%})")
        print(f"   Total Ad Spend:       ${total_ad_spend:>12,.2f} ({total_ad_spend/total_revenue:.1%})")
        print(f"   ────────────────────────────────────────")
        print(f"   NET PROFIT:           ${total_net_profit:>12,.2f} ({total_net_profit/total_revenue:.1%})")
        
        # Per-SKU breakdown
        print(f"\n📦 PER-SKU BREAKDOWN")
        print(f"   {'SKU':<20} {'Units':>8} {'Revenue':>12} {'Margin %':>10} {'Break-Even ROAS':>15}")
        print(f"   {'─' * 70}")
        for _, row in sku_metrics.iterrows():
            print(f"   {row['product_name'][:18]:<20} {row['quantity']:>8} "
                  f"${row['line_total']:>10,.2f} {row['contribution_margin_pct']:>9.1%} "
                  f"{row['break_even_roas']:>14.2f}x")
        
        # Daily averages
        print(f"\n📈 DAILY AVERAGES")
        print(f"   Orders per day:       {daily_metrics['total_orders'].mean():.0f}")
        print(f"   Revenue per day:      ${daily_metrics['net_revenue'].mean():,.2f}")
        print(f"   AOV:                  ${daily_metrics['aov'].mean():.2f}")
        print(f"   Ad Spend per day:     ${daily_metrics['spend'].mean():,.2f}")
        print(f"   Blended ROAS:         {daily_metrics['blended_roas'].mean():.2f}x")
        print(f"   Blended CAC:          ${daily_metrics['blended_cac'].mean():.2f}")
        
        # Marketing breakdown
        meta_spend = daily_metrics['meta_spend'].sum()
        google_spend = daily_metrics['google_spend'].sum()
        print(f"\n🎯 MARKETING BREAKDOWN")
        print(f"   Meta (Facebook/IG):   ${meta_spend:>12,.2f} ({meta_spend/total_ad_spend:.1%})")
        print(f"   Google Ads:           ${google_spend:>12,.2f} ({google_spend/total_ad_spend:.1%})")
        
        print(f"\n{'=' * 60}\n")
        
    def export_metrics(self, sku_metrics: pd.DataFrame, daily_metrics: pd.DataFrame, output_dir: str):
        """Export calculated metrics to CSV"""
        os.makedirs(output_dir, exist_ok=True)
        
        # Export SKU metrics
        sku_metrics.to_csv(f"{output_dir}/sku_metrics.csv", index=False)
        print(f"Exported SKU metrics to {output_dir}/sku_metrics.csv")
        
        # Export daily metrics
        daily_metrics.to_csv(f"{output_dir}/daily_metrics.csv", index=False)
        print(f"Exported daily metrics to {output_dir}/daily_metrics.csv")
        
        # Export updated order items with calculated fields
        self.order_items_df.to_csv(f"{output_dir}/order_items_enriched.csv", index=False)
        print(f"Exported enriched order items to {output_dir}/order_items_enriched.csv")


def main():
    """Main entry point"""
    calculator = ProfitCalculator()
    
    print("=" * 60)
    print("Harbor Goods Co. - Profit Calculator")
    print("=" * 60)
    
    # Load data
    calculator.load_data()
    
    # Calculate costs and margins
    calculator.calculate_order_level_costs()
    
    # Calculate SKU metrics
    sku_metrics = calculator.calculate_sku_metrics()
    
    # Calculate daily metrics
    daily_metrics = calculator.calculate_daily_metrics()
    
    # Generate report
    calculator.generate_summary_report(sku_metrics, daily_metrics)
    
    # Export results
    output_dir = "/Users/johnbot/.openclaw/workspace/rior-systems/data"
    calculator.export_metrics(sku_metrics, daily_metrics, output_dir)
    
    print("\n✅ Profit calculation complete!")


if __name__ == "__main__":
    main()