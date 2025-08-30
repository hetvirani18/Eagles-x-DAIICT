#!/usr/bin/env python3
"""
Test script to verify dynamic pricing is working correctly
"""

import asyncio
import sys
import os

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models import LocationPoint, DemandCenter, IndustryType
from services.economic_calculator import ComprehensiveEconomicCalculator
from services.algorithm import HydrogenLocationOptimizer

async def test_dynamic_pricing():
    """Test dynamic pricing calculations"""
    print("🧪 Testing Dynamic Pricing System...")
    
    # Create test locations
    locations = [
        {"name": "Prime Location", "lat": 22.3, "lng": 70.8, "score": 350},
        {"name": "Good Location", "lat": 21.8, "lng": 72.1, "score": 280}, 
        {"name": "Average Location", "lat": 23.0, "lng": 71.5, "score": 220},
        {"name": "Poor Location", "lat": 22.5, "lng": 69.8, "score": 150}
    ]
    
    # Test economic calculator
    calculator = ComprehensiveEconomicCalculator()
    optimizer = HydrogenLocationOptimizer()
    
    print("\n📊 Testing Location-Based Pricing:")
    print("-" * 60)
    
    for loc_data in locations:
        location = LocationPoint(latitude=loc_data["lat"], longitude=loc_data["lng"])
        
        # Create test demand center
        demand_center = DemandCenter(
            name="Test Demand Center",
            type=IndustryType.REFINERY,
            location=LocationPoint(latitude=22.0, longitude=70.0),
            hydrogen_demand_mt_year=5000,
            current_hydrogen_source="SMR",
            green_transition_potential="High",
            willingness_to_pay=15.0
        )
        
        # Test dynamic pricing
        dynamic_price = calculator.calculate_dynamic_hydrogen_price(
            location, demand_center, 2000  # 2000 tonnes/year
        )
        
        # Calculate economic analysis 
        economics = optimizer.calculate_economics(
            location, {}, {}, {}, {}, {}, {}, overall_score=loc_data["score"]
        )
        
        print(f"{loc_data['name']:15} | Score: {loc_data['score']:3d} | "
              f"H₂ Price: ₹{dynamic_price:6.1f}/kg | "
              f"Capacity: {economics.get('annual_capacity_mt', 0):6.1f} MT | "
              f"ROI: {economics.get('roi_percentage', 0):5.1f}% | "
              f"Payback: {economics.get('payback_period_years', 0):4.1f} years")
    
    print("\n✅ Dynamic pricing test completed!")
    print("\nKey Observations:")
    print("- Higher scored locations should have lower H₂ prices (better efficiency)")
    print("- Annual capacity should vary based on location quality") 
    print("- ROI should be higher for better locations")
    print("- Payback period should be shorter for better locations")

if __name__ == "__main__":
    asyncio.run(test_dynamic_pricing())
