#!/usr/bin/env python3
"""
Shopify Admin API Connector for Rior Systems
Fetches orders, products, and refunds from Shopify Admin API
and loads them into BigQuery.
"""

import os
import sys
import json
import argparse
import logging
from datetime import datetime, timezone
from typing import Iterator, Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from pathlib import Path

import requests
from google.cloud import bigquery
from google.api_core import retry

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('shopify_connector')

# Constants
SHOPIFY_API_VERSION = "2024-01"
PAGE_SIZE = 250
DEFAULT_CONFIG_PATH = Path(__file__).parent / "config.json"


@dataclass
class ShopifyConfig:
    """Configuration for Shopify connector"""
    shop_domain: str
    api_key: str
    api_version: str = SHOPIFY_API_VERSION
    
    @classmethod
    def from_env(cls, shop_domain: str) -> 'ShopifyConfig':
        """Load config from environment variables"""
        api_key = os.getenv('SHOPIFY_API_KEY')
        if not api_key:
            raise ValueError("SHOPIFY_API_KEY environment variable not set")
        return cls(shop_domain=shop_domain, api_key=api_key)
    
    @classmethod
    def from_config_file(cls, shop_domain: str, config_path: Path = DEFAULT_CONFIG_PATH) -> 'ShopifyConfig':
        """Load config from JSON file"""
        if not config_path.exists():
            return cls.from_env(shop_domain)
        
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        shop_config = config.get('shops', {}).get(shop_domain)
        if shop_config:
            return cls(
                shop_domain=shop_domain,
                api_key=shop_config.get('api_key') or os.getenv('SHOPIFY_API_KEY'),
                api_version=shop_config.get('api_version', SHOPIFY_API_VERSION)
            )
        
        return cls.from_env(shop_domain)


class ShopifyAPIClient:
    """Client for Shopify Admin API"""
    
    def __init__(self, config: ShopifyConfig):
        self.config = config
        self.base_url = f"https://{config.shop_domain}/admin/api/{config.api_version}"
        self.session = requests.Session()
        self.session.headers.update({
            'X-Shopify-Access-Token': config.api_key,
            'Content-Type': 'application/json'
        })
    
    def _make_request(self, endpoint: str, params: Dict = None) -> Dict:
        """Make authenticated request to Shopify API"""
        url = f"{self.base_url}{endpoint}"
        response = self.session.get(url, params=params or {})
        response.raise_for_status()
        return response.json()
    
    def _paginate(self, endpoint: str, params: Dict = None, since_id: str = None) -> Iterator[Dict]:
        """Handle pagination for Shopify API requests"""
        params = params or {}
        params['limit'] = PAGE_SIZE
        
        if since_id:
            params['since_id'] = since_id
        
        while True:
            logger.debug(f"Fetching {endpoint} with params: {params}")
            data = self._make_request(endpoint, params)
            
            # Extract resource name from endpoint
            resource = endpoint.strip('/').split('/')[-1].replace('.json', '')
            items = data.get(resource, [])
            
            if not items:
                break
            
            for item in items:
                yield item
            
            # Check for next page via Link header
            response = self.session.get(f"{self.base_url}{endpoint}", params=params)
            link_header = response.headers.get('Link', '')
            
            if 'rel="next"' not in link_header:
                break
            
            # Extract next page info
            import re
            next_match = re.search(r'<[^>]+page_info=([^>]+)>; rel="next"', link_header)
            if not next_match:
                break
            
            params['page_info'] = next_match.group(1).rstrip('>')
            # Remove since_id when using page_info
            params.pop('since_id', None)
    
    def fetch_orders(self, created_at_min: str = None, updated_at_min: str = None) -> Iterator[Dict]:
        """Fetch all orders with optional date filtering"""
        params = {'status': 'any'}
        if created_at_min:
            params['created_at_min'] = created_at_min
        if updated_at_min:
            params['updated_at_min'] = updated_at_min
        
        return self._paginate('/orders.json', params)
    
    def fetch_products(self, updated_at_min: str = None) -> Iterator[Dict]:
        """Fetch all products with optional date filtering"""
        params = {}
        if updated_at_min:
            params['updated_at_min'] = updated_at_min
        
        return self._paginate('/products.json', params)
    
    def fetch_refunds(self, order_id: str) -> List[Dict]:
        """Fetch refunds for a specific order"""
        try:
            data = self._make_request(f'/orders/{order_id}/refunds.json')
            return data.get('refunds', [])
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 404:
                return []
            raise


class DataTransformer:
    """Transform Shopify data to BigQuery schema"""
    
    @staticmethod
    def transform_order(order: Dict) -> Dict:
        """Transform order to BigQuery schema"""
        customer = order.get('customer', {}) or {}
        customer_id = customer.get('id')
        
        # Calculate financials
        total_price = float(order.get('total_price', 0) or 0)
        refunds = order.get('refunds', [])
        refund_amount = sum(
            float(t.get('amount', 0) or 0)
            for refund in refunds
            for t in refund.get('transactions', [])
        )
        
        return {
            'order_id': str(order.get('id')),
            'order_name': order.get('name'),
            'created_at': order.get('created_at'),
            'updated_at': order.get('updated_at'),
            'processed_at': order.get('processed_at'),
            'customer_id': str(customer_id) if customer_id else None,
            'customer_email': customer.get('email'),
            'customer_first_name': customer.get('first_name'),
            'customer_last_name': customer.get('last_name'),
            'financial_status': order.get('financial_status'),
            'fulfillment_status': order.get('fulfillment_status'),
            'currency': order.get('currency'),
            'subtotal_price': float(order.get('subtotal_price', 0) or 0),
            'total_tax': float(order.get('total_tax', 0) or 0),
            'total_shipping': float(order.get('total_shipping_price_set', {}).get('shop_money', {}).get('amount', 0) or 0),
            'total_discounts': float(order.get('total_discounts', 0) or 0),
            'total_price': total_price,
            'gross_revenue': total_price,
            'refund_amount': refund_amount,
            'net_revenue': total_price - refund_amount,
            'source_name': order.get('source_name'),
            'tags': order.get('tags', ''),
            'raw_json': json.dumps(order)
        }
    
    @staticmethod
    def transform_order_items(order_id: str, line_items: List[Dict]) -> List[Dict]:
        """Transform line items to BigQuery schema"""
        items = []
        for idx, item in enumerate(line_items):
            variant_id = item.get('variant_id')
            product_id = item.get('product_id')
            
            items.append({
                'order_id': str(order_id),
                'line_item_id': str(item.get('id')),
                'variant_id': str(variant_id) if variant_id else None,
                'product_id': str(product_id) if product_id else None,
                'title': item.get('title'),
                'variant_title': item.get('variant_title'),
                'quantity': item.get('quantity', 0),
                'price': float(item.get('price', 0) or 0),
                'total_discount': float(item.get('total_discount', 0) or 0),
                'sku': item.get('sku'),
                'vendor': item.get('vendor'),
                'fulfillment_status': item.get('fulfillment_status'),
                'position': idx
            })
        return items
    
    @staticmethod
    def transform_product(product: Dict) -> Dict:
        """Transform product to BigQuery schema"""
        variants = product.get('variants', [])
        
        # Get pricing from first variant
        first_variant = variants[0] if variants else {}
        price = float(first_variant.get('price', 0) or 0) if first_variant else 0
        cost = first_variant.get('cost') if first_variant else None
        
        # Inventory quantity across all variants
        total_inventory = sum(v.get('inventory_quantity', 0) or 0 for v in variants)
        
        return {
            'product_id': str(product.get('id')),
            'title': product.get('title'),
            'handle': product.get('handle'),
            'body_html': product.get('body_html'),
            'vendor': product.get('vendor'),
            'product_type': product.get('product_type'),
            'created_at': product.get('created_at'),
            'updated_at': product.get('updated_at'),
            'published_at': product.get('published_at'),
            'price': price,
            'cost': float(cost) if cost else None,
            'inventory_quantity': total_inventory,
            'tags': product.get('tags', ''),
            'status': product.get('status'),
            'raw_json': json.dumps(product)
        }


class BigQueryLoader:
    """Load data into BigQuery with upsert logic"""
    
    def __init__(self, project_id: str = None, dataset: str = 'rior_prod'):
        self.client = bigquery.Client(project=project_id)
        self.dataset = dataset
        self.stats = {'orders': 0, 'order_items': 0, 'products': 0}
    
    def _get_table_ref(self, table_name: str):
        """Get BigQuery table reference"""
        return self.client.dataset(self.dataset).table(table_name)
    
    def _upsert(self, table_name: str, rows: List[Dict], id_column: str):
        """Upsert rows into BigQuery table using MERGE"""
        if not rows:
            return 0
        
        table_ref = self._get_table_ref(table_name)
        
        # Create temporary table for staging
        temp_table = f"{table_name}_temp_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        temp_table_ref = self.client.dataset(self.dataset).table(temp_table)
        
        try:
            # Load to temp table
            job_config = bigquery.LoadJobConfig(
                write_disposition='WRITE_TRUNCATE',
                source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON
            )
            
            job = self.client.load_table_from_json(
                rows, temp_table_ref, job_config=job_config
            )
            job.result()
            
            # Build MERGE query
            columns = list(rows[0].keys())
            column_list = ', '.join(columns)
            update_set = ', '.join([f"T.{col} = S.{col}" for col in columns if col != id_column])
            insert_values = ', '.join([f"S.{col}" for col in columns])
            
            merge_query = f"""
            MERGE `{self.dataset}.{table_name}` T
            USING `{self.dataset}.{temp_table}` S
            ON T.{id_column} = S.{id_column}
            WHEN MATCHED THEN
              UPDATE SET {update_set}
            WHEN NOT MATCHED THEN
              INSERT ({column_list}) VALUES ({insert_values})
            """
            
            query_job = self.client.query(merge_query)
            query_job.result()
            
            return len(rows)
            
        finally:
            # Clean up temp table
            try:
                self.client.delete_table(temp_table_ref)
            except Exception:
                pass
    
    def load_orders(self, orders: List[Dict]) -> int:
        """Load orders to BigQuery"""
        count = self._upsert('orders', orders, 'order_id')
        self.stats['orders'] += count
        return count
    
    def load_order_items(self, items: List[Dict]) -> int:
        """Load order items to BigQuery"""
        count = self._upsert('order_items', items, 'line_item_id')
        self.stats['order_items'] += count
        return count
    
    def load_products(self, products: List[Dict]) -> int:
        """Load products to BigQuery"""
        count = self._upsert('products', products, 'product_id')
        self.stats['products'] += count
        return count
    
    def get_stats(self) -> Dict[str, int]:
        """Get loading statistics"""
        return self.stats.copy()


