#!/usr/bin/env python3
"""Test to simulate frontend location selection with dynamic data fetch"""

import requests
import json

def test_frontend_location_selection():
    """Test what happens when frontend selects a location and calls for dynamic data"""
    
    # Simulate clicking on Ahmedabad location
    location_data = {
        "id": "ahmedabad_test",
        "name": "Ahmedabad Test Location", 
        "location": {
            "latitude": 23.0225,
            "longitude": 72.5714
        },
        "overallScore": 180,
        "projectedCost": 350,  # Old static value
        "annualCapacity": 25   # Old static value (will show as 25,000 MT)
    }
    
    print("🔬 TESTING FRONTEND LOCATION SELECTION WITH DYNAMIC FETCH:")
    print("=" * 65)
    print(f"📍 Original Location Data (Static):")
    print(f"   💰 Projected Cost: ₹{location_data['projectedCost']}")
    print(f"   🏭 Annual Capacity: {location_data['annualCapacity']} (shows as {location_data['annualCapacity']*1000:,} MT)")
    print()
    
    # Simulate the API call that frontend now makes
    print("📡 Fetching Dynamic Analysis...")
    try:
        url = "http://localhost:8080/api/v1/advanced/comprehensive-analysis"
        payload = {
            "latitude": location_data["location"]["latitude"],
            "longitude": location_data["location"]["longitude"],
            "technology_type": "pem",
            "electricity_source": "mixed_renewable"
        }
        
        response = requests.post(url, json=payload, timeout=30)
        
        if response.status_code == 200:
            dynamic_data = response.json()
            
            if dynamic_data.get("status") == "success" and dynamic_data.get("base_analysis"):
                base = dynamic_data["base_analysis"]
                
                # Simulate what frontend does to enrich location data
                enriched_location = {
                    **location_data,
                    "production_metrics": {
                        "projected_cost_per_kg": round(base.get("hydrogen_price_per_kg", 350), 2),
                        "annual_capacity_mt": round((base.get("annual_production_tonnes", 25) * 1000), 0),
                        "payback_period_years": round(base.get("payback_period_years", 0), 1),
                        "roi_percentage": round(base.get("roi_percentage", 0), 1),
                        "optimal_capacity_kg_day": round(base.get("optimal_capacity_kg_day", 0), 0),
                        "total_capex": round(base.get("total_capex", 0), 2)
                    },
                    "dynamic_analysis": dynamic_data
                }
                
                print("✅ SUCCESS! Dynamic Data Retrieved:")
                print(f"   💰 Dynamic Cost per kg: ₹{enriched_location['production_metrics']['projected_cost_per_kg']}")
                print(f"   🏭 Dynamic Annual Capacity: {enriched_location['production_metrics']['annual_capacity_mt']:,} MT")
                print(f"   📈 Dynamic ROI: {enriched_location['production_metrics']['roi_percentage']}%")
                print(f"   ⏱️  Dynamic Payback: {enriched_location['production_metrics']['payback_period_years']} years")
                print(f"   ⚡ Optimal Daily Capacity: {enriched_location['production_metrics']['optimal_capacity_kg_day']:,} kg/day")
                print()
                
                print("🎯 COMPARISON:")
                print(f"   Cost:     ₹{location_data['projectedCost']} → ₹{enriched_location['production_metrics']['projected_cost_per_kg']} (Dynamic)")
                print(f"   Capacity: {location_data['annualCapacity']*1000:,} MT → {enriched_location['production_metrics']['annual_capacity_mt']:,} MT (Dynamic)")
                print()
                print("✅ Frontend should now show the dynamic values instead of static ones!")
                
            else:
                print("❌ API returned success but missing base_analysis")
        else:
            print(f"❌ API Error: {response.status_code}")
            print(f"Response: {response.text[:200]}...")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("=" * 65)

if __name__ == "__main__":
    test_frontend_location_selection()
