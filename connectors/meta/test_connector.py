#!/usr/bin/env python3
"""
Quick test for Meta connector components
"""
import sys
sys.path.insert(0, '/Users/johnbot/.openclaw/workspace/rior-systems/connectors/meta')

from meta_connector import DataTransformer, AdSpendRecord

def test_transformer():
    """Test data transformation"""
    print("Testing DataTransformer...")
    
    sample_insights = [
        {
            "date_start": "2024-01-01",
            "campaign_id": "123456",
            "campaign_name": "Test Campaign",
            "spend": "100.50",
            "impressions": "5000",
            "clicks": "250",
            "conversions": [{"value": "5"}]
        },
        {
            "date_start": "2024-01-02",
            "campaign_id": "123456",
            "campaign_name": "Test Campaign",
            "spend": "75.25",
            "impressions": "3000",
            "clicks": "150",
            "conversions": None
        }
    ]
    
    records = DataTransformer.transform_insights(sample_insights, "act_123")
    
    assert len(records) == 2, f"Expected 2 records, got {len(records)}"
    assert records[0].spend == 100.50
    assert records[0].conversions == 5.0
    assert records[1].conversions is None
    assert records[0].platform == "meta"
    
    print("✅ Transformer tests passed")

def test_dataclass():
    """Test AdSpendRecord dataclass"""
    print("Testing AdSpendRecord...")
    
    record = AdSpendRecord(
        date="2024-01-01",
        ad_account_id="act_123",
        campaign_id="camp_456",
        campaign_name="Test",
        spend=100.0,
        impressions=1000,
        clicks=50,
        conversions=2.0
    )
    
    assert record.platform == "meta"  # Default value
    assert record.date == "2024-01-01"
    
    print("✅ Dataclass tests passed")

if __name__ == "__main__":
    test_dataclass()
    test_transformer()
    print("\n✅ All tests passed!")
