#!/usr/bin/env python3
"""Direct test of economic calculator to debug ROI issue"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.economic_calculator import ComprehensiveEconomicCalculator
from models import LocationPoint, DemandCenter
from data.real_gujarat_data import get_energy_sources, get_demand_centers, get_water_sources

def test_economic_calculator():
    print("🧪 TESTING ECONOMIC CALCULATOR DIRECTLY")
    print("=" * 50)
    
    # Create calculator
    calculator = ComprehensiveEconomicCalculator()
    
    # Test location (Bharuch)
    location = LocationPoint(latitude=21.94, longitude=73.14)
    
    # Get real data
    energy_sources = get_energy_sources()
    demand_centers = get_demand_centers()
    
    # Find closest energy source and demand center
    energy_source = energy_sources[0] if energy_sources else None
    demand_center = demand_centers[0] if demand_centers else None
    
    print(f"📍 Location: {location.latitude}, {location.longitude}")
    print(f"⚡ Energy Source: {energy_source.name if energy_source else 'None'}")
    print(f"🏭 Demand Center: {demand_center.name if demand_center else 'None'}")
    print()
    
    try:
        # Test dynamic hydrogen price calculation
        price = calculator.calculate_dynamic_hydrogen_price(
            location, demand_center, 388.38, 3.5  # 388.38 tonnes/year from console
        )
        print(f"💰 Dynamic Hydrogen Price: ₹{price}/kg")
        
        # Test economic analysis
        analysis = calculator.calculate_comprehensive_economic_analysis(
            location=location,
            capacity_kg_day=1176.92,  # From console logs
            technology_type="pem",
            electricity_source="mixed_renewable"
        )
        
        print(f"📊 Base Analysis:")
        print(f"   • Capacity: {analysis.base_analysis.optimal_capacity_kg_day} kg/day")
        print(f"   • H2 Price: ₹{analysis.base_analysis.hydrogen_price_per_kg}/kg")
        print(f"   • ROI: {analysis.base_analysis.roi_percentage}%")
        print(f"   • Payback: {analysis.base_analysis.payback_period_years} years")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_economic_calculator()