class ShopifyConnector:
    """Main connector orchestrating data flow"""
    
    def __init__(self, shop_domain: str, config_path: Path = None):
        self.config = ShopifyConfig.from_config_file(shop_domain, config_path or DEFAULT_CONFIG_PATH)
        self.shopify = ShopifyAPIClient(self.config)
        self.transformer = DataTransformer()
        self.loader = BigQueryLoader()
    
    def sync_orders(self, start_date: str = None) -> int:
        """Sync orders from Shopify to BigQuery"""
        logger.info(f"Starting order sync for {self.config.shop_domain}")
        
        order_count = 0
        item_count = 0
        orders_batch = []
        items_batch = []
        
        for order in self.shopify.fetch_orders(created_at_min=start_date):
            # Transform order
            transformed_order = self.transformer.transform_order(order)
            
            # Fetch and calculate refunds
            refunds = self.shopify.fetch_refunds(order['id'])
            refund_amount = sum(
                float(t.get('amount', 0) or 0)
                for refund in refunds
                for t in refund.get('transactions', [])
            )
            transformed_order['refund_amount'] = refund_amount
            transformed_order['net_revenue'] = transformed_order['gross_revenue'] - refund_amount
            
            orders_batch.append(transformed_order)
            order_count += 1
            
            # Transform line items
            line_items = order.get('line_items', [])
            transformed_items = self.transformer.transform_order_items(order['id'], line_items)
            items_batch.extend(transformed_items)
            item_count += len(transformed_items)
            
            # Batch load every 100 records
            if len(orders_batch) >= 100:
                self.loader.load_orders(orders_batch)
                self.loader.load_order_items(items_batch)
                orders_batch = []
                items_batch = []
                logger.info(f"Processed {order_count} orders...")
        
        # Load remaining records
        if orders_batch:
            self.loader.load_orders(orders_batch)
            self.loader.load_order_items(items_batch)
        
        logger.info(f"Order sync complete: {order_count} orders, {item_count} items")
        return order_count
    
    def sync_products(self, start_date: str = None) -> int:
        """Sync products from Shopify to BigQuery"""
        logger.info(f"Starting product sync for {self.config.shop_domain}")
        
        count = 0
        batch = []
        
        for product in self.shopify.fetch_products(updated_at_min=start_date):
            batch.append(self.transformer.transform_product(product))
            count += 1
            
            if len(batch) >= 100:
                self.loader.load_products(batch)
                batch = []
                logger.info(f"Processed {count} products...")
        
        if batch:
            self.loader.load_products(batch)
        
        logger.info(f"Product sync complete: {count} products")
        return count
    
    def sync_all(self, start_date: str = None) -> Dict[str, int]:
        """Run complete sync for orders and products"""
        self.sync_orders(start_date)
        self.sync_products(start_date)
        return self.loader.get_stats()


def main():
    parser = argparse.ArgumentParser(description='Shopify Admin API Connector')
    parser.add_argument('--shop', required=True, help='Shop domain (e.g., mystore.myshopify.com)')
    parser.add_argument('--start-date', help='Sync records created/updated after this date (YYYY-MM-DD)')
    parser.add_argument('--config', help='Path to config JSON file')
    parser.add_argument('--orders-only', action='store_true', help='Sync only orders')
    parser.add_argument('--products-only', action='store_true', help='Sync only products')
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose logging')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    config_path = Path(args.config) if args.config else None
    
    try:
        connector = ShopifyConnector(args.shop, config_path)
        
        if args.orders_only:
            connector.sync_orders(args.start_date)
        elif args.products_only:
            connector.sync_products(args.start_date)
        else:
            connector.sync_all(args.start_date)
        
        stats = connector.loader.get_stats()
        
        # Output results
        print("\n" + "="*50)
        print("SHOPIFY SYNC COMPLETE")
        print("="*50)
        print(f"Orders loaded:     {stats['orders']:,}")
        print(f"Order items loaded: {stats['order_items']:,}")
        print(f"Products loaded:   {stats['products']:,}")
        print("="*50)
        
        return 0
        
    except Exception as e:
        logger.error(f"Sync failed: {e}")
        print(f"\nERROR: {e}", file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
