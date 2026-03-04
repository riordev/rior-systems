#!/usr/bin/env python3
"""
Meta Marketing API Connector
Extracts ad spend data and loads to BigQuery
"""

import os
import sys
import json
import yaml
import argparse
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from pathlib import Path

import requests
from dateutil.parser import parse as parse_date
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class AdSpendRecord:
    """BigQuery schema for ad_spend table"""
    date: str
    ad_account_id: str
    campaign_id: str
    campaign_name: str
    spend: float
    impressions: int
    clicks: int
    conversions: Optional[float]
    platform: str = "meta"
    loaded_at: Optional[str] = None


class MetaAPIClient:
    """Client for Meta Marketing API"""
    
    BASE_URL = "https://graph.facebook.com/v18.0"
    
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        })
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((requests.exceptions.RequestException,))
    )
    def _make_request(self, endpoint: str, params: Optional[Dict] = None) -> Dict:
        """Make API request with retries"""
        url = f"{self.BASE_URL}{endpoint}"
        request_params = params or {}
        request_params["access_token"] = self.access_token
        
        response = self.session.get(url, params=request_params, timeout=30)
        response.raise_for_status()
        return response.json()
    
    def get_ad_accounts(self) -> List[Dict]:
        """Fetch all ad accounts for the user"""
        logger.info("Fetching ad accounts...")
        accounts = []
        
        response = self._make_request("/me/adaccounts", {
            "fields": "id,name,account_status",
            "limit": 100
        })
        
        data = response.get("data", [])
        for account in data:
            if account.get("account_status") == 1:  # Active accounts only
                accounts.append({
                    "id": account["id"],
                    "name": account.get("name", "Unknown")
                })
        
        logger.info(f"Found {len(accounts)} active ad accounts")
        return accounts
    
    def get_campaigns(self, ad_account_id: str) -> List[Dict]:
        """Fetch campaigns for an ad account"""
        logger.info(f"Fetching campaigns for {ad_account_id}...")
        campaigns = []
        
        endpoint = f"/{ad_account_id}/campaigns"
        params = {
            "fields": "id,name,status,effective_status",
            "limit": 100
        }
        
        while True:
            response = self._make_request(endpoint, params)
            data = response.get("data", [])
            
            for campaign in data:
                campaigns.append({
                    "id": campaign["id"],
                    "name": campaign.get("name", "Unknown"),
                    "status": campaign.get("status", "UNKNOWN")
                })
            
            # Handle pagination
            paging = response.get("paging", {})
            next_url = paging.get("next")
            if not next_url:
                break
            
            # Extract cursor for next page
            cursors = paging.get("cursors", {})
            if "after" in cursors:
                params["after"] = cursors["after"]
            else:
                break
        
        logger.info(f"Found {len(campaigns)} campaigns for {ad_account_id}")
        return campaigns
    
    def get_insights(
        self, 
        ad_account_id: str, 
        start_date: str, 
        end_date: str,
        campaign_id: Optional[str] = None
    ) -> List[Dict]:
        """Fetch insights data with day and campaign breakdown"""
        logger.info(f"Fetching insights for {ad_account_id} ({start_date} to {end_date})...")
        insights = []
        
        endpoint = f"/{ad_account_id}/insights"
        params = {
            "fields": "spend,impressions,clicks,conversions,campaign_id,campaign_name",
            "time_range": json.dumps({"since": start_date, "until": end_date}),
            "time_increment": 1,  # Daily breakdown
            "level": "campaign",
            "limit": 500
        }
        
        if campaign_id:
            params["filtering"] = json.dumps([{
                "field": "campaign.id",
                "operator": "EQUAL",
                "value": campaign_id
            }])
        
        page_count = 0
        while True:
            response = self._make_request(endpoint, params)
            data = response.get("data", [])
            page_count += 1
            
            for insight in data:
                insights.append(insight)
            
            # Handle pagination
            paging = response.get("paging", {})
            cursors = paging.get("cursors", {})
            if "after" in cursors:
                params["after"] = cursors["after"]
            else:
                break
            
            if page_count > 100:  # Safety limit
                logger.warning(f"Pagination limit reached for {ad_account_id}")
                break
        
        logger.info(f"Retrieved {len(insights)} insight records for {ad_account_id}")
        return insights


