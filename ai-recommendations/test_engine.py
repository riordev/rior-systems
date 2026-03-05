#!/usr/bin/env python3
"""
Simple test script for the AI Recommendations Engine.
"""

import subprocess
import json
import os


def test_mock_mode():
    """Test the engine with mock data."""
    print("Testing AI Recommendations Engine with mock data...")
    
    result = subprocess.run([
        "python3", "recommendation_engine.py",
        "--client-id=TEST_CLIENT",
        "--days=30",
        "--mock",
        "--output=test_recommendations.json"
    ], capture_output=True, text=True)
    
    print(result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr)
    
    # Validate output
    with open("test_recommendations.json", "r") as f:
        data = json.load(f)
    
    assert "recommendations" in data
    assert "generated_at" in data
    assert "client_id" in data
    
    for rec in data["recommendations"]:
        assert "id" in rec
        assert "type" in rec
        assert "confidence" in rec
        assert "potential_profit_impact" in rec
        assert 0 <= rec["confidence"] <= 100
    
    print(f"✅ All tests passed! Generated {len(data['recommendations'])} recommendations.")
    return True


def test_different_thresholds():
    """Test with different break-even ROAS thresholds."""
    print("\nTesting different thresholds...")
    
    for roas in [2.0, 2.5, 3.0, 3.5]:
        result = subprocess.run([
            "python3", "recommendation_engine.py",
            "--client-id=TEST_CLIENT",
            "--days=30",
            "--mock",
            f"--break-even-roas={roas}",
            "--output=test_threshold.json"
        ], capture_output=True, text=True)
        
        with open("test_threshold.json", "r") as f:
            data = json.load(f)
        
        print(f"  ROAS {roas}: {len(data['recommendations'])} recommendations")
    
    print("✅ Threshold tests passed!")
    return True


if __name__ == "__main__":
    os.chdir("/Users/johnbot/.openclaw/workspace/rior-systems/ai-recommendations")
    
    try:
        test_mock_mode()
        test_different_thresholds()
        print("\n🎉 All tests passed!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        exit(1)
