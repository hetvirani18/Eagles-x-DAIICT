#!/usr/bin/env python3
"""Simple test to verify dynamic capacity calculation is working in the API"""

import requests
import json

def test_simple_dynamic_calculation():
    url = "http://localhost:8080/api/v1/advanced/comprehensive-analysis"
    
    # Test different locations
    locations = [
        ('Kutch (Arid)', 23.8, 69.8),
        ('Ahmedabad (Urban)', 23.0225, 72.5714),
        ('Surat (Water Rich)', 21.1702, 72.8311),
        ('Coastal Gujarat', 21.6, 70.2)
    ]
    
    print("🎯 TESTING DYNAMIC CALCULATION IN FRONTEND API:")
    print("=" * 60)
    
    for name, lat, lng in locations:
        print(f"\n📍 Testing {name} ({lat}, {lng}):")
        
        payload = {
            "latitude": lat,
            "longitude": lng,
            "technology_type": "pem",
            "electricity_source": "mixed_renewable"
            # No capacity_kg_day - should trigger dynamic calculation
        }
        
        try:
            response = requests.post(url, json=payload, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if 'base_analysis' in data:
                    base = data['base_analysis']
                    capacity = base.get('optimal_capacity_kg_day', 'N/A')
                    investment = base.get('total_capex', 'N/A')
                    roi = base.get('roi_percentage', 'N/A')
                    
                    print(f"   ✅ SUCCESS!")
                    print(f"   📊 Optimal Capacity: {capacity} kg/day")
                    print(f"   💰 Total Investment: ₹{investment} Cr")
                    print(f"   📈 ROI: {roi}%")
                else:
                    print(f"   ⚠️  No base_analysis in response")
                    print(f"   📄 Response keys: {list(data.keys())}")
            else:
                print(f"   ❌ Error {response.status_code}")
                print(f"   📄 Response: {response.text[:200]}...")
                
        except Exception as e:
            print(f"   ❌ Exception: {e}")
    
    print(f"\n{'='*60}")
    print("🎯 If you see different capacity values for each location,")
    print("   the dynamic calculation is working correctly!")

if __name__ == "__main__":
    test_simple_dynamic_calculation()