class DataTransformer:
    """Transform Meta API data to BigQuery schema"""
    
    @staticmethod
    def transform_insights(
        insights: List[Dict], 
        ad_account_id: str
    ) -> List[AdSpendRecord]:
        """Transform insights to AdSpendRecord format"""
        records = []
        now = datetime.utcnow().isoformat()
        
        for insight in insights:
            # Parse date from insight
            date_str = insight.get("date_start", "")
            
            # Extract conversions (could be in different formats)
            conversions = None
            conv_data = insight.get("conversions")
            if conv_data:
                if isinstance(conv_data, list) and len(conv_data) > 0:
                    conversions = float(conv_data[0].get("value", 0))
                elif isinstance(conv_data, dict):
                    conversions = float(conv_data.get("value", 0))
                elif isinstance(conv_data, (int, float)):
                    conversions = float(conv_data)
            
            record = AdSpendRecord(
                date=date_str,
                ad_account_id=ad_account_id,
                campaign_id=insight.get("campaign_id", ""),
                campaign_name=insight.get("campaign_name", "Unknown"),
                spend=float(insight.get("spend", 0) or 0),
                impressions=int(insight.get("impressions", 0) or 0),
                clicks=int(insight.get("clicks", 0) or 0),
                conversions=conversions,
                loaded_at=now
            )
            records.append(record)
        
        return records


class BigQueryLoader:
    """Load data to BigQuery with upsert logic"""
    
    def __init__(self, project: str, dataset: str, table: str):
        try:
            from google.cloud import bigquery
            self.client = bigquery.Client(project=project)
            self.project = project
            self.dataset = dataset
            self.table = table
            self.table_ref = f"{project}.{dataset}.{table}"
        except ImportError:
            logger.error("google-cloud-bigquery not installed")
            raise
    
    def ensure_table(self):
        """Ensure the ad_spend table exists with correct schema"""
        from google.cloud import bigquery
        
        schema = [
            bigquery.SchemaField("date", "DATE", mode="REQUIRED"),
            bigquery.SchemaField("ad_account_id", "STRING", mode="REQUIRED"),
            bigquery.SchemaField("campaign_id", "STRING", mode="REQUIRED"),
            bigquery.SchemaField("campaign_name", "STRING", mode="NULLABLE"),
            bigquery.SchemaField("spend", "FLOAT", mode="NULLABLE"),
            bigquery.SchemaField("impressions", "INTEGER", mode="NULLABLE"),
            bigquery.SchemaField("clicks", "INTEGER", mode="NULLABLE"),
            bigquery.SchemaField("conversions", "FLOAT", mode="NULLABLE"),
            bigquery.SchemaField("platform", "STRING", mode="NULLABLE"),
            bigquery.SchemaField("loaded_at", "TIMESTAMP", mode="NULLABLE"),
        ]
        
        try:
            table = self.client.get_table(self.table_ref)
            logger.info(f"Table {self.table_ref} exists")
            return table
        except Exception:
            logger.info(f"Creating table {self.table_ref}...")
            table = bigquery.Table(self.table_ref, schema=schema)
            table.time_partitioning = bigquery.TimePartitioning(
                type_=bigquery.TimePartitioningType.DAY,
                field="date"
            )
            table.clustering_fields = ["ad_account_id", "campaign_id"]
            table = self.client.create_table(table)
            logger.info(f"Created table {self.table_ref}")
            return table
    
    def upsert_records(self, records: List[AdSpendRecord]) -> int:
        """Upsert records to BigQuery (delete existing, then insert)"""
        if not records:
            logger.info("No records to load")
            return 0
        
        from google.cloud import bigquery
        
        # Get unique date range and accounts for deletion
        date_accounts = {}
        for record in records:
            key = (record.date, record.ad_account_id)
            if key not in date_accounts:
                date_accounts[key] = []
            date_accounts[key].append(record.campaign_id)
        
        # Delete existing records for these date/account/campaign combinations
        for (date, account_id), campaign_ids in date_accounts.items():
            campaigns_str = ", ".join([f'"{c}"' for c in set(campaign_ids)])
            delete_sql = f"""
            DELETE FROM `{self.table_ref}`
            WHERE date = '{date}'
              AND ad_account_id = '{account_id}'
              AND campaign_id IN ({campaigns_str})
            """
            try:
                query_job = self.client.query(delete_sql)
                query_job.result()
            except Exception as e:
                logger.warning(f"Delete error (may be OK for new data): {e}")
        
        # Insert new records
        rows = [asdict(r) for r in records]
        errors = self.client.insert_rows_json(self.table_ref, rows)
        
        if errors:
            logger.error(f"Insert errors: {errors[:5]}")
            raise Exception(f"Failed to insert {len(errors)} rows")
        
        logger.info(f"Upserted {len(records)} records to {self.table_ref}")
        return len(records)


