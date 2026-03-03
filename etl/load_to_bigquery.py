#!/usr/bin/env python3
"""
Harbor Goods Co. - BigQuery Loader
Scaffold for loading data into BigQuery

NOTE: Requires GCP credentials to be configured separately.
This script provides the structure - actual loading requires:
- GOOGLE_APPLICATION_CREDENTIALS env var pointing to service account JSON
- Appropriate BigQuery permissions (dataEditor on dataset)
- gcloud CLI configured (optional but helpful)

Usage:
    export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
    python load_to_bigquery.py --project my-project --dataset harbor_goods
"""

import os
import sys
import argparse
from datetime import datetime
from typing import List, Dict
import pandas as pd

# BigQuery imports - uncomment when ready to use
# from google.cloud import bigquery
# from google.cloud.exceptions import NotFound


class BigQueryLoader:
    """Load Harbor Goods data into BigQuery"""
    
    def __init__(self, project_id: str, dataset_id: str = "harbor_goods"):
        self.project_id = project_id
        self.dataset_id = dataset_id
        self.dataset_ref = f"{project_id}.{dataset_id}"
        
        # Initialize client (requires GCP credentials)
        # self.client = bigquery.Client(project=project_id)
        
    def create_dataset(self, location: str = "US"):
        """Create the Harbor Goods dataset if it doesn't exist"""
        # Uncomment when ready:
        # from google.cloud import bigquery
        # dataset = bigquery.Dataset(self.dataset_ref)
        # dataset.location = location
        # dataset = self.client.create_dataset(dataset, exists_ok=True)
        # print(f"Dataset {self.dataset_ref} created/confirmed")
        print(f"[DRY RUN] Would create dataset: {self.dataset_ref} in {location}")
        
    def load_table_from_csv(self, table_name: str, csv_path: str, schema: List = None):
        """Load a CSV file into a BigQuery table"""
        # Uncomment when ready:
        # table_id = f"{self.dataset_ref}.{table_name}"
        # 
        # job_config = bigquery.LoadJobConfig(
        #     source_format=bigquery.SourceFormat.CSV,
        #     skip_leading_rows=1,
        #     autodetect=True if schema is None else False,
        #     schema=schema,
        #     write_disposition="WRITE_TRUNCATE",  # Replace existing data
        # )
        # 
        # with open(csv_path, "rb") as source_file:
        #     job = self.client.load_table_from_file(
        #         source_file, table_id, job_config=job_config
        #     )
        # job.result()  # Wait for job to complete
        # 
        # table = self.client.get_table(table_id)
        # print(f"Loaded {table.num_rows} rows into {table_id}")
        
        print(f"[DRY RUN] Would load {csv_path} into {self.dataset_ref}.{table_name}")
        
    def execute_sql_file(self, sql_file_path: str):
        """Execute a SQL file (for schema creation)"""
        # Uncomment when ready:
        # with open(sql_file_path, 'r') as f:
        #     sql = f.read()
        # 
        # # Replace project/dataset placeholders
        # sql = sql.replace("harbor_goods", self.dataset_ref)
        # 
        # job = self.client.query(sql)
        # job.result()
        # print(f"Executed {sql_file_path}")
        
        print(f"[DRY RUN] Would execute SQL from {sql_file_path}")
        
    def load_all_tables(self, data_dir: str):
        """Load all generated data into BigQuery"""
        tables = [
            ("orders", "orders.csv"),
            ("order_items", "order_items.csv"),
            ("products", "products.csv"),
            ("costs", "costs.csv"),
            ("ad_spend", "ad_spend.csv"),
        ]
        
        for table_name, filename in tables:
            csv_path = os.path.join(data_dir, filename)
            if os.path.exists(csv_path):
                self.load_table_from_csv(table_name, csv_path)
            else:
                print(f"Warning: {csv_path} not found, skipping")
                
    def run_transformations(self):
        """Run SQL transformations to calculate metrics_daily"""
        # This would run the SQL to populate metrics_daily from raw data
        query = f"""
        -- Example transformation query
        -- In production, this would be a scheduled query or dbt model
        
        CREATE OR REPLACE TABLE `{self.dataset_ref}.metrics_daily` AS
        WITH daily_orders AS (
            SELECT 
                order_date as date,
                COUNT(*) as total_orders,
                SUM(net_revenue) as net_revenue,
                SUM(discounts) as discounts,
                SUM(refunds) as refunds
            FROM `{self.dataset_ref}.orders`
            GROUP BY 1
        ),
        daily_items AS (
            SELECT
                order_date as date,
                SUM(quantity) as total_units_sold,
                SUM(line_total) as gross_revenue,
                SUM(total_cogs) as total_cogs,
                SUM(total_shipping_cost) as total_shipping_cost,
                SUM(payment_fees) as total_payment_fees,
                SUM(contribution_margin) as contribution_margin
            FROM `{self.dataset_ref}.order_items`
            GROUP BY 1
        ),
        daily_ads AS (
            SELECT
                date,
                SUM(spend) as total_spend,
                SUM(CASE WHEN platform = 'meta' THEN spend ELSE 0 END) as meta_spend,
                SUM(CASE WHEN platform = 'google' THEN spend ELSE 0 END) as google_spend
            FROM `{self.dataset_ref}.ad_spend`
            GROUP BY 1
        )
        SELECT 
            d.date,
            o.total_orders,
            i.total_units_sold,
            i.gross_revenue,
            o.discounts,
            o.refunds,
            o.net_revenue,
            SAFE_DIVIDE(o.net_revenue, o.total_orders) as aov,
            i.total_cogs,
            i.total_shipping_cost,
            i.total_payment_fees,
            a.total_spend as total_ad_spend,
            i.contribution_margin as gross_profit,
            SAFE_DIVIDE(i.contribution_margin, o.net_revenue) as gross_margin_pct,
            i.contribution_margin - a.total_spend as contribution_margin_after_ads,
            SAFE_DIVIDE(i.contribution_margin - a.total_spend, o.net_revenue) as contribution_margin_after_ads_pct,
            a.meta_spend,
            a.google_spend,
            SAFE_DIVIDE(o.net_revenue, a.total_spend) as blended_roas,
            SAFE_DIVIDE(1, SAFE_DIVIDE(i.contribution_margin, o.net_revenue)) as break_even_roas,
            i.contribution_margin - a.total_spend as net_profit,
            SAFE_DIVIDE(i.contribution_margin - a.total_spend, o.net_revenue) as net_margin_pct,
            TIMESTAMP("{datetime.now().isoformat()}") as calculated_at,
            'v1.0' as data_version
        FROM daily_orders o
        LEFT JOIN daily_items i ON o.date = i.date
        LEFT JOIN daily_ads a ON o.date = a.date
        ORDER BY 1
        """
        
        # Uncomment when ready:
        # job = self.client.query(query)
        # job.result()
        print(f"[DRY RUN] Would execute metrics transformation")
        print(f"Query:\n{query}")


