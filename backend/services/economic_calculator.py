import math
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum
import random
from models import LocationPoint, EnergySource, DemandCenter, WaterSource

class ProductionScenario(Enum):
    """Production scenarios for analysis"""
    CONSERVATIVE = "conservative"
    BASE = "base"
    OPTIMISTIC = "optimistic"

class ElectrolyzerType(Enum):
    """Types of electrolyzer technologies"""
    ALKALINE = "alkaline"
    PEM = "pem"
    SOLID_OXIDE = "solid_oxide"

class MarketSegment(Enum):
    """Hydrogen market segments"""
    INDUSTRIAL = "industrial"
    TRANSPORT = "transport"
    POWER_TO_GAS = "power_to_gas"
    EXPORT = "export"

@dataclass
class ProductionCapacityAnalysis:
    """Detailed production capacity analysis for different scenarios"""
    # Input Parameters
    available_electricity_kwh_day: float
    available_water_liters_day: float
    electrolyzer_efficiency: float
    electrolyzer_type: str
    
    # Production Scenarios
    conservative_production_kg_day: float
    base_production_kg_day: float
    optimistic_production_kg_day: float
    
    # Constraints Analysis
    electricity_constraint: bool
    water_constraint: bool
    equipment_constraint: bool
    
    # Resource Utilization
    electricity_utilization_percentage: float
    water_utilization_percentage: float
    equipment_utilization_percentage: float
    
    # Annual Projections
    annual_production_tonnes_conservative: float
    annual_production_tonnes_base: float
    annual_production_tonnes_optimistic: float

@dataclass
class MarketAnalysis:
    """Comprehensive market analysis for hydrogen demand"""
    # Local Demand by Industry
    refinery_demand_tonnes_year: float
    chemical_demand_tonnes_year: float
    steel_demand_tonnes_year: float
    fertilizer_demand_tonnes_year: float
    transport_demand_tonnes_year: float
    total_local_demand_tonnes_year: float
    
    # Market Pricing Analysis
    current_market_price_per_kg: float
    projected_price_per_kg_5_year: float
    projected_price_per_kg_10_year: float
    
    # Revenue Analysis by Price Points
    revenue_at_250_per_kg: float
    revenue_at_300_per_kg: float
    revenue_at_350_per_kg: float
    revenue_at_400_per_kg: float
    
    # Market Share Analysis
    achievable_market_share_percentage: float
    optimal_production_volume_tonnes: float
    market_growth_rate_annual: float

@dataclass
class LandRequirementsAnalysis:
    """Detailed land requirements analysis"""
    # Equipment Area (acres)
    electrolyzer_area: float
    storage_area: float
    compression_area: float
    utilities_area: float
    
    # Safety and Buffer Zones (acres)
    safety_zone_area: float
    buffer_zone_area: float
    
    # Operational Areas (acres)
    maintenance_area: float
    administration_area: float
    parking_roads_area: float
    
    # Future Expansion (acres)
    expansion_reserve_area: float
    
    # Total Requirements
    total_land_required_acres: float
    land_cost_per_acre: float
    total_land_cost: float

@dataclass
class DetailedInvestmentBreakdown:
    """Ultra-detailed investment breakdown for investors"""
    # Production Capacity Analysis
    production_analysis: ProductionCapacityAnalysis
    
    # Market Analysis
    market_analysis: MarketAnalysis
    
    # Land Requirements
    land_analysis: LandRequirementsAnalysis
    
    # CAPEX - Equipment Costs (₹ Crores)
    electrolyzer_stack_cost: float
    electrolyzer_power_supply: float
    electrolyzer_control_system: float
    compression_system: float
    storage_tanks: float
    purification_equipment: float
    safety_systems: float
    
    # CAPEX - Infrastructure (₹ Crores)
    plant_construction: float
    electrical_infrastructure: float
    water_treatment_plant: float
    hydrogen_pipeline_connection: float
    road_access_development: float
    utility_connections: float
    
    # CAPEX - Land & Permits (₹ Crores)
    land_acquisition: float
    environmental_clearance: float
    regulatory_permits: float
    
    # CAPEX - Project Development (₹ Crores)
    engineering_design: float
    project_management: float
    commissioning_testing: float
    contingency_reserve: float
    
    # OPEX - Production Costs (₹ Crores/year)
    electricity_costs: float
    water_costs: float
    raw_material_costs: float
    
    # OPEX - Operations (₹ Crores/year)
    skilled_operators: float
    maintenance_technicians: float
    engineering_staff: float
    administrative_staff: float
    
    # OPEX - Maintenance (₹ Crores/year)
    electrolyzer_maintenance: float
    equipment_replacement: float
    facility_maintenance: float
    
    # OPEX - Business (₹ Crores/year)
    insurance_costs: float
    transportation_logistics: float
    marketing_sales: float
    regulatory_compliance: float
    
    # Financial Analysis
    total_capex: float
    total_annual_opex: float
    
    # Production & Revenue (Base Scenario)
    daily_production_kg: float
    annual_production_tonnes: float
    hydrogen_selling_price_per_kg: float
    annual_revenue: float
    annual_profit: float
    
    # LCOH Analysis
    lcoh_conservative: float
    lcoh_base: float
    lcoh_optimistic: float
    
    # Investment Metrics
    roi_percentage: float
    payback_period_years: float
    npv_10_years: float
    irr_percentage: float
    debt_equity_ratio: float
    interest_coverage_ratio: float
    
    # Financial Projections (5-10 years)
    year_5_revenue: float
    year_5_profit: float
    year_10_revenue: float
    year_10_profit: float
    
    # Sensitivity Analysis
    sensitivity_electricity_price: Dict[str, float]
    sensitivity_hydrogen_price: Dict[str, float]
    sensitivity_capex: Dict[str, float]
    
    # Risk Assessment
    economic_risk_score: float
    regulatory_risk_score: float
    market_volatility_risk: float
    overall_risk_rating: str
    
    # Market Analysis
    market_demand_local_tonnes: float
    market_price_volatility: float
    competition_analysis: str

@dataclass
class LocationSpecificFactors:
    """Location-specific cost modifiers"""
    zone_type: str  # Industrial, SEZ, Rural, Coastal, Port
    power_grid_distance_km: float
    water_source_distance_km: float
    pipeline_distance_km: float
    transport_connectivity_score: float
    labor_availability_score: float
    regulatory_zone: str
    environmental_sensitivity: str

