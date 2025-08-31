#!/usr/bin/env python3
"""Simple comprehensive analysis that focuses on dynamic capacity calculation"""

import math
from typing import Dict, Tuple
from .economic_calculator import analyze_comprehensive_economic_feasibility

def clean_float_value(value):
    """Clean float values to prevent JSON serialization issues"""
    if value is None:
        return 0.0
    if math.isnan(value) or math.isinf(value):
        return 999.0 if value > 0 else 0.0
    return float(value)

def clean_data_dict(data_dict):
    """Recursively clean all float values in a dictionary"""
    cleaned = {}
    for key, value in data_dict.items():
        if isinstance(value, (int, float)):
            cleaned[key] = clean_float_value(value)
        elif isinstance(value, dict):
            cleaned[key] = clean_data_dict(value)
        elif isinstance(value, list):
            cleaned[key] = [clean_float_value(v) if isinstance(v, (int, float)) else v for v in value]
        else:
            cleaned[key] = value
    return cleaned

async def simple_comprehensive_location_analysis(location: Tuple[float, float],
                                                capacity_kg_day: int = None,
                                                technology_type: str = "pem",
                                                electricity_source: str = "mixed_renewable") -> Dict:
    """Simplified comprehensive analysis focusing on dynamic resource-based calculation"""
    
    lat, lng = location
    location_data = {'latitude': lat, 'longitude': lng}
    
    # Get dynamic analysis from economic calculator
    dynamic_analysis = analyze_comprehensive_economic_feasibility(
        location_data=location_data,
        electrolyzer_type=technology_type,
        capacity_kg_day=capacity_kg_day  # Will be calculated dynamically if None
    )
    
    # Extract key dynamic results with cleaned float values
    base_analysis = {
        'optimal_capacity_kg_day': clean_float_value(dynamic_analysis['summary']['optimal_capacity_kg_day']),
        'total_capex': clean_float_value(dynamic_analysis['summary']['total_investment_crores']),
        'total_annual_opex': clean_float_value(dynamic_analysis['comprehensive_analysis'].total_annual_opex),
        'hydrogen_price_per_kg': clean_float_value(dynamic_analysis['comprehensive_analysis'].hydrogen_selling_price_per_kg),
        'annual_production_tonnes': clean_float_value(dynamic_analysis['summary']['annual_capacity_tonnes']),
        'capacity_utilization': clean_float_value(dynamic_analysis['resource_analysis']['capacity_utilization_percentage']),
        'roi_percentage': clean_float_value(dynamic_analysis['summary']['roi_percentage']),
        'npv_10_years': clean_float_value(dynamic_analysis['comprehensive_analysis'].npv_10_years),
        'payback_period_years': clean_float_value(dynamic_analysis['summary']['payback_years']),
        'bottleneck_resource': dynamic_analysis['summary']['bottleneck_resource'],
        'available_water_liters_day': clean_float_value(dynamic_analysis['resource_analysis']['available_water_liters_day']),
        'available_electricity_kwh_day': clean_float_value(dynamic_analysis['resource_analysis']['available_electricity_kwh_day']),
        'annual_revenue': clean_float_value(dynamic_analysis['comprehensive_analysis'].annual_revenue)
    }
    
    # Simple investment recommendation
    investment_recommendation = {
        'recommendation': 'Recommended' if base_analysis['roi_percentage'] > 15 else 'Not Recommended',
        'recommended_capacity_kg_day': base_analysis['optimal_capacity_kg_day'],
        'total_investment_cr': base_analysis['total_capex'],
        'key_strengths': [
            f"Optimal capacity: {base_analysis['optimal_capacity_kg_day']} kg/day",
            f"ROI: {base_analysis['roi_percentage']:.1f}%",
            f"Payback: {base_analysis['payback_period_years']:.1f} years"
        ],
        'key_risks': [
            f"Limited by {base_analysis['bottleneck_resource'].lower()}",
            "Market demand variability",
            "Technology advancement risk"
        ]
    }
    
    return clean_data_dict({
        'base_analysis': base_analysis,
        'investment_recommendation': investment_recommendation,
        'status': 'success'
    })
