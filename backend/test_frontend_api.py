#!/usr/bin/env python3
"""Test script to check what the frontend comprehensive analysis API returns"""

import requests
import json

def test_comprehensive_analysis_api():
    url = "http://localhost:8080/api/v1/advanced/comprehensive-analysis"
    
    # Test data matching what frontend sends
    payload = {
        "latitude": 23.0225,  # Ahmedabad
        "longitude": 72.5714,
        "capacity_kg_day": 1000,  # Frontend hardcoded value
        "technology_type": "pem",
        "electricity_source": "mixed_renewable"
    }
    
    print("🧪 TESTING FRONTEND API ENDPOINT:")
    print("=" * 50)
    print(f"📡 URL: {url}")
    print(f"📤 Payload: {json.dumps(payload, indent=2)}")
    print()
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: API returned data")
            print()
            
            # Print key sections of the response
            if 'base_analysis' in data:
                base = data['base_analysis']
                print("📋 BASE ANALYSIS:")
                print(f"   • Optimal Capacity: {base.get('optimal_capacity_kg_day', 'N/A')} kg/day")
                print(f"   • Total Investment: ₹{base.get('total_capex', 'N/A')} Cr")
                print(f"   • ROI: {base.get('roi_percentage', 'N/A')}%")
                print(f"   • Payback Period: {base.get('payback_period_years', 'N/A')} years")
                print()
            
            if 'investment_recommendation' in data:
                inv = data['investment_recommendation']
                print("💰 INVESTMENT RECOMMENDATION:")
                print(f"   • Recommended Capacity: {inv.get('recommended_capacity_kg_day', 'N/A')} kg/day")
                print(f"   • Total Investment: ₹{inv.get('total_investment_cr', 'N/A')} Cr")
                print()
            
            # Check if the values are dynamic or static
            if 'base_analysis' in data:
                capacity = data['base_analysis'].get('optimal_capacity_kg_day')
                capex = data['base_analysis'].get('total_capex')
                
                if capacity and capacity != 1000:
                    print(f"✅ DYNAMIC CAPACITY: {capacity} kg/day (different from frontend's 1000)")
                else:
                    print(f"❌ STATIC CAPACITY: Still showing {capacity} kg/day")
                    
                if capex and capex != 150.0:
                    print(f"✅ DYNAMIC INVESTMENT: ₹{capex} Cr (not the old static 150)")
                else:
                    print(f"❌ STATIC INVESTMENT: Still showing ₹{capex} Cr")
        else:
            print(f"❌ ERROR: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ EXCEPTION: {e}")

if __name__ == "__main__":
    test_comprehensive_analysis_api()