class ComprehensiveEconomicCalculator(DynamicMarketCalculator):
    """Comprehensive hydrogen plant economic analysis with all required features"""
    
    def __init__(self):
        # Real market costs (2025 prices in ₹)
        self.equipment_costs = {
            # Electrolyzer (per MW capacity) - More realistic costs
            'alkaline_electrolyzer_per_mw': 3_50_00_000,  # ₹3.5 Cr/MW (reduced)
            'pem_electrolyzer_per_mw': 4_50_00_000,       # ₹4.5 Cr/MW (reduced)
            'solid_oxide_per_mw': 6_00_00_000,            # ₹6 Cr/MW (reduced)
            
            # Power supply & control (% of electrolyzer cost)
            'power_supply_percentage': 12,  # Reduced from 15%
            'control_system_percentage': 6, # Reduced from 8%
            
            # Compression & Storage - More realistic
            'compressor_350bar_per_kg_day': 15_000,       # ₹15k per kg/day (reduced)
            'compressor_700bar_per_kg_day': 25_000,       # ₹25k per kg/day (reduced)
            'storage_tank_per_kg': 5_000,                 # ₹5k per kg storage (reduced)
            
            # Purification & Safety
            'purification_system_base': 50_00_000,        # ₹50 lakh base cost (reduced)
            'safety_systems_base': 30_00_000,             # ₹30 lakh base cost (reduced)
        }
        
        self.infrastructure_costs = {
            # Construction (per kg/day capacity) - More realistic
            'plant_building_per_kg_day': 8_000,           # ₹8k per kg/day (reduced)
            'electrical_infrastructure_per_mw': 25_00_000,  # ₹25 lakh per MW (reduced)
            'water_treatment_base': 1_50_00_000,          # ₹1.5 Cr base cost (reduced)
            
            # Connectivity costs
            'pipeline_connection_per_km': 10_00_000,      # ₹10 lakh per km (reduced)
            'road_development_per_km': 5_00_000,          # ₹5 lakh per km (reduced)
            'electrical_connection_per_km': 8_00_000,     # ₹8 lakh per km (reduced)
        }
        
        self.land_costs = {
            # Land acquisition (per acre)
            'Industrial Zone': 60_00_000,   # ₹60 lakh/acre
            'SEZ': 80_00_000,               # ₹80 lakh/acre  
            'Rural': 15_00_000,             # ₹15 lakh/acre
            'Coastal': 45_00_000,           # ₹45 lakh/acre
            'Port Area': 1_00_00_000,       # ₹1 Cr/acre
        }
        
        self.operational_costs = {
            # Electricity (₹/kWh by source)
            'grid_electricity': 4.2,         # ₹4.2/kWh (industrial rate)
            'solar_direct': 2.8,             # ₹2.8/kWh (direct solar)
            'wind_direct': 3.1,              # ₹3.1/kWh (direct wind)
            'hybrid_renewable': 2.9,         # ₹2.9/kWh (solar+wind)
            
            # Water costs (₹/liter)
            'municipal_water': 0.8,          # ₹0.8/liter
            'groundwater': 0.3,              # ₹0.3/liter
            'treated_wastewater': 0.5,       # ₹0.5/liter
            'desalinated_water': 1.2,        # ₹1.2/liter
            
            # Staffing (Annual salaries in ₹)
            'plant_manager': 18_00_000,      # ₹18 lakh/year
            'shift_operators': 8_00_000,     # ₹8 lakh/year each
            'maintenance_engineer': 12_00_000, # ₹12 lakh/year
            'technicians': 6_00_000,         # ₹6 lakh/year each
            'safety_officer': 10_00_000,     # ₹10 lakh/year
            'administrative': 5_00_000,      # ₹5 lakh/year each
        }
        
        # Production parameters by electrolyzer type
        self.production_efficiency = {
            'alkaline': {
                'efficiency': 0.65,                      # 65% electrical efficiency
                'kwh_per_kg_h2': 55,                     # kWh per kg H2
                'water_consumption_liters_per_kg': 10,   # 10L per kg H2
                'capacity_factor': 0.82,                 # 82% uptime
                'maintenance_frequency_hours': 8760,     # Annual maintenance
            },
            'pem': {
                'efficiency': 0.68,                      # 68% electrical efficiency  
                'kwh_per_kg_h2': 52,                     # kWh per kg H2
                'water_consumption_liters_per_kg': 9,    # 9L per kg H2
                'capacity_factor': 0.85,                 # 85% uptime
                'maintenance_frequency_hours': 4380,     # Semi-annual maintenance
            },
            'solid_oxide': {
                'efficiency': 0.75,                      # 75% electrical efficiency
                'kwh_per_kg_h2': 45,                     # kWh per kg H2
                'water_consumption_liters_per_kg': 8.5,  # 8.5L per kg H2
                'capacity_factor': 0.80,                 # 80% uptime (newer tech)
                'maintenance_frequency_hours': 2190,     # Quarterly maintenance
            }
        }
        
        # Market parameters (Gujarat 2025) - Dynamic pricing based on location
        self.market_data = {
            'hydrogen_price_industrial': self._calculate_regional_industrial_price(),
            'hydrogen_price_transport': self._calculate_regional_transport_price(),
            'hydrogen_price_export': self._calculate_export_price(),
            'price_escalation_annual': 0.06,             # 6% annual price increase
            'demand_growth_rate': self._calculate_regional_demand_growth(),
            
            # Industry-specific demand (Gujarat market estimates) - Regional variation
            'refinery_demand_mt_year': self._calculate_refinery_demand(),
            'chemical_demand_mt_year': self._calculate_chemical_demand(),
            'steel_demand_mt_year': self._calculate_steel_demand(),
            'fertilizer_demand_mt_year': self._calculate_fertilizer_demand(),
            'transport_demand_mt_year': self._calculate_transport_demand(),
        }
        
        # Land requirement factors (acres per kg/day capacity)
        self.land_requirements = {
            'electrolyzer_area_factor': 0.008,           # 0.008 acres per kg/day
            'storage_area_factor': 0.012,               # 0.012 acres per kg/day
            'compression_area_factor': 0.005,           # 0.005 acres per kg/day
            'utilities_area_factor': 0.006,             # 0.006 acres per kg/day
            'safety_zone_factor': 0.025,                # 0.025 acres per kg/day
            'buffer_zone_factor': 0.015,                # 0.015 acres per kg/day
            'operational_area_factor': 0.020,           # 0.020 acres per kg/day
            'expansion_reserve_factor': 0.030,          # 0.030 acres per kg/day
        }
        
        self.annual_operating_days = 330  # 90% uptime
    
    def calculate_dynamic_hydrogen_price(self, location: LocationPoint, demand_center: DemandCenter, 
                                       production_capacity_tonnes_year: float, 
                                       electricity_cost_kwh: float = 3.5) -> float:
        """Calculate dynamic hydrogen price based on location factors, primarily electricity cost"""
        
        # 1. Calculate electricity-based production cost (70-80% of total cost)
        electricity_kwh_per_kg = 55  # kWh per kg H2 (industry standard)
        electricity_cost_per_kg = electricity_cost_kwh * electricity_kwh_per_kg
        
        # 2. Add other production costs (water, maintenance, labor, etc.)
        other_costs_per_kg = 45  # Fixed costs for water, O&M, labor
        
        # 3. Base production cost
        base_production_cost = electricity_cost_per_kg + other_costs_per_kg
        
        # 4. Add operational margin (15-25% based on scale and risk)
        if production_capacity_tonnes_year > 5000:
            margin_percentage = 0.15  # Large scale efficiency
        elif production_capacity_tonnes_year > 1000:
            margin_percentage = 0.20  # Medium scale
        else:
            margin_percentage = 0.25  # Small scale premium
            
        cost_with_margin = base_production_cost * (1 + margin_percentage)
        
        # 5. Distance factor - transportation costs
        distance_to_demand = self._calculate_distance(location, demand_center.location)
        if distance_to_demand < 50:
            transport_cost = 5   # ₹5/kg for local delivery
        elif distance_to_demand < 100:
            transport_cost = 15  # ₹15/kg for medium distance
        else:
            transport_cost = 30  # ₹30/kg for long distance
            
        # 6. Market demand factor
        demand_intensity = getattr(demand_center, 'hydrogen_demand_mt_year', 1000)
        if demand_intensity > 10000:
            demand_premium = 10  # High demand area premium
        elif demand_intensity < 2000:
            demand_discount = -10  # Low demand area discount
        else:
            demand_premium = 0
            
        # Calculate final price
        final_price = cost_with_margin + transport_cost + demand_premium
        
        # Ensure price stays within market bounds (₹180-500/kg)
        return max(180, min(500, final_price))
        
    def calculate_production_capacity_analysis(self, 
                                          available_electricity_kwh_day: float,
                                          available_water_liters_day: float,
                                          plant_capacity_kg_day: int,
                                          electrolyzer_type: str = 'pem') -> ProductionCapacityAnalysis:
        """Calculate detailed production capacity analysis for different scenarios"""
        
        # Get electrolyzer parameters
        tech_params = self.production_efficiency[electrolyzer_type]
        
        # Calculate theoretical maximum production based on resources
        max_production_from_electricity = available_electricity_kwh_day / tech_params['kwh_per_kg_h2']
        max_production_from_water = available_water_liters_day / tech_params['water_consumption_liters_per_kg']
        
        # Equipment-based production (design capacity)
        equipment_max_production = plant_capacity_kg_day
        
        # Determine constraints
        electricity_constraint = max_production_from_electricity < equipment_max_production
        water_constraint = max_production_from_water < equipment_max_production
        equipment_constraint = equipment_max_production <= min(max_production_from_electricity, max_production_from_water)
        
        # Calculate actual constrained production
        actual_max_production = min(max_production_from_electricity, max_production_from_water, equipment_max_production)
        
        # Scenario-based production calculations
        conservative_production = actual_max_production * 0.75 * tech_params['capacity_factor'] * 0.9  # 75% capacity, 90% efficiency
        base_production = actual_max_production * 0.85 * tech_params['capacity_factor']  # 85% capacity, normal efficiency
        optimistic_production = actual_max_production * 0.95 * tech_params['capacity_factor'] * 1.05  # 95% capacity, 105% efficiency
        
        # Resource utilization calculations
        electricity_utilization = (base_production * tech_params['kwh_per_kg_h2']) / available_electricity_kwh_day * 100
        water_utilization = (base_production * tech_params['water_consumption_liters_per_kg']) / available_water_liters_day * 100
        equipment_utilization = base_production / equipment_max_production * 100
        
        # Annual projections (considering operating days)
        annual_conservative = conservative_production * self.annual_operating_days / 1000  # Convert to tonnes
        annual_base = base_production * self.annual_operating_days / 1000
        annual_optimistic = optimistic_production * self.annual_operating_days / 1000
        
        return ProductionCapacityAnalysis(
            available_electricity_kwh_day=available_electricity_kwh_day,
            available_water_liters_day=available_water_liters_day,
            electrolyzer_efficiency=tech_params['efficiency'],
            electrolyzer_type=electrolyzer_type,
            
            conservative_production_kg_day=conservative_production,
            base_production_kg_day=base_production,
            optimistic_production_kg_day=optimistic_production,
            
            electricity_constraint=electricity_constraint,
            water_constraint=water_constraint,
            equipment_constraint=equipment_constraint,
            
            electricity_utilization_percentage=electricity_utilization,
            water_utilization_percentage=water_utilization,
            equipment_utilization_percentage=equipment_utilization,
            
            annual_production_tonnes_conservative=annual_conservative,
            annual_production_tonnes_base=annual_base,
            annual_production_tonnes_optimistic=annual_optimistic
        )
    
    def calculate_market_analysis(self, 
                                location: LocationPoint,
                                demand_center: DemandCenter,
                                production_capacity_tonnes_year: float,
                                electricity_cost_kwh: float = 3.5) -> MarketAnalysis:
        """Calculate comprehensive market analysis"""
        
        # Calculate distance-based market accessibility
        distance_to_demand = self._calculate_distance(location, demand_center.location)
        
        # Local demand analysis by industry (Gujarat market)
        refinery_demand = self.market_data['refinery_demand_mt_year']
        chemical_demand = self.market_data['chemical_demand_mt_year']
        steel_demand = self.market_data['steel_demand_mt_year']
        fertilizer_demand = self.market_data['fertilizer_demand_mt_year']
        transport_demand = self.market_data['transport_demand_mt_year']
        
        total_local_demand = refinery_demand + chemical_demand + steel_demand + fertilizer_demand + transport_demand
        
        # Market pricing analysis
        current_price = self.market_data['hydrogen_price_industrial']
        price_escalation = self.market_data['price_escalation_annual']
        
        # 5-year and 10-year price projections
        price_5_year = current_price * ((1 + price_escalation) ** 5)
        price_10_year = current_price * ((1 + price_escalation) ** 10)
        
        # Revenue analysis at different price points - now dynamic
        revenue_250 = production_capacity_tonnes_year * 1000 * 250  # ₹250/kg
        revenue_300 = production_capacity_tonnes_year * 1000 * 300  # ₹300/kg
        # Dynamic pricing for 350 based on location efficiency and electricity costs
        dynamic_price_350 = self.calculate_dynamic_hydrogen_price(location, demand_center, production_capacity_tonnes_year, electricity_cost_kwh)
        revenue_350 = production_capacity_tonnes_year * 1000 * dynamic_price_350
        revenue_400 = production_capacity_tonnes_year * 1000 * 400  # ₹400/kg
        
        # Market share and optimal production analysis
        # Adjust for distance penalty (reduced market access with distance)
        distance_penalty = max(0, 1 - (distance_to_demand - 50) / 100) if distance_to_demand > 50 else 1
        achievable_market_share = min(0.25, production_capacity_tonnes_year / total_local_demand) * distance_penalty
        
        # Optimal production volume based on market absorption
        optimal_production = min(production_capacity_tonnes_year, total_local_demand * 0.15)  # Max 15% market share
        
        # Market growth rate
        growth_rate = self.market_data['demand_growth_rate']
        
        return MarketAnalysis(
            refinery_demand_tonnes_year=refinery_demand,
            chemical_demand_tonnes_year=chemical_demand,
            steel_demand_tonnes_year=steel_demand,
            fertilizer_demand_tonnes_year=fertilizer_demand,
            transport_demand_tonnes_year=transport_demand,
            total_local_demand_tonnes_year=total_local_demand,
            
            current_market_price_per_kg=current_price,
            projected_price_per_kg_5_year=price_5_year,
            projected_price_per_kg_10_year=price_10_year,
            
            revenue_at_250_per_kg=revenue_250,
            revenue_at_300_per_kg=revenue_300,
            revenue_at_350_per_kg=revenue_350,
            revenue_at_400_per_kg=revenue_400,
            
            achievable_market_share_percentage=achievable_market_share * 100,
            optimal_production_volume_tonnes=optimal_production,
            market_growth_rate_annual=growth_rate
        )
    
    def calculate_land_requirements_analysis(self, 
                                           plant_capacity_kg_day: int,
                                           location: LocationPoint) -> LandRequirementsAnalysis:
        """Calculate detailed land requirements with safety zones and expansion"""
        
        # Calculate individual area requirements
        electrolyzer_area = plant_capacity_kg_day * self.land_requirements['electrolyzer_area_factor']
        storage_area = plant_capacity_kg_day * self.land_requirements['storage_area_factor']
        compression_area = plant_capacity_kg_day * self.land_requirements['compression_area_factor']
        utilities_area = plant_capacity_kg_day * self.land_requirements['utilities_area_factor']
        
        # Safety and buffer zones
        safety_zone = plant_capacity_kg_day * self.land_requirements['safety_zone_factor']
        buffer_zone = plant_capacity_kg_day * self.land_requirements['buffer_zone_factor']
        
        # Operational areas
        operational_area = plant_capacity_kg_day * self.land_requirements['operational_area_factor']
        
        # Future expansion reserve (50% of current footprint)
        expansion_area = plant_capacity_kg_day * self.land_requirements['expansion_reserve_factor']
        
        # Total land requirement
        total_land = (electrolyzer_area + storage_area + compression_area + utilities_area + 
                     safety_zone + buffer_zone + operational_area + expansion_area)
        
        # Determine land type and cost
        land_type = self._determine_land_type(location)
        cost_per_acre = self.land_costs[land_type]
        total_cost = total_land * cost_per_acre
        
        return LandRequirementsAnalysis(
            electrolyzer_area=electrolyzer_area,
            storage_area=storage_area,
            compression_area=compression_area,
            utilities_area=utilities_area,
            
            safety_zone_area=safety_zone,
            buffer_zone_area=buffer_zone,
            
            maintenance_area=operational_area * 0.4,  # 40% of operational for maintenance
            administration_area=operational_area * 0.2,  # 20% for admin
            parking_roads_area=operational_area * 0.4,   # 40% for parking/roads
            
            expansion_reserve_area=expansion_area,
            
            total_land_required_acres=total_land,
            land_cost_per_acre=cost_per_acre,
            total_land_cost=total_cost
        )
    def calculate_comprehensive_investment_analysis(self, 
                                                  location: LocationPoint,
                                                  energy_source: EnergySource,
                                                  demand_center: DemandCenter,
                                                  water_source: WaterSource,
                                                  plant_capacity_kg_day: int = 1000,
                                                  electrolyzer_type: str = 'pem',
                                                  available_electricity_kwh_day: Optional[float] = None,
                                                  available_water_liters_day: Optional[float] = None) -> DetailedInvestmentBreakdown:
        """Calculate ultra-comprehensive investment analysis with all required features"""
        
        # Estimate resource availability if not provided
        if available_electricity_kwh_day is None:
            tech_params = self.production_efficiency[electrolyzer_type]
            available_electricity_kwh_day = plant_capacity_kg_day * tech_params['kwh_per_kg_h2'] * 1.2  # 20% buffer
        
        if available_water_liters_day is None:
            tech_params = self.production_efficiency[electrolyzer_type]
            available_water_liters_day = plant_capacity_kg_day * tech_params['water_consumption_liters_per_kg'] * 1.3  # 30% buffer
        
        # === 1. PRODUCTION CAPACITY ANALYSIS ===
        production_analysis = self.calculate_production_capacity_analysis(
            available_electricity_kwh_day, available_water_liters_day, plant_capacity_kg_day, electrolyzer_type
        )
        
        # === 2. MARKET ANALYSIS ===
        electricity_cost_kwh = getattr(energy_source, 'cost_per_kwh', 3.5) if energy_source else 3.5
        market_analysis = self.calculate_market_analysis(
            location, demand_center, production_analysis.annual_production_tonnes_base, electricity_cost_kwh
        )
        
        # === 3. LAND REQUIREMENTS ANALYSIS ===
        land_analysis = self.calculate_land_requirements_analysis(plant_capacity_kg_day, location)
        
        # === 4. DETAILED CAPEX CALCULATION ===
        capex_breakdown = self._calculate_detailed_capex(location, energy_source, water_source, plant_capacity_kg_day, electrolyzer_type)
        
        # === 5. DETAILED OPEX CALCULATION ===
        opex_breakdown = self._calculate_detailed_opex(location, energy_source, water_source, plant_capacity_kg_day, electrolyzer_type)
        
        # === 6. PRODUCTION & REVENUE ANALYSIS ===
        revenue_analysis = self._calculate_revenue_analysis(demand_center, production_analysis, market_analysis)
        
        # === 7. ADVANCED FINANCIAL METRICS ===
        financial_metrics = self._calculate_comprehensive_financial_metrics(capex_breakdown, opex_breakdown, revenue_analysis)
        
        # === 8. LCOH CALCULATIONS ===
        lcoh_analysis = self._calculate_lcoh_analysis(capex_breakdown, opex_breakdown, production_analysis)
        
        # === 9. SENSITIVITY ANALYSIS ===
        sensitivity_analysis = self._calculate_sensitivity_analysis(capex_breakdown, opex_breakdown, production_analysis)
        
        # === 10. RISK ASSESSMENT ===
        risk_assessment = self._calculate_risk_assessment(location, market_analysis, financial_metrics)
        
        # Combine all analyses into comprehensive breakdown
        return DetailedInvestmentBreakdown(
            # Core Analyses
            production_analysis=production_analysis,
            market_analysis=market_analysis,
            land_analysis=land_analysis,
            
            # Equipment Costs (₹ Crores)
            electrolyzer_stack_cost=capex_breakdown['electrolyzer_stack'] / 1_00_00_000,
            electrolyzer_power_supply=capex_breakdown['power_supply'] / 1_00_00_000,
            electrolyzer_control_system=capex_breakdown['control_system'] / 1_00_00_000,
            compression_system=capex_breakdown['compression'] / 1_00_00_000,
            storage_tanks=capex_breakdown['storage'] / 1_00_00_000,
            purification_equipment=capex_breakdown['purification'] / 1_00_00_000,
            safety_systems=capex_breakdown['safety'] / 1_00_00_000,
            
            # Infrastructure (₹ Crores)
            plant_construction=capex_breakdown['construction'] / 1_00_00_000,
            electrical_infrastructure=capex_breakdown['electrical'] / 1_00_00_000,
            water_treatment_plant=capex_breakdown['water_treatment'] / 1_00_00_000,
            hydrogen_pipeline_connection=capex_breakdown['pipeline'] / 1_00_00_000,
            road_access_development=capex_breakdown['road_access'] / 1_00_00_000,
            utility_connections=capex_breakdown['utilities'] / 1_00_00_000,
            
            # Land & Permits (₹ Crores)
            land_acquisition=capex_breakdown['land'] / 1_00_00_000,
            environmental_clearance=capex_breakdown['environmental'] / 1_00_00_000,
            regulatory_permits=capex_breakdown['permits'] / 1_00_00_000,
            
            # Project Development (₹ Crores)
            engineering_design=capex_breakdown['engineering'] / 1_00_00_000,
            project_management=capex_breakdown['project_mgmt'] / 1_00_00_000,
            commissioning_testing=capex_breakdown['commissioning'] / 1_00_00_000,
            contingency_reserve=capex_breakdown['contingency'] / 1_00_00_000,
            
            # OPEX - Production (₹ Crores/year)
            electricity_costs=opex_breakdown['electricity'] / 1_00_00_000,
            water_costs=opex_breakdown['water'] / 1_00_00_000,
            raw_material_costs=opex_breakdown['raw_materials'] / 1_00_00_000,
            
            # OPEX - Operations (₹ Crores/year)
            skilled_operators=opex_breakdown['operators'] / 1_00_00_000,
            maintenance_technicians=opex_breakdown['technicians'] / 1_00_00_000,
            engineering_staff=opex_breakdown['engineers'] / 1_00_00_000,
            administrative_staff=opex_breakdown['admin'] / 1_00_00_000,
            
            # OPEX - Maintenance (₹ Crores/year)
            electrolyzer_maintenance=opex_breakdown['electrolyzer_maint'] / 1_00_00_000,
            equipment_replacement=opex_breakdown['equipment_replace'] / 1_00_00_000,
            facility_maintenance=opex_breakdown['facility_maint'] / 1_00_00_000,
            
            # OPEX - Business (₹ Crores/year)
            insurance_costs=opex_breakdown['insurance'] / 1_00_00_000,
            transportation_logistics=opex_breakdown['transport'] / 1_00_00_000,
            marketing_sales=opex_breakdown['marketing'] / 1_00_00_000,
            regulatory_compliance=opex_breakdown['compliance'] / 1_00_00_000,
            
            # Financial Totals (₹ Crores)
            total_capex=sum(capex_breakdown.values()) / 1_00_00_000,
            total_annual_opex=sum(opex_breakdown.values()) / 1_00_00_000,
            
            # Production & Revenue (Base Scenario)
            daily_production_kg=production_analysis.base_production_kg_day,
            annual_production_tonnes=production_analysis.annual_production_tonnes_base,
            hydrogen_selling_price_per_kg=revenue_analysis['price_per_kg'],
            annual_revenue=revenue_analysis['annual_revenue'] / 1_00_00_000,
            annual_profit=revenue_analysis['annual_profit'] / 1_00_00_000,
            
            # LCOH Analysis (₹/kg)
            lcoh_conservative=lcoh_analysis['conservative'],
            lcoh_base=lcoh_analysis['base'],
            lcoh_optimistic=lcoh_analysis['optimistic'],
            
            # Financial Metrics
            roi_percentage=financial_metrics['roi'],
            payback_period_years=financial_metrics['payback'],
            npv_10_years=financial_metrics['npv'] / 1_00_00_000,
            irr_percentage=financial_metrics['irr'],
            debt_equity_ratio=financial_metrics['debt_equity'],
            interest_coverage_ratio=financial_metrics['interest_coverage'],
            
            # Financial Projections (₹ Crores)
            year_5_revenue=financial_metrics['year_5_revenue'] / 1_00_00_000,
            year_5_profit=financial_metrics['year_5_profit'] / 1_00_00_000,
            year_10_revenue=financial_metrics['year_10_revenue'] / 1_00_00_000,
            year_10_profit=financial_metrics['year_10_profit'] / 1_00_00_000,
            
            # Sensitivity Analysis
            sensitivity_electricity_price=sensitivity_analysis['electricity_price'],
            sensitivity_hydrogen_price=sensitivity_analysis['hydrogen_price'],
            sensitivity_capex=sensitivity_analysis['capex'],
            
            # Risk Assessment
            economic_risk_score=risk_assessment['economic_risk'],
            regulatory_risk_score=risk_assessment['regulatory_risk'],
            market_volatility_risk=risk_assessment['market_volatility'],
            overall_risk_rating=risk_assessment['overall_rating'],
            
            # Market Analysis (for backward compatibility)
            market_demand_local_tonnes=market_analysis.total_local_demand_tonnes_year,
            market_price_volatility=25.0,  # 25% estimated volatility
            competition_analysis="Moderate competition with established grey hydrogen producers"
        )
    def _calculate_detailed_capex(self, location: LocationPoint, energy_source: EnergySource, 
                                water_source: WaterSource, capacity_kg_day: int, electrolyzer_type: str) -> Dict:
        """Calculate detailed capital expenditure breakdown"""
        
        # Get technology-specific parameters
        tech_params = self.production_efficiency[electrolyzer_type]
        
        # 1. EQUIPMENT COSTS
        # Calculate required electrolyzer power
        required_power_mw = (capacity_kg_day * tech_params['kwh_per_kg_h2']) / (24 * tech_params['efficiency'])
        
        # Electrolyzer stack cost
        if electrolyzer_type == 'solid_oxide':
            electrolyzer_cost_per_mw = self.equipment_costs['solid_oxide_per_mw']
        else:
            electrolyzer_cost_per_mw = self.equipment_costs[f'{electrolyzer_type}_electrolyzer_per_mw']
        electrolyzer_stack = required_power_mw * electrolyzer_cost_per_mw
        
        # Power supply and control systems
        power_supply = electrolyzer_stack * (self.equipment_costs['power_supply_percentage'] / 100)
        control_system = electrolyzer_stack * (self.equipment_costs['control_system_percentage'] / 100)
        
        # Compression system (assume 350 bar for most applications)
        compression = capacity_kg_day * self.equipment_costs['compressor_350bar_per_kg_day']
        
        # Storage system (3 days storage capacity)
        storage_capacity_kg = capacity_kg_day * 3
        storage = storage_capacity_kg * self.equipment_costs['storage_tank_per_kg']
        
        # Purification and safety systems
        purification = self.equipment_costs['purification_system_base'] + (capacity_kg_day * 1000)  # Scale with capacity
        safety = self.equipment_costs['safety_systems_base'] + (capacity_kg_day * 800)  # Scale with capacity
        
        # 2. INFRASTRUCTURE COSTS
        # Plant construction
        construction = capacity_kg_day * self.infrastructure_costs['plant_building_per_kg_day']
        
        # Electrical infrastructure
        electrical = required_power_mw * self.infrastructure_costs['electrical_infrastructure_per_mw']
        
        # Water treatment plant
        water_treatment = self.infrastructure_costs['water_treatment_base'] + (capacity_kg_day * 2000)
        
        # Connection costs based on distances
        energy_distance = self._calculate_distance(location, energy_source.location)
        water_distance = 5.0  # Default water distance if no water source
        if water_source:
            water_distance = self._calculate_distance(location, water_source.location)
        
        # Pipeline connections
        pipeline_cost = 0
        if energy_distance > 1:  # If more than 1 km, need power transmission
            pipeline_cost += energy_distance * self.infrastructure_costs['electrical_connection_per_km']
        
        # Road access development
        road_access = min(energy_distance, 10) * self.infrastructure_costs['road_development_per_km']  # Max 10 km
        
        # Utility connections
        utilities = 50_00_000 + (capacity_kg_day * 500)  # Base + scaling cost
        
        # 3. LAND & PERMITS
        # Land acquisition (from land analysis)
        land_analysis = self.calculate_land_requirements_analysis(capacity_kg_day, location)
        land_cost = land_analysis.total_land_cost
        
        # Environmental clearance
        environmental = 25_00_000 + (capacity_kg_day * 100)  # Base + scaling
        
        # Regulatory permits
        permits = 15_00_000 + (capacity_kg_day * 75)  # Base + scaling
        
        # 4. PROJECT DEVELOPMENT
        # Calculate subtotal for percentage-based costs
        equipment_total = electrolyzer_stack + power_supply + control_system + compression + storage + purification + safety
        infrastructure_total = construction + electrical + water_treatment + pipeline_cost + road_access + utilities
        
        subtotal = equipment_total + infrastructure_total + land_cost + environmental + permits
        
        # Engineering and design (8% of subtotal)
        engineering = subtotal * 0.08
        
        # Project management (3% of subtotal)
        project_mgmt = subtotal * 0.03
        
        # Commissioning and testing (2% of subtotal)
        commissioning = subtotal * 0.02
        
        # Contingency reserve (10% of subtotal)
        contingency = subtotal * 0.10
        
        return {
            # Equipment
            'electrolyzer_stack': electrolyzer_stack,
            'power_supply': power_supply,
            'control_system': control_system,
            'compression': compression,
            'storage': storage,
            'purification': purification,
            'safety': safety,
            
            # Infrastructure
            'construction': construction,
            'electrical': electrical,
            'water_treatment': water_treatment,
            'pipeline': pipeline_cost,
            'road_access': road_access,
            'utilities': utilities,
            
            # Land & Permits
            'land': land_cost,
            'environmental': environmental,
            'permits': permits,
            
            # Project Development
            'engineering': engineering,
            'project_mgmt': project_mgmt,
            'commissioning': commissioning,
            'contingency': contingency
        }
    
    def _calculate_detailed_opex(self, location: LocationPoint, energy_source: EnergySource,
                               water_source: WaterSource, capacity_kg_day: int, electrolyzer_type: str) -> Dict:
        """Calculate detailed operational expenditure breakdown"""
        
        # Get technology parameters
        tech_params = self.production_efficiency[electrolyzer_type]
        
        # Annual production calculations
        annual_production_kg = capacity_kg_day * self.annual_operating_days * tech_params['capacity_factor']
        
        # 1. PRODUCTION COSTS
        # Electricity cost
        annual_electricity_kwh = annual_production_kg * tech_params['kwh_per_kg_h2']
        electricity_cost_per_kwh = self._get_electricity_cost(energy_source, location)
        electricity = annual_electricity_kwh * electricity_cost_per_kwh
        
        # Water cost
        annual_water_liters = annual_production_kg * tech_params['water_consumption_liters_per_kg']
        if water_source:
            water_cost_per_liter = getattr(water_source, 'extraction_cost', 0.3)
        else:
            water_cost_per_liter = 0.3  # Default cost
        water = annual_water_liters * water_cost_per_liter
        
        # Raw materials (catalysts, consumables)
        raw_materials = annual_production_kg * 2  # ₹2 per kg H2 for consumables
        
        # 2. PERSONNEL COSTS
        # Calculate required staff based on capacity
        operators_needed = max(3, math.ceil(capacity_kg_day / 500)) * 3  # 3 shifts
        technicians_needed = max(2, math.ceil(capacity_kg_day / 750))
        engineers_needed = max(1, math.ceil(capacity_kg_day / 1000))
        admin_needed = max(2, math.ceil(capacity_kg_day / 1000))
        
        # Annual staff costs
        operators = operators_needed * self.operational_costs['shift_operators']
        technicians = technicians_needed * self.operational_costs['technicians']
        engineers = engineers_needed * self.operational_costs['maintenance_engineer']
        admin = admin_needed * self.operational_costs['administrative']
        
        # 3. MAINTENANCE COSTS
        # Technology-specific maintenance
        if electrolyzer_type == 'alkaline':
            electrolyzer_maint = annual_production_kg * 8  # ₹8 per kg for alkaline maintenance
        elif electrolyzer_type == 'pem':
            electrolyzer_maint = annual_production_kg * 12  # ₹12 per kg for PEM maintenance
        else:  # solid_oxide
            electrolyzer_maint = annual_production_kg * 18  # ₹18 per kg for SOEC maintenance
        
        # Equipment replacement (2% of equipment CAPEX annually)
        capex_breakdown = self._calculate_detailed_capex(location, energy_source, water_source, capacity_kg_day, electrolyzer_type)
        equipment_capex = (capex_breakdown['electrolyzer_stack'] + capex_breakdown['compression'] + 
                          capex_breakdown['storage'] + capex_breakdown['purification'])
        equipment_replace = equipment_capex * 0.02
        
        # Facility maintenance (1.5% of infrastructure CAPEX annually)
        facility_capex = (capex_breakdown['construction'] + capex_breakdown['electrical'] + 
                         capex_breakdown['water_treatment'] + capex_breakdown['utilities'])
        facility_maint = facility_capex * 0.015
        
        # 4. BUSINESS COSTS
        # Insurance (0.5% of total CAPEX)
        total_capex = sum(capex_breakdown.values())
        insurance = total_capex * 0.005
        
        # Transportation and logistics
        transport = annual_production_kg * 5  # ₹5 per kg for delivery costs
        
        # Marketing and sales (1% of expected revenue)
        expected_revenue = annual_production_kg * 300  # Assume ₹300/kg
        marketing = expected_revenue * 0.01
        
        # Regulatory compliance
        compliance = 10_00_000 + (capacity_kg_day * 100)  # Base + scaling
        
        return {
            # Production
            'electricity': electricity,
            'water': water,
            'raw_materials': raw_materials,
            
            # Personnel
            'operators': operators,
            'technicians': technicians,
            'engineers': engineers,
            'admin': admin,
            
            # Maintenance
            'electrolyzer_maint': electrolyzer_maint,
            'equipment_replace': equipment_replace,
            'facility_maint': facility_maint,
            
            # Business
            'insurance': insurance,
            'transport': transport,
            'marketing': marketing,
            'compliance': compliance
        }
    def _calculate_revenue_analysis(self, demand_center: DemandCenter, 
                                  production_analysis: ProductionCapacityAnalysis,
                                  market_analysis: MarketAnalysis) -> Dict:
        """Calculate comprehensive revenue analysis"""
        
        # Use base production scenario for revenue calculations
        annual_production_kg = production_analysis.annual_production_tonnes_base * 1000
        
        # Dynamic pricing based on market conditions
        base_price = market_analysis.current_market_price_per_kg
        
        # Market demand adjustment
        demand_ratio = annual_production_kg / (demand_center.hydrogen_demand_mt_year * 1000)
        
        # Price adjustments based on market dynamics
        if demand_ratio < 0.1:  # Very small player
            price_premium = 1.15  # 15% premium for specialty supply
        elif demand_ratio < 0.3:  # Moderate player
            price_premium = 1.05  # 5% premium
        else:  # Large player
            price_premium = 0.95  # 5% discount for volume
        
        # Willingness to pay adjustment
        willingness_factor = 1 + (demand_center.willingness_to_pay / 100)
        
        final_price = base_price * price_premium * willingness_factor
        
        # Revenue calculations
        annual_revenue = annual_production_kg * final_price
        
        return {
            'price_per_kg': final_price,
            'annual_revenue': annual_revenue,
            'annual_profit': 0  # Will be calculated in financial metrics
        }
    
    def _calculate_comprehensive_financial_metrics(self, capex: Dict, opex: Dict, revenue: Dict) -> Dict:
        """Calculate comprehensive financial metrics including projections"""
        
        total_capex = sum(capex.values())
        total_opex = sum(opex.values())
        annual_revenue = revenue['annual_revenue']
        annual_profit = annual_revenue - total_opex
        
        # Basic metrics
        roi_percentage = (annual_profit / total_capex) * 100 if total_capex > 0 else 0
        payback_years = total_capex / annual_profit if annual_profit > 0 else float('inf')
        
        # NPV calculation (10 years, 12% discount rate)
        discount_rate = 0.12
        npv = -total_capex
        
        for year in range(1, 11):
            # Assume 3% annual revenue growth
            yearly_revenue = annual_revenue * ((1.03) ** year)
            yearly_opex = total_opex * ((1.02) ** year)  # 2% opex inflation
            yearly_profit = yearly_revenue - yearly_opex
            npv += yearly_profit / ((1 + discount_rate) ** year)
        
        # IRR calculation
        irr = self._calculate_irr(total_capex, annual_profit, 10)
        
        # Debt/Equity assumptions (70/30 split)
        debt_ratio = 0.7
        equity_ratio = 0.3
        debt_amount = total_capex * debt_ratio
        interest_rate = 0.10  # 10% interest on debt
        annual_interest = debt_amount * interest_rate
        
        # Interest coverage ratio
        interest_coverage = annual_profit / annual_interest if annual_interest > 0 else float('inf')
        
        # 5-year and 10-year projections
        year_5_revenue = annual_revenue * ((1.03) ** 5)
        year_5_opex = total_opex * ((1.02) ** 5)
        year_5_profit = year_5_revenue - year_5_opex
        
        year_10_revenue = annual_revenue * ((1.03) ** 10)
        year_10_opex = total_opex * ((1.02) ** 10)
        year_10_profit = year_10_revenue - year_10_opex
        
        return {
            'roi': roi_percentage,
            'payback': payback_years,
            'npv': npv,
            'irr': irr,
            'debt_equity': debt_ratio / equity_ratio,
            'interest_coverage': interest_coverage,
            'year_5_revenue': year_5_revenue,
            'year_5_profit': year_5_profit,
            'year_10_revenue': year_10_revenue,
            'year_10_profit': year_10_profit
        }
    
    def _calculate_lcoh_analysis(self, capex: Dict, opex: Dict, 
                               production_analysis: ProductionCapacityAnalysis) -> Dict:
        """Calculate Levelized Cost of Hydrogen (LCOH) for different scenarios"""
        
        total_capex = sum(capex.values())
        total_opex = sum(opex.values())
        
        # LCOH = (Annualized CAPEX + Annual OPEX) / Annual H2 Production
        # Annualized CAPEX = CAPEX * (discount_rate * (1+discount_rate)^n) / ((1+discount_rate)^n - 1)
        
        discount_rate = 0.12
        plant_life = 20  # years
        
        # Capital recovery factor
        crf = (discount_rate * ((1 + discount_rate) ** plant_life)) / (((1 + discount_rate) ** plant_life) - 1)
        annualized_capex = total_capex * crf
        
        # LCOH calculations for different scenarios
        conservative_production_kg = production_analysis.annual_production_tonnes_conservative * 1000
        base_production_kg = production_analysis.annual_production_tonnes_base * 1000
        optimistic_production_kg = production_analysis.annual_production_tonnes_optimistic * 1000
        
        lcoh_conservative = (annualized_capex + total_opex) / conservative_production_kg if conservative_production_kg > 0 else float('inf')
        lcoh_base = (annualized_capex + total_opex) / base_production_kg if base_production_kg > 0 else float('inf')
        lcoh_optimistic = (annualized_capex + total_opex) / optimistic_production_kg if optimistic_production_kg > 0 else float('inf')
        
        return {
            'conservative': lcoh_conservative,
            'base': lcoh_base,
            'optimistic': lcoh_optimistic
        }
    
    def _calculate_sensitivity_analysis(self, capex: Dict, opex: Dict, 
                                      production_analysis: ProductionCapacityAnalysis) -> Dict:
        """Calculate sensitivity analysis for key variables"""
        
        base_lcoh = self._calculate_lcoh_analysis(capex, opex, production_analysis)['base']
        base_production = production_analysis.annual_production_tonnes_base * 1000
        
        # Electricity price sensitivity (±20%)
        base_electricity_cost = opex['electricity']
        electricity_variations = {}
        
        for change in [-20, -10, 0, 10, 20]:
            modified_opex = opex.copy()
            modified_opex['electricity'] = base_electricity_cost * (1 + change/100)
            total_opex = sum(modified_opex.values())
            
            # Recalculate LCOH
            total_capex = sum(capex.values())
            discount_rate = 0.12
            plant_life = 20
            crf = (discount_rate * ((1 + discount_rate) ** plant_life)) / (((1 + discount_rate) ** plant_life) - 1)
            annualized_capex = total_capex * crf
            new_lcoh = (annualized_capex + total_opex) / base_production
            
            electricity_variations[f"{change:+d}%"] = new_lcoh
        
        # Hydrogen price sensitivity (impact on profitability)
        base_hydrogen_price = 300  # ₹300/kg
        hydrogen_price_variations = {}
        
        for change in [-20, -10, 0, 10, 20]:
            new_price = base_hydrogen_price * (1 + change/100)
            annual_revenue = base_production * new_price
            total_opex = sum(opex.values())
            annual_profit = annual_revenue - total_opex
            roi = (annual_profit / sum(capex.values())) * 100
            hydrogen_price_variations[f"{change:+d}%"] = roi
        
        # CAPEX sensitivity
        capex_variations = {}
        base_capex = sum(capex.values())
        
        for change in [-20, -10, 0, 10, 20]:
            new_capex = base_capex * (1 + change/100)
            discount_rate = 0.12
            plant_life = 20
            crf = (discount_rate * ((1 + discount_rate) ** plant_life)) / (((1 + discount_rate) ** plant_life) - 1)
            annualized_capex = new_capex * crf
            total_opex = sum(opex.values())
            new_lcoh = (annualized_capex + total_opex) / base_production
            capex_variations[f"{change:+d}%"] = new_lcoh
        
        return {
            'electricity_price': electricity_variations,
            'hydrogen_price': hydrogen_price_variations,
            'capex': capex_variations
        }
    
    def _calculate_risk_assessment(self, location: LocationPoint, market_analysis: MarketAnalysis,
                                 financial_metrics: Dict) -> Dict:
        """Calculate comprehensive risk assessment"""
        
        # Economic Risk Assessment (0-100 scale)
        economic_risk = 0
        
        # ROI-based risk
        roi = financial_metrics['roi']
        if roi < 10:
            economic_risk += 30
        elif roi < 15:
            economic_risk += 20
        elif roi < 20:
            economic_risk += 10
        
        # Payback period risk
        payback = financial_metrics['payback']
        if payback > 8:
            economic_risk += 25
        elif payback > 6:
            economic_risk += 15
        elif payback > 4:
            economic_risk += 5
        
        # Market demand risk
        if market_analysis.achievable_market_share_percentage < 5:
            economic_risk += 20
        elif market_analysis.achievable_market_share_percentage < 10:
            economic_risk += 10
        
        # Regulatory Risk Assessment
        regulatory_risk = 20  # Base regulatory risk for hydrogen sector
        
        # Location-based regulatory adjustments
        # Simplified assessment - would use real regulatory data
        if self._determine_land_type(location) == 'Industrial Zone':
            regulatory_risk -= 5  # Lower risk in industrial zones
        elif self._determine_land_type(location) == 'Rural':
            regulatory_risk += 10  # Higher risk in rural areas
        
        # Market Volatility Risk
        market_volatility = 25  # Base 25% volatility
        
        # Adjust based on market maturity
        if market_analysis.total_local_demand_tonnes_year > 100000:
            market_volatility -= 5  # More mature market
        elif market_analysis.total_local_demand_tonnes_year < 20000:
            market_volatility += 10  # Less mature market
        
        # Overall Risk Rating
        total_risk_score = (economic_risk * 0.5 + regulatory_risk * 0.3 + market_volatility * 0.2)
        
        if total_risk_score < 20:
            overall_rating = "Low Risk"
        elif total_risk_score < 40:
            overall_rating = "Moderate Risk"
        elif total_risk_score < 60:
            overall_rating = "High Risk"
        else:
            overall_rating = "Very High Risk"
        
        return {
            'economic_risk': economic_risk,
            'regulatory_risk': regulatory_risk,
            'market_volatility': market_volatility,
            'overall_rating': overall_rating
        }
    
    def _get_electricity_cost(self, energy_source: EnergySource, location: LocationPoint) -> float:
        """Get electricity cost based on source type and location"""
        base_cost = energy_source.cost_per_kwh
        
        # Distance penalty
        distance = self._calculate_distance(location, energy_source.location)
        distance_penalty = distance * 0.05  # ₹0.05 per km per kWh
        
        return base_cost + distance_penalty
    
    def _get_water_cost(self, source_type: str) -> float:
        """Get water cost based on source type"""
        if source_type.lower() in ['solar', 'wind']:
            return self.operational_costs['groundwater']  # Assume groundwater for remote renewables
        else:
            return self.operational_costs['municipal_water']  # Municipal water for grid connections
    def _calculate_distance(self, point1: LocationPoint, point2: LocationPoint) -> float:
        """Calculate distance using Haversine formula"""
        R = 6371  # Earth's radius in km
        
        lat1, lon1 = math.radians(point1.latitude), math.radians(point1.longitude)
        lat2, lon2 = math.radians(point2.latitude), math.radians(point2.longitude)
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        return R * c
    
    def _determine_land_type(self, location: LocationPoint) -> str:
        """Determine land type based on location (simplified)"""
        # This would ideally use GIS data
        # For now, using simplified logic based on coordinates
        
        # Near major cities (Ahmedabad, Surat, etc.) - industrial
        major_cities = [(23.0225, 72.5714), (21.1702, 72.8311)]  # Ahmedabad, Surat
        
        for city_lat, city_lon in major_cities:
            distance = self._calculate_distance(
                location, 
                LocationPoint(latitude=city_lat, longitude=city_lon)
            )
            if distance < 20:  # Within 20km of major city
                return 'Industrial Zone'
        
        # Coastal areas - agricultural
        if location.longitude > 72.5:  # Eastern Gujarat
            return 'Rural'
        
        # Default - barren (Kutch region)
        return 'Rural'
    
    def _calculate_irr(self, initial_investment: float, annual_cash_flow: float, years: int) -> float:
        """Calculate Internal Rate of Return (simplified)"""
        if annual_cash_flow <= 0:
            return -100
        
        # Binary search for IRR
        low, high = -0.5, 1.0
        
        for _ in range(100):  # Max iterations
            mid = (low + high) / 2
            npv = -initial_investment
            
            for year in range(1, years + 1):
                npv += annual_cash_flow / ((1 + mid) ** year)
            
            if abs(npv) < 1000:  # Close enough
                return mid * 100
            elif npv > 0:
                low = mid
            else:
                high = mid
        
        return mid * 100  # Return as percentage

# Backward compatibility - alias for existing code
InvestorGradeEconomicCalculator = ComprehensiveEconomicCalculator

# Enhanced analysis function for comprehensive economic feasibility
def analyze_comprehensive_economic_feasibility(location_data: dict, 
                                             energy_data: dict = None,
                                             demand_data: dict = None,
                                             water_data: dict = None,
                                             capacity_kg_day: int = 1000,
                                             electrolyzer_type: str = 'pem') -> dict:
    """Analyze comprehensive economic feasibility for a given location with all required features"""
    calculator = ComprehensiveEconomicCalculator()
    
    # Extract location data
    location = LocationPoint(
        latitude=location_data['latitude'],
        longitude=location_data['longitude']
    )
    
    # Create mock or use provided energy source data
    if energy_data:
        energy_source = EnergySource(**energy_data)
    else:
        # Mock data for demonstration
        energy_source = EnergySource(
            id="solar_1",
            name="Charanka Solar Park",
            location=LocationPoint(latitude=23.2, longitude=72.1),
            capacity_mw=345,
            cost_per_kwh=2.5,
            annual_generation_gwh=750,
            operator="Gujarat Energy Development Agency",
            type="Solar"
        )
    
    # Create mock or use provided demand center data
    if demand_data:
        demand_center = DemandCenter(**demand_data)
    else:
        demand_center = DemandCenter(
            id="refinery_1", 
            name="Jamnagar Refinery",
            location=LocationPoint(latitude=22.4, longitude=70.1),
            hydrogen_demand_mt_year=50000,
            current_hydrogen_source="Steam Methane Reforming",
            green_transition_potential="High",
            willingness_to_pay=15,
            type="Refinery"
        )
    
    # Create mock or use provided water source data
    if water_data:
        water_source = WaterSource(**water_data)
    else:
        water_source = WaterSource(
            id="narmada_1",
            name="Narmada Canal",
            location=LocationPoint(latitude=22.5, longitude=72.5),
            capacity_liters_day=10000000,
            quality_score=8.5,
            seasonal_availability="Perennial",
            extraction_cost=0.3,
            regulatory_clearance=True,
            type="Canal"
        )
    
    # Calculate comprehensive analysis
    analysis = calculator.calculate_comprehensive_investment_analysis(
        location=location,
        energy_source=energy_source,
        demand_center=demand_center,
        water_source=water_source,
        plant_capacity_kg_day=capacity_kg_day,
        electrolyzer_type=electrolyzer_type
    )
    
    return {
        'comprehensive_analysis': analysis,
        'summary': {
            'total_investment_crores': analysis.total_capex,
            'annual_revenue_crores': analysis.annual_revenue,
            'annual_profit_crores': analysis.annual_profit,
            'roi_percentage': analysis.roi_percentage,
            'payback_years': analysis.payback_period_years,
            'lcoh_base_per_kg': analysis.lcoh_base,
            'risk_rating': analysis.overall_risk_rating,
            'land_required_acres': analysis.land_analysis.total_land_required_acres
        }
    }