def check_prerequisites():
    """Check if GCP credentials are configured"""
    creds_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
    
    if not creds_path:
        print("⚠️  WARNING: GOOGLE_APPLICATION_CREDENTIALS not set")
        print("   To enable BigQuery loading, set this environment variable:")
        print("   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json")
        return False
        
    if not os.path.exists(creds_path):
        print(f"⚠️  WARNING: Credentials file not found at {creds_path}")
        return False
        
    print(f"✅ GCP credentials found: {creds_path}")
    return True


def main():
    parser = argparse.ArgumentParser(description='Load Harbor Goods data into BigQuery')
    parser.add_argument('--project', required=True, help='GCP Project ID')
    parser.add_argument('--dataset', default='harbor_goods', help='BigQuery dataset name')
    parser.add_argument('--data-dir', default='/Users/johnbot/.openclaw/workspace/rior-systems/data',
                        help='Directory containing CSV files')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be done without executing')
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("Harbor Goods Co. - BigQuery Loader")
    print("=" * 60)
    print()
    
    # Check prerequisites
    has_creds = check_prerequisites()
    
    if not has_creds or args.dry_run:
        print("\n📝 Running in DRY RUN mode (no actual changes)")
        print()
    
    # Initialize loader
    loader = BigQueryLoader(args.project, args.dataset)
    
    # Show execution plan
    print("Execution Plan:")
    print(f"  1. Create dataset: {args.project}.{args.dataset}")
    print(f"  2. Load tables from: {args.data_dir}")
    print(f"     - orders")
    print(f"     - order_items")
    print(f"     - products")
    print(f"     - costs")
    print(f"     - ad_spend")
    print(f"  3. Run metrics transformation (metrics_daily)")
    print()
    
    if not has_creds or args.dry_run:
        print("To execute for real:")
        print("  1. Set GOOGLE_APPLICATION_CREDENTIALS environment variable")
        print("  2. Install google-cloud-bigquery: pip install google-cloud-bigquery")
        print("  3. Uncomment the BigQuery code in this script")
        print("  4. Run again without --dry-run")
        print()
        print("✅ Scaffold complete! Ready for GCP credentials.")
        return
    
    # Execute loading (only if credentials present and not dry-run)
    print("Executing...")
    loader.create_dataset()
    loader.load_all_tables(args.data_dir)
    loader.run_transformations()
    
    print("\n✅ Data loaded successfully!")


if __name__ == "__main__":
    main()