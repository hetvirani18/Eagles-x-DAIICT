"""
Dynamic H₂ Production Calculator
Calculates optimal production capacity based on available resources and market demand
"""
import math
from typing import Dict, Tuple, List
from dataclasses import dataclass

@dataclass
class ResourceAvailability:
    electricity_mw: float  # Available electricity in MW
    electricity_price_kwh: float  # Price per kWh in ₹
    water_supply_lph: float  # Water supply in liters per hour
    water_cost_per_liter: float  # Water cost in ₹
    land_available_acres: float  # Available land in acres
    land_price_per_acre_cr: float  # Land price in crores per acre

@dataclass
class MarketDemand:
    total_demand_kg_day: float  # Total H₂ demand in area (kg/day)
    current_price_per_kg: float  # Current market price ₹/kg
    industrial_buyers: List[Dict]  # List of potential buyers
    competition_supply_kg_day: float  # Existing competition supply

@dataclass
class ProductionScenario:
    capacity_kg_day: float
    annual_production_tonnes: float
    electricity_required_mw: float
    water_required_lph: float
    land_required_acres: float
    capex_crores: float
    opex_annual_crores: float
    revenue_annual_crores: float
    profit_annual_crores: float
    roi_percentage: float
    payback_years: float
    market_share_percentage: float
    demand_fulfillment_ratio: float

class DynamicProductionCalculator:
    """Calculate optimal H₂ production based on actual resource constraints and market demand"""
    
    def __init__(self):
        # H₂ production constants (real-world data)
        self.H2_ENERGY_REQUIREMENT_KWH_PER_KG = 55  # kWh/kg H₂ (including efficiency losses)
        self.WATER_REQUIREMENT_LITERS_PER_KG = 9  # Liters of water per kg H₂
        self.PLANT_UTILIZATION_FACTOR = 0.85  # 85% capacity utilization
        
        # Real-world cost data (₹ Crores)
        self.COST_DATA = {
            'electrolyzer_cost_per_mw': 4.5,  # ₹4.5Cr per MW electrolyzer capacity
            'bop_multiplier': 2.2,  # Balance of plant = 2.2x electrolyzer cost
            'land_cost_per_acre_base': 1.5,  # Base land cost ₹1.5Cr/acre (varies by location)
            'site_prep_cost_per_acre': 0.3,  # Site preparation ₹0.3Cr/acre
            'infrastructure_cost_per_mw': 1.8,  # Infrastructure ₹1.8Cr/MW
            'working_capital_percentage': 0.15,  # 15% of CAPEX as working capital
            
            # OPEX (Annual costs)
            'om_percentage_of_capex': 0.03,  # 3% of CAPEX for O&M
            'staff_cost_per_10mw_plant': 0.35,  # ₹0.35Cr/year for 10MW plant
            'insurance_percentage': 0.005,  # 0.5% of CAPEX
            'admin_overhead_percentage': 0.02,  # 2% of revenue
        }
    
    def calculate_resource_constrained_capacity(self, resources: ResourceAvailability) -> Dict:
        """Calculate maximum possible H₂ production based on available resources"""
        
        # Electricity constraint
        max_electricity_capacity_mw = resources.electricity_mw * 0.9  # 90% allocation for H₂
        max_h2_from_electricity = (max_electricity_capacity_mw * 1000 * 24 * self.PLANT_UTILIZATION_FACTOR) / self.H2_ENERGY_REQUIREMENT_KWH_PER_KG
        
        # Water constraint
        max_h2_from_water = (resources.water_supply_lph * 24 * self.PLANT_UTILIZATION_FACTOR) / self.WATER_REQUIREMENT_LITERS_PER_KG
        
        # Land constraint (rough estimate: 1 acre per 2MW capacity)
        max_capacity_from_land_mw = resources.land_available_acres * 2
        max_h2_from_land = (max_capacity_from_land_mw * 1000 * 24 * self.PLANT_UTILIZATION_FACTOR) / self.H2_ENERGY_REQUIREMENT_KWH_PER_KG
        
        # Limiting factor
        limiting_factor = min(max_h2_from_electricity, max_h2_from_water, max_h2_from_land)
        
        if limiting_factor == max_h2_from_electricity:
            constraint = "Electricity"
        elif limiting_factor == max_h2_from_water:
            constraint = "Water Supply"
        else:
            constraint = "Land Availability"
        
        return {
            'max_capacity_kg_day': round(limiting_factor, 1),
            'limiting_factor': constraint,
            'electricity_utilization_percent': min(100, (limiting_factor * self.H2_ENERGY_REQUIREMENT_KWH_PER_KG * 100) / (resources.electricity_mw * 1000 * 24 * self.PLANT_UTILIZATION_FACTOR)),
            'water_utilization_percent': min(100, (limiting_factor * self.WATER_REQUIREMENT_LITERS_PER_KG * 100) / (resources.water_supply_lph * 24 * self.PLANT_UTILIZATION_FACTOR)),
            'land_utilization_percent': min(100, (limiting_factor * self.H2_ENERGY_REQUIREMENT_KWH_PER_KG * 100) / (max_capacity_from_land_mw * 1000 * 24 * self.PLANT_UTILIZATION_FACTOR))
        }
    
    def calculate_market_optimal_capacity(self, market: MarketDemand, max_technical_capacity: float) -> Dict:
        """Calculate optimal capacity based on market demand and competition"""
        
        # Available market demand (unmet demand)
        unmet_demand = max(0, market.total_demand_kg_day - market.competition_supply_kg_day)
        
        # Market scenarios
        scenarios = []
        
        # Conservative: Capture 25% of unmet demand
        conservative_capacity = min(max_technical_capacity, unmet_demand * 0.25)
        scenarios.append({
            'scenario': 'Conservative',
            'capacity_kg_day': conservative_capacity,
            'market_share_target': 25,
            'risk_level': 'Low'
        })
        
        # Moderate: Capture 50% of unmet demand
        moderate_capacity = min(max_technical_capacity, unmet_demand * 0.50)
        scenarios.append({
            'scenario': 'Moderate',
            'capacity_kg_day': moderate_capacity,
            'market_share_target': 50,
            'risk_level': 'Medium'
        })
        
        # Aggressive: Capture 75% of unmet demand
        aggressive_capacity = min(max_technical_capacity, unmet_demand * 0.75)
        scenarios.append({
            'scenario': 'Aggressive',
            'capacity_kg_day': aggressive_capacity,
            'market_share_target': 75,
            'risk_level': 'High'
        })
        
        # Maximum technical capacity
        scenarios.append({
            'scenario': 'Maximum Technical',
            'capacity_kg_day': max_technical_capacity,
            'market_share_target': min(100, (max_technical_capacity / unmet_demand * 100) if unmet_demand > 0 else 0),
            'risk_level': 'Very High'
        })
        
        return {
            'unmet_demand_kg_day': unmet_demand,
            'scenarios': scenarios,
            'recommended_scenario': 'Moderate'  # Default recommendation
        }
    
    def calculate_detailed_costs(self, capacity_kg_day: float, resources: ResourceAvailability) -> Dict:
        """Calculate detailed CAPEX and OPEX based on actual capacity"""
        
        # Calculate required resources
        electricity_required_mw = (capacity_kg_day * self.H2_ENERGY_REQUIREMENT_KWH_PER_KG) / (24 * self.PLANT_UTILIZATION_FACTOR * 1000)
        water_required_lph = (capacity_kg_day * self.WATER_REQUIREMENT_LITERS_PER_KG) / (24 * self.PLANT_UTILIZATION_FACTOR)
        land_required_acres = max(2, electricity_required_mw / 2)  # Minimum 2 acres
        
        # CAPEX Calculation
        electrolyzer_cost = electricity_required_mw * self.COST_DATA['electrolyzer_cost_per_mw']
        bop_cost = electrolyzer_cost * (self.COST_DATA['bop_multiplier'] - 1)
        land_cost = land_required_acres * resources.land_price_per_acre_cr
        site_prep_cost = land_required_acres * self.COST_DATA['site_prep_cost_per_acre']
        infrastructure_cost = electricity_required_mw * self.COST_DATA['infrastructure_cost_per_mw']
        
        total_capex_before_wc = electrolyzer_cost + bop_cost + land_cost + site_prep_cost + infrastructure_cost
        working_capital = total_capex_before_wc * self.COST_DATA['working_capital_percentage']
        total_capex = total_capex_before_wc + working_capital
        
        # OPEX Calculation (Annual)
        electricity_cost_annual = (capacity_kg_day * 365 * self.PLANT_UTILIZATION_FACTOR * 
                                 self.H2_ENERGY_REQUIREMENT_KWH_PER_KG * resources.electricity_price_kwh) / 10_000_000  # Convert to crores
        
        water_cost_annual = (capacity_kg_day * 365 * self.PLANT_UTILIZATION_FACTOR * 
                           self.WATER_REQUIREMENT_LITERS_PER_KG * resources.water_cost_per_liter) / 10_000_000
        
        om_cost_annual = total_capex * self.COST_DATA['om_percentage_of_capex']
        staff_cost_annual = (electricity_required_mw / 10) * self.COST_DATA['staff_cost_per_10mw_plant']
        insurance_cost_annual = total_capex * self.COST_DATA['insurance_percentage']
        
        total_opex_annual = electricity_cost_annual + water_cost_annual + om_cost_annual + staff_cost_annual + insurance_cost_annual
        
        return {
            'capacity_kg_day': capacity_kg_day,
            'electricity_required_mw': round(electricity_required_mw, 2),
            'water_required_lph': round(water_required_lph, 1),
            'land_required_acres': round(land_required_acres, 1),
            
            # CAPEX Breakdown
            'capex_breakdown': {
                'electrolyzer_cost_cr': round(electrolyzer_cost, 2),
                'balance_of_plant_cr': round(bop_cost, 2),
                'land_acquisition_cr': round(land_cost, 2),
                'site_preparation_cr': round(site_prep_cost, 2),
                'infrastructure_cr': round(infrastructure_cost, 2),
                'working_capital_cr': round(working_capital, 2),
                'total_capex_cr': round(total_capex, 2)
            },
            
            # OPEX Breakdown
            'opex_breakdown_annual': {
                'electricity_cost_cr': round(electricity_cost_annual, 2),
                'water_cost_cr': round(water_cost_annual, 2),
                'om_cost_cr': round(om_cost_annual, 2),
                'staff_cost_cr': round(staff_cost_annual, 2),
                'insurance_cost_cr': round(insurance_cost_annual, 2),
                'total_opex_annual_cr': round(total_opex_annual, 2)
            }
        }
    
    def calculate_production_scenario(self, capacity_kg_day: float, resources: ResourceAvailability, 
                                    market: MarketDemand) -> ProductionScenario:
        """Calculate complete production scenario with financials"""
        
        cost_analysis = self.calculate_detailed_costs(capacity_kg_day, resources)
        
        # Revenue calculation
        annual_production_tonnes = capacity_kg_day * 365 * self.PLANT_UTILIZATION_FACTOR / 1000
        annual_revenue_cr = annual_production_tonnes * 1000 * market.current_price_per_kg / 10_000_000
        
        # Admin overhead
        admin_cost_cr = annual_revenue_cr * self.COST_DATA['admin_overhead_percentage']
        total_opex_cr = cost_analysis['opex_breakdown_annual']['total_opex_annual_cr'] + admin_cost_cr
        
        # Profit and returns
        annual_profit_cr = annual_revenue_cr - total_opex_cr
        roi_percentage = (annual_profit_cr / cost_analysis['capex_breakdown']['total_capex_cr']) * 100
        payback_years = cost_analysis['capex_breakdown']['total_capex_cr'] / annual_profit_cr if annual_profit_cr > 0 else float('inf')
        
        # Market analysis
        market_share = (capacity_kg_day / market.total_demand_kg_day * 100) if market.total_demand_kg_day > 0 else 0
        demand_fulfillment = min(1.0, capacity_kg_day / max(1, market.total_demand_kg_day - market.competition_supply_kg_day))
        
        return ProductionScenario(
            capacity_kg_day=capacity_kg_day,
            annual_production_tonnes=round(annual_production_tonnes, 1),
            electricity_required_mw=cost_analysis['electricity_required_mw'],
            water_required_lph=cost_analysis['water_required_lph'],
            land_required_acres=cost_analysis['land_required_acres'],
            capex_crores=cost_analysis['capex_breakdown']['total_capex_cr'],
            opex_annual_crores=round(total_opex_cr, 2),
            revenue_annual_crores=round(annual_revenue_cr, 2),
            profit_annual_crores=round(annual_profit_cr, 2),
            roi_percentage=round(roi_percentage, 1),
            payback_years=round(payback_years, 1),
            market_share_percentage=round(market_share, 1),
            demand_fulfillment_ratio=round(demand_fulfillment, 2)
        )
    
    def run_comprehensive_analysis(self, resources: ResourceAvailability, market: MarketDemand) -> Dict:
        """Run complete analysis to find optimal production capacity"""
        
        # Step 1: Calculate resource constraints
        resource_analysis = self.calculate_resource_constrained_capacity(resources)
        max_capacity = resource_analysis['max_capacity_kg_day']
        
        # Step 2: Calculate market-optimal scenarios
        market_analysis = self.calculate_market_optimal_capacity(market, max_capacity)
        
        # Step 3: Calculate detailed scenarios
        scenarios = []
        for scenario_data in market_analysis['scenarios']:
            if scenario_data['capacity_kg_day'] > 0:
                scenario = self.calculate_production_scenario(
                    scenario_data['capacity_kg_day'], resources, market
                )
                scenarios.append({
                    'name': scenario_data['scenario'],
                    'risk_level': scenario_data['risk_level'],
                    'scenario': scenario
                })
        
        # Step 4: Recommend best scenario
        best_scenario = None
        best_score = -1
        
        for scenario_data in scenarios:
            scenario = scenario_data['scenario']
            # Scoring: ROI + Market fit - Risk penalty
            risk_penalty = {'Low': 0, 'Medium': 5, 'High': 10, 'Very High': 20}[scenario_data['risk_level']]
            score = scenario.roi_percentage + (scenario.demand_fulfillment_ratio * 20) - risk_penalty
            
            if score > best_score and scenario.roi_percentage > 10:  # Minimum 10% ROI
                best_score = score
                best_scenario = scenario_data
        
        return {
            'resource_constraints': resource_analysis,
            'market_analysis': market_analysis,
            'scenarios': scenarios,
            'recommended_scenario': best_scenario,
            'summary': {
                'max_technical_capacity_kg_day': max_capacity,
                'limiting_factor': resource_analysis['limiting_factor'],
                'unmet_market_demand_kg_day': market_analysis['unmet_demand_kg_day'],
                'recommended_capacity_kg_day': best_scenario['scenario'].capacity_kg_day if best_scenario else 0,
                'recommended_investment_cr': best_scenario['scenario'].capex_crores if best_scenario else 0
            }
        }


