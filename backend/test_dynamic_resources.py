#!/usr/bin/env python3
"""Test script to verify dynamic capacity calculation"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.economic_calculator import ComprehensiveEconomicCalculator
from models import LocationPoint

def test_dynamic_resources():
    """Test that resources vary by location"""
    calc = ComprehensiveEconomicCalculator()
    
    # Test different locations
    locations = [
        {'name': 'Kutch (Arid)', 'lat': 23.8, 'lon': 69.8},
        {'name': 'Ahmedabad (Urban)', 'lat': 23.0225, 'lon': 72.5714}, 
        {'name': 'Surat (Water Rich)', 'lat': 21.1702, 'lon': 72.8311},
        {'name': 'Coastal Gujarat', 'lat': 21.6, 'lon': 70.2}
    ]
    
    print("🧪 TESTING DYNAMIC RESOURCE CALCULATION:")
    print("=" * 60)
    
    for loc in locations:
        location = LocationPoint(latitude=loc['lat'], longitude=loc['lon'])
        
        water_avail = calc._calculate_location_water_availability(location)
        water_cost = calc._calculate_location_water_cost(location)
        elec_avail = calc._calculate_location_electricity_availability(location)
        elec_cost = calc._calculate_location_electricity_cost(location)
        
        # Calculate H2 capacity from resources
        water_limited = water_avail / 9  # 9L per kg H2 for PEM
        elec_limited = elec_avail / 52   # 52 kWh per kg H2 for PEM
        capacity = min(water_limited, elec_limited) * 0.85  # 85% capacity factor
        
        print(f"\n📍 {loc['name']}:")
        print(f"   💧 Water: {water_avail:,.0f} L/day @ ₹{water_cost:.2f}/L")
        print(f"   ⚡ Electricity: {elec_avail:,.0f} kWh/day @ ₹{elec_cost:.2f}/kWh")
        print(f"   🏭 Max H2 Capacity: {capacity:.0f} kg/day")
        print(f"   📊 Annual Capacity: {(capacity * 330 / 1000):.0f} tonnes/year")
        
        # Show bottleneck
        bottleneck = "Water" if water_limited < elec_limited else "Electricity"
        print(f"   🎯 Bottleneck: {bottleneck}")

if __name__ == "__main__":
    test_dynamic_resources()