# Example usage function (kept for backward compatibility)
def analyze_economic_feasibility(location_data: dict) -> dict:
    """Analyze economic feasibility for a given location (simplified version)"""
    return analyze_comprehensive_economic_feasibility(location_data)


class DynamicMarketCalculator:
    """Helper class for dynamic market calculations"""
    
    def __init__(self):
        self.base_regional_multipliers = {
            'coastal': 1.1,    # Higher prices near ports (export potential)
            'industrial': 1.05, # Higher prices in industrial zones
            'rural': 0.9,      # Lower prices in rural areas
            'urban': 1.0       # Base price for urban areas
        }
    
    def _calculate_regional_industrial_price(self, location: LocationPoint = None) -> float:
        """Calculate region-specific industrial hydrogen price"""
        base_price = 280  # Base industrial price
        
        if location:
            # Adjust based on proximity to industrial clusters
            # This would normally use GIS data, but using simplified logic
            multiplier = 1.0
            if hasattr(location, 'latitude') and hasattr(location, 'longitude'):
                # Gujarat major industrial areas adjustment
                if 21.0 <= location.latitude <= 23.5:  # South-Central Gujarat
                    multiplier = 1.1  # Higher demand, higher price
                elif 23.5 <= location.latitude <= 24.5:  # North Gujarat
                    multiplier = 0.95  # Lower industrial density
            
            return base_price * multiplier
        
        return base_price
    
    def _calculate_regional_transport_price(self, location: LocationPoint = None) -> float:
        """Calculate region-specific transport hydrogen price"""
        base_price = 320
        
        if location:
            multiplier = 1.0
            # Higher prices near major highways and transport corridors
            if hasattr(location, 'latitude') and hasattr(location, 'longitude'):
                # Near major transport corridors
                if 22.0 <= location.latitude <= 23.0:  # Major highway corridor
                    multiplier = 1.05
            
            return base_price * multiplier
        
        return base_price
    
    def _calculate_export_price(self) -> float:
        """Calculate export hydrogen price"""
        # Export prices are typically higher due to port logistics
        return 350
    
    def _calculate_regional_demand_growth(self) -> float:
        """Calculate region-specific demand growth rate"""
        # Gujarat has aggressive hydrogen policy, higher growth expected
        base_growth = 0.25  # 25% base growth
        policy_boost = 0.05  # Additional 5% due to state policy support
        return base_growth + policy_boost
    
    def _calculate_refinery_demand(self) -> float:
        """Calculate regional refinery hydrogen demand"""
        # Gujarat has major refineries - Reliance, ONGC, etc.
        base_demand = 45000  # MT/year
        growth_factor = 1.2  # 20% growth expected
        return base_demand * growth_factor
    
    def _calculate_chemical_demand(self) -> float:
        """Calculate regional chemical industry hydrogen demand"""
        # Strong chemical industry in Gujarat
        base_demand = 28000  # MT/year
        growth_factor = 1.3  # 30% growth in chemicals
        return base_demand * growth_factor
    
    def _calculate_steel_demand(self) -> float:
        """Calculate regional steel industry hydrogen demand"""
        # Moderate steel industry in Gujarat
        base_demand = 12000  # MT/year
        growth_factor = 1.25  # 25% growth
        return base_demand * growth_factor
    
    def _calculate_fertilizer_demand(self) -> float:
        """Calculate regional fertilizer industry hydrogen demand"""
        # Significant fertilizer industry
        base_demand = 22000  # MT/year
        growth_factor = 1.15  # 15% growth
        return base_demand * growth_factor
    
    def _calculate_transport_demand(self) -> float:
        """Calculate regional transport hydrogen demand"""
        # Emerging transport sector
        base_demand = 3000  # MT/year currently low
        growth_factor = 2.5  # 150% growth expected
        return base_demand * growth_factor
    
    def _calculate_regional_industrial_price(self) -> float:
        """Calculate dynamic regional industrial hydrogen price"""
        # Base price considering regional factors
        base_price = 280  # ₹/kg base
        
        # Regional industrial density factor
        industrial_density_factor = 1.08  # Gujarat has high industrial density
        
        # Supply-demand balance
        supply_demand_factor = 1.12  # Current supply shortage
        
        # Infrastructure quality factor
        infrastructure_factor = 0.95  # Good infrastructure reduces costs
        
        return base_price * industrial_density_factor * supply_demand_factor * infrastructure_factor
    
    def _calculate_regional_transport_price(self) -> float:
        """Calculate dynamic regional transport hydrogen price"""
        base_price = 320  # ₹/kg base for transport
        
        # Early market premium
        early_market_factor = 1.15
        
        # Infrastructure readiness
        infra_readiness_factor = 0.92  # Good highway network
        
        return base_price * early_market_factor * infra_readiness_factor
    
    def _calculate_export_price(self) -> float:
        """Calculate dynamic export hydrogen price"""
        base_price = 380  # ₹/kg base for export
        
        # Port proximity factor (Gujarat has good ports)
        port_factor = 0.88
        
        # International competitiveness
        competitiveness_factor = 1.05
        
        return base_price * port_factor * competitiveness_factor
    
    def _calculate_regional_demand_growth(self) -> float:
        """Calculate regional hydrogen demand growth rate"""
        # Gujarat's industrial growth rate
        industrial_growth = 0.08  # 8% industrial growth
        
        # Policy support factor
        policy_factor = 1.5  # Strong policy support multiplier
        
        # Technology adoption rate
        tech_adoption = 0.15  # 15% base adoption rate
        
        return (industrial_growth + tech_adoption) * policy_factor
    
    def _calculate_refinery_demand(self) -> float:
        """Calculate regional refinery hydrogen demand"""
        # Large refinery sector in Gujarat
        base_demand = 45000  # MT/year
        growth_factor = 1.25  # 25% growth
        return base_demand * growth_factor
    
    def _calculate_chemical_demand(self) -> float:
        """Calculate regional chemical industry hydrogen demand"""
        # Significant chemical industry
        base_demand = 28000  # MT/year
        growth_factor = 1.18  # 18% growth
        return base_demand * growth_factor
    
    def _calculate_steel_demand(self) -> float:
        """Calculate regional steel industry hydrogen demand"""
        # Moderate steel industry
        base_demand = 12000  # MT/year
        growth_factor = 1.22  # 22% growth