def analyze_location_production_potential(electricity_mw: float, electricity_price: float,
                                        water_supply_lph: float, total_demand_kg_day: float,
                                        land_available_acres: float = 10,
                                        land_price_per_acre_cr: float = 1.5) -> Dict:
    """Convenience function to analyze a location's H₂ production potential"""
    
    resources = ResourceAvailability(
        electricity_mw=electricity_mw,
        electricity_price_kwh=electricity_price,
        water_supply_lph=water_supply_lph,
        water_cost_per_liter=0.01,  # ₹0.01 per liter
        land_available_acres=land_available_acres,
        land_price_per_acre_cr=land_price_per_acre_cr
    )
    
    # Dynamic pricing based on electricity cost and market conditions
    base_price = 180  # Base production cost floor
    electricity_cost_factor = electricity_price * 55  # 55 kWh per kg H2
    margin_factor = 1.18  # 18% base margin
    
    # Market scale adjustment
    if total_demand_kg_day > 10000:
        scale_factor = 0.95  # 5% discount for large scale
    elif total_demand_kg_day < 2000:
        scale_factor = 1.08  # 8% premium for small scale
    else:
        scale_factor = 1.0
    
    # Competition adjustment
    competition_factor = 1.12 if total_demand_kg_day > 5000 else 1.05
    
    dynamic_price = max(base_price, (electricity_cost_factor + 50) * margin_factor * scale_factor * competition_factor)
    dynamic_price = min(480, dynamic_price)  # Cap at reasonable maximum
    
    market = MarketDemand(
        total_demand_kg_day=total_demand_kg_day,
        current_price_per_kg=dynamic_price,  # Dynamic pricing based on local conditions
        industrial_buyers=[],
        competition_supply_kg_day=total_demand_kg_day * 0.3  # Assume 30% existing supply
    )
    
    calculator = DynamicProductionCalculator()
    return calculator.run_comprehensive_analysis(resources, market)
