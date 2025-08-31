#!/usr/bin/env python3
"""Test API with dynamic calculations"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.interactive_investment_tools import run_complete_investment_analysis

async def test_api_dynamic():
    print('🧪 TESTING API WITH DYNAMIC CALCULATION:')
    print('=' * 60)
    
    # Test different locations
    locations = [
        ('Kutch (Arid)', (23.8, 69.8)),
        ('Ahmedabad (Urban)', (23.0225, 72.5714)),
        ('Surat (Water Rich)', (21.1702, 72.8311)),
        ('Coastal Gujarat', (21.6, 70.2))
    ]
    
    for name, (lat, lng) in locations:
        print(f'\n📍 {name}:')
        try:
            result = await run_complete_investment_analysis((lat, lng))
            
            base = result.get('base_analysis', {})
            print(f'   🏭 Optimal Capacity: {base.get("optimal_capacity_kg_day", "N/A")} kg/day')
            print(f'   💰 Total Investment: ₹{base.get("total_capex", "N/A")} Cr')
            print(f'   📊 ROI: {base.get("roi_percentage", "N/A")}%')
            print(f'   🎯 Bottleneck: {base.get("bottleneck_resource", "N/A")}')
        except Exception as e:
            print(f'   ❌ Error: {e}')

if __name__ == "__main__":
    asyncio.run(test_api_dynamic())