class MetaConnector:
    """Main connector orchestrating extraction and load"""
    
    def __init__(self, config_path: str = "config.yaml"):
        self.config = self._load_config(config_path)
        self.meta_token = os.getenv("META_ACCESS_TOKEN")
        
        if not self.meta_token:
            raise ValueError("META_ACCESS_TOKEN environment variable required")
        
        self.meta_client = MetaAPIClient(self.meta_token)
        self.transformer = DataTransformer()
        
        # Initialize BigQuery loader
        bq_config = self.config.get("bigquery", {})
        self.bq_loader = BigQueryLoader(
            project=bq_config.get("project", "rior-prod"),
            dataset=bq_config.get("dataset", "rior_prod"),
            table=bq_config.get("table", "ad_spend")
        )
    
    def _load_config(self, path: str) -> Dict:
        """Load configuration from YAML"""
        config_path = Path(path)
        if not config_path.exists():
            logger.warning(f"Config file not found: {path}, using defaults")
            return {
                "ad_accounts": [],
                "bigquery": {
                    "project": "rior-prod",
                    "dataset": "rior_prod",
                    "table": "ad_spend"
                }
            }
        
        with open(path) as f:
            return yaml.safe_load(f)
    
    def run(
        self, 
        start_date: str, 
        end_date: str, 
        dry_run: bool = False
    ) -> Dict[str, Any]:
        """Execute full extraction and load process"""
        
        results = {
            "start_date": start_date,
            "end_date": end_date,
            "ad_accounts_processed": 0,
            "campaigns_found": 0,
            "records_extracted": 0,
            "records_loaded": 0,
            "errors": []
        }
        
        try:
            # Get ad accounts
            config_accounts = self.config.get("ad_accounts", [])
            if config_accounts:
                ad_accounts = [{"id": aid, "name": "Configured"} for aid in config_accounts]
            else:
                ad_accounts = self.meta_client.get_ad_accounts()
            
            if not ad_accounts:
                results["errors"].append("No ad accounts found")
                return results
            
            all_records = []
            
            for account in ad_accounts:
                account_id = account["id"]
                results["ad_accounts_processed"] += 1
                
                try:
                    # Get campaigns (for validation/context)
                    campaigns = self.meta_client.get_campaigns(account_id)
                    results["campaigns_found"] += len(campaigns)
                    
                    # Get insights data
                    insights = self.meta_client.get_insights(
                        account_id, start_date, end_date
                    )
                    
                    # Transform to records
                    records = self.transformer.transform_insights(
                        insights, account_id
                    )
                    all_records.extend(records)
                    results["records_extracted"] += len(records)
                    
                except Exception as e:
                    error_msg = f"Error processing {account_id}: {str(e)}"
                    logger.error(error_msg)
                    results["errors"].append(error_msg)
            
            # Load to BigQuery
            if not dry_run and all_records:
                try:
                    self.bq_loader.ensure_table()
                    loaded = self.bq_loader.upsert_records(all_records)
                    results["records_loaded"] = loaded
                except Exception as e:
                    error_msg = f"BigQuery load error: {str(e)}"
                    logger.error(error_msg)
                    results["errors"].append(error_msg)
            elif dry_run:
                logger.info(f"DRY RUN: Would load {len(all_records)} records")
                results["records_loaded"] = 0
            
        except Exception as e:
            error_msg = f"Connector error: {str(e)}"
            logger.error(error_msg)
            results["errors"].append(error_msg)
        
        return results


def main():
    parser = argparse.ArgumentParser(
        description="Meta Marketing API Connector for BigQuery"
    )
    parser.add_argument(
        "--start-date",
        help="Start date (YYYY-MM-DD). Defaults to 30 days ago"
    )
    parser.add_argument(
        "--end-date",
        help="End date (YYYY-MM-DD). Defaults to today"
    )
    parser.add_argument(
        "--config",
        default="config.yaml",
        help="Path to config file"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Fetch data without loading to BigQuery"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose logging"
    )
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Default dates
    end_date = args.end_date or datetime.now().strftime("%Y-%m-%d")
    if args.start_date:
        start_date = args.start_date
    else:
        start_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    
    # Run connector
    try:
        connector = MetaConnector(args.config)
        results = connector.run(start_date, end_date, args.dry_run)
        
        # Output summary
        print("\n" + "="*60)
        print("META CONNECTOR - EXECUTION SUMMARY")
        print("="*60)
        print(f"Date Range:    {results['start_date']} to {results['end_date']}")
        print(f"Ad Accounts:   {results['ad_accounts_processed']}")
        print(f"Campaigns:     {results['campaigns_found']}")
        print(f"Records Extracted: {results['records_extracted']}")
        print(f"Records Loaded:    {results['records_loaded']}")
        
        if results['errors']:
            print(f"\n⚠️  ERRORS ({len(results['errors'])}):")
            for err in results['errors']:
                print(f"  - {err}")
        else:
            print("\n✅ Completed successfully")
        
        print("="*60)
        
        # Return exit code
        sys.exit(0 if not results['errors'] else 1)
        
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
