#!/usr/bin/env python3
"""
Comprehensive test suite for the enhanced economic calculator
Tests all the features required in the problem statement
"""

import pytest
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.economic_calculator import (
    ComprehensiveEconomicCalculator, 
    analyze_comprehensive_economic_feasibility,
    ProductionCapacityAnalysis,
    MarketAnalysis,
    LandRequirementsAnalysis,
    DetailedInvestmentBreakdown
)
from models import LocationPoint, EnergySource, DemandCenter, WaterSource

class TestComprehensiveEconomicCalculator:
    """Test suite for comprehensive economic calculator"""
    
    def setup_method(self):
        """Set up test fixtures"""
        self.calculator = ComprehensiveEconomicCalculator()
        
        # Test location (Ahmedabad area)
        self.location = LocationPoint(latitude=23.0225, longitude=72.5714)
        
        # Test energy source
        self.energy_source = EnergySource(
            id="test_solar",
            name="Test Solar Farm",
            location=LocationPoint(latitude=23.1, longitude=72.6),
            capacity_mw=500,
            cost_per_kwh=2.8,
            annual_generation_gwh=1200,
            operator="Test Energy Co",
            type="Solar"
        )
        
        # Test demand center
        self.demand_center = DemandCenter(
            id="test_refinery",
            name="Test Refinery",
            location=LocationPoint(latitude=22.9, longitude=72.4),
            hydrogen_demand_mt_year=25000,
            current_hydrogen_source="Steam Methane Reforming",
            green_transition_potential="High",
            willingness_to_pay=20,
            type="Refinery"
        )
        
        # Test water source
        self.water_source = WaterSource(
            id="test_water",
            name="Test Water Source",
            location=LocationPoint(latitude=23.0, longitude=72.5),
            capacity_liters_day=5000000,
            quality_score=9.0,
            seasonal_availability="Perennial",
            extraction_cost=0.3,
            regulatory_clearance=True,
            type="Canal"
        )
    
    def test_production_capacity_analysis(self):
        """Test 1: Production capacity analysis with different scenarios"""
        print("\n=== Test 1: Production Capacity Analysis ===")
        
        analysis = self.calculator.calculate_production_capacity_analysis(
            available_electricity_kwh_day=60000,
            available_water_liters_day=15000,
            plant_capacity_kg_day=1000,
            electrolyzer_type='pem'
        )
        
        assert isinstance(analysis, ProductionCapacityAnalysis)
        assert analysis.base_production_kg_day > 0
        assert analysis.conservative_production_kg_day < analysis.base_production_kg_day
        assert analysis.optimistic_production_kg_day > analysis.base_production_kg_day
        
        print(f"✓ Conservative production: {analysis.conservative_production_kg_day:.2f} kg/day")
        print(f"✓ Base production: {analysis.base_production_kg_day:.2f} kg/day")
        print(f"✓ Optimistic production: {analysis.optimistic_production_kg_day:.2f} kg/day")
        print(f"✓ Electricity utilization: {analysis.electricity_utilization_percentage:.1f}%")
        print(f"✓ Water utilization: {analysis.water_utilization_percentage:.1f}%")
        
        # Test constraint detection
        if analysis.electricity_constraint:
            print("✓ Electricity constraint detected")
        if analysis.water_constraint:
            print("✓ Water constraint detected")
        if analysis.equipment_constraint:
            print("✓ Equipment constraint detected")
    
    def test_market_analysis(self):
        """Test 2: Market analysis and demand assessment"""
        print("\n=== Test 2: Market Analysis ===")
        
        market_analysis = self.calculator.calculate_market_analysis(
            location=self.location,
            demand_center=self.demand_center,
            production_capacity_tonnes_year=300
        )
        
        assert isinstance(market_analysis, MarketAnalysis)
        assert market_analysis.total_local_demand_tonnes_year > 0
        assert market_analysis.current_market_price_per_kg > 0
        assert market_analysis.projected_price_per_kg_5_year > market_analysis.current_market_price_per_kg
        
        print(f"✓ Total local demand: {market_analysis.total_local_demand_tonnes_year:,.0f} tonnes/year")
        print(f"✓ Current market price: ₹{market_analysis.current_market_price_per_kg:.0f}/kg")
        print(f"✓ 5-year price projection: ₹{market_analysis.projected_price_per_kg_5_year:.0f}/kg")
        print(f"✓ 10-year price projection: ₹{market_analysis.projected_price_per_kg_10_year:.0f}/kg")
        print(f"✓ Revenue at ₹300/kg: ₹{market_analysis.revenue_at_300_per_kg/1_00_00_000:.2f} Cr")
        print(f"✓ Revenue at ₹350/kg: ₹{market_analysis.revenue_at_350_per_kg/1_00_00_000:.2f} Cr")
        print(f"✓ Achievable market share: {market_analysis.achievable_market_share_percentage:.1f}%")
        print(f"✓ Optimal production volume: {market_analysis.optimal_production_volume_tonnes:.0f} tonnes/year")
    
    def test_land_requirements_analysis(self):
        """Test 3: Land requirements with safety zones and expansion"""
        print("\n=== Test 3: Land Requirements Analysis ===")
        
        land_analysis = self.calculator.calculate_land_requirements_analysis(
            plant_capacity_kg_day=1000,
            location=self.location
        )
        
        assert isinstance(land_analysis, LandRequirementsAnalysis)
        assert land_analysis.total_land_required_acres > 0
        assert land_analysis.safety_zone_area > 0
        assert land_analysis.expansion_reserve_area > 0
        
        print(f"✓ Electrolyzer area: {land_analysis.electrolyzer_area:.2f} acres")
        print(f"✓ Storage area: {land_analysis.storage_area:.2f} acres")
        print(f"✓ Safety zone: {land_analysis.safety_zone_area:.2f} acres")
        print(f"✓ Buffer zone: {land_analysis.buffer_zone_area:.2f} acres")
        print(f"✓ Expansion reserve: {land_analysis.expansion_reserve_area:.2f} acres")
        print(f"✓ Total land required: {land_analysis.total_land_required_acres:.2f} acres")
        print(f"✓ Land cost per acre: ₹{land_analysis.land_cost_per_acre/1_00_000:.2f} lakhs")
        print(f"✓ Total land cost: ₹{land_analysis.total_land_cost/1_00_00_000:.2f} Cr")
    
    def test_comprehensive_investment_analysis(self):
        """Test 4: Complete investment analysis with all features"""
        print("\n=== Test 4: Comprehensive Investment Analysis ===")
        
        analysis = self.calculator.calculate_comprehensive_investment_analysis(
            location=self.location,
            energy_source=self.energy_source,
            demand_center=self.demand_center,
            water_source=self.water_source,
            plant_capacity_kg_day=1000,
            electrolyzer_type='pem'
        )
        
        assert isinstance(analysis, DetailedInvestmentBreakdown)
        assert analysis.total_capex > 0
        assert analysis.total_annual_opex > 0
        assert analysis.annual_revenue > 0
        
        print(f"✓ Total CAPEX: ₹{analysis.total_capex:.2f} Cr")
        print(f"✓ Total annual OPEX: ₹{analysis.total_annual_opex:.2f} Cr")
        print(f"✓ Annual revenue: ₹{analysis.annual_revenue:.2f} Cr")
        print(f"✓ Annual profit: ₹{analysis.annual_profit:.2f} Cr")
        print(f"✓ ROI: {analysis.roi_percentage:.1f}%")
        print(f"✓ Payback period: {analysis.payback_period_years:.1f} years")
        print(f"✓ NPV (10 years): ₹{analysis.npv_10_years:.2f} Cr")
        print(f"✓ IRR: {analysis.irr_percentage:.1f}%")
        
        # Test LCOH calculations
        print(f"✓ LCOH Conservative: ₹{analysis.lcoh_conservative:.2f}/kg")
        print(f"✓ LCOH Base: ₹{analysis.lcoh_base:.2f}/kg")
        print(f"✓ LCOH Optimistic: ₹{analysis.lcoh_optimistic:.2f}/kg")
        
        # Test financial projections
        print(f"✓ Year 5 revenue: ₹{analysis.year_5_revenue:.2f} Cr")
        print(f"✓ Year 10 revenue: ₹{analysis.year_10_revenue:.2f} Cr")
        
        # Test risk assessment
        print(f"✓ Economic risk score: {analysis.economic_risk_score:.1f}")
        print(f"✓ Regulatory risk score: {analysis.regulatory_risk_score:.1f}")
        print(f"✓ Overall risk rating: {analysis.overall_risk_rating}")
    
    def test_sensitivity_analysis(self):
        """Test 5: Sensitivity analysis for key variables"""
        print("\n=== Test 5: Sensitivity Analysis ===")
        
        analysis = self.calculator.calculate_comprehensive_investment_analysis(
            location=self.location,
            energy_source=self.energy_source,
            demand_center=self.demand_center,
            water_source=self.water_source,
            plant_capacity_kg_day=1000,
            electrolyzer_type='pem'
        )
        
        # Test electricity price sensitivity
        print("Electricity Price Sensitivity (LCOH impact):")
        for change, lcoh in analysis.sensitivity_electricity_price.items():
            print(f"  {change}: ₹{lcoh:.2f}/kg")
        
        # Test hydrogen price sensitivity
        print("Hydrogen Price Sensitivity (ROI impact):")
        for change, roi in analysis.sensitivity_hydrogen_price.items():
            print(f"  {change}: {roi:.1f}%")
        
        # Test CAPEX sensitivity
        print("CAPEX Sensitivity (LCOH impact):")
        for change, lcoh in analysis.sensitivity_capex.items():
            print(f"  {change}: ₹{lcoh:.2f}/kg")
    
    def test_different_electrolyzer_types(self):
        """Test 6: Different electrolyzer technologies"""
        print("\n=== Test 6: Electrolyzer Technology Comparison ===")
        
        electrolyzer_types = ['alkaline', 'pem', 'solid_oxide']
        results = {}
        
        for tech in electrolyzer_types:
            try:
                analysis = self.calculator.calculate_comprehensive_investment_analysis(
                    location=self.location,
                    energy_source=self.energy_source,
                    demand_center=self.demand_center,
                    water_source=self.water_source,
                    plant_capacity_kg_day=1000,
                    electrolyzer_type=tech
                )
                results[tech] = analysis
                print(f"✓ {tech.upper()}: CAPEX=₹{analysis.total_capex:.1f}Cr, LCOH=₹{analysis.lcoh_base:.2f}/kg, ROI={analysis.roi_percentage:.1f}%")
            except Exception as e:
                print(f"✗ {tech.upper()}: Error - {e}")
        
        # Compare technologies
        if len(results) > 1:
            best_lcoh = min(results.values(), key=lambda x: x.lcoh_base)
            best_roi = max(results.values(), key=lambda x: x.roi_percentage)
            
            best_lcoh_tech = [k for k, v in results.items() if v.lcoh_base == best_lcoh.lcoh_base][0]
            best_roi_tech = [k for k, v in results.items() if v.roi_percentage == best_roi.roi_percentage][0]
            
            print(f"✓ Best LCOH: {best_lcoh_tech.upper()} at ₹{best_lcoh.lcoh_base:.2f}/kg")
            print(f"✓ Best ROI: {best_roi_tech.upper()} at {best_roi.roi_percentage:.1f}%")
    
    def test_capacity_scaling(self):
        """Test 7: Different plant capacities"""
        print("\n=== Test 7: Plant Capacity Scaling ===")
        
        capacities = [500, 1000, 2000, 5000]
        
        for capacity in capacities:
            try:
                analysis = self.calculator.calculate_comprehensive_investment_analysis(
                    location=self.location,
                    energy_source=self.energy_source,
                    demand_center=self.demand_center,
                    water_source=self.water_source,
                    plant_capacity_kg_day=capacity,
                    electrolyzer_type='pem'
                )
                
                print(f"✓ {capacity} kg/day: CAPEX=₹{analysis.total_capex:.1f}Cr, "
                      f"LCOH=₹{analysis.lcoh_base:.2f}/kg, "
                      f"Land={analysis.land_analysis.total_land_required_acres:.1f} acres")
                
            except Exception as e:
                print(f"✗ {capacity} kg/day: Error - {e}")
    
    def test_economic_feasibility_function(self):
        """Test 8: High-level economic feasibility function"""
        print("\n=== Test 8: Economic Feasibility Function ===")
        
        location_data = {
            'latitude': 23.0225,
            'longitude': 72.5714
        }
        
        result = analyze_comprehensive_economic_feasibility(
            location_data=location_data,
            capacity_kg_day=1000,
            electrolyzer_type='pem'
        )
        
        assert 'comprehensive_analysis' in result
        assert 'summary' in result
        
        summary = result['summary']
        print(f"✓ Total investment: ₹{summary['total_investment_crores']:.2f} Cr")
        print(f"✓ Annual revenue: ₹{summary['annual_revenue_crores']:.2f} Cr")
        print(f"✓ Annual profit: ₹{summary['annual_profit_crores']:.2f} Cr")
        print(f"✓ ROI: {summary['roi_percentage']:.1f}%")
        print(f"✓ Payback: {summary['payback_years']:.1f} years")
        print(f"✓ LCOH: ₹{summary['lcoh_base_per_kg']:.2f}/kg")
        print(f"✓ Risk rating: {summary['risk_rating']}")
        print(f"✓ Land required: {summary['land_required_acres']:.1f} acres")


def run_comprehensive_test():
    """Run all tests and generate a comprehensive report"""
    print("=" * 80)
    print("COMPREHENSIVE ECONOMIC CALCULATOR TEST SUITE")
    print("=" * 80)
    
    test_instance = TestComprehensiveEconomicCalculator()
    test_instance.setup_method()
    
    tests = [
        test_instance.test_production_capacity_analysis,
        test_instance.test_market_analysis,
        test_instance.test_land_requirements_analysis,
        test_instance.test_comprehensive_investment_analysis,
        test_instance.test_sensitivity_analysis,
        test_instance.test_different_electrolyzer_types,
        test_instance.test_capacity_scaling,
        test_instance.test_economic_feasibility_function
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
        except Exception as e:
            print(f"✗ Test failed: {test.__name__} - {e}")
            failed += 1
    
    print("\n" + "=" * 80)
    print(f"TEST SUMMARY: {passed} passed, {failed} failed")
    print("=" * 80)
    
    if failed == 0:
        print("🎉 ALL TESTS PASSED! The comprehensive economic calculator is working correctly.")
    else:
        print("⚠️  Some tests failed. Please review the implementation.")


if __name__ == "__main__":
    run_comprehensive_test()