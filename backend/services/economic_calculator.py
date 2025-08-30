import math
from typing import Dict, List, Tuple
from dataclasses import dataclass
from models import LocationPoint, EnergySource, DemandCenter, WaterSource

@dataclass
class DetailedInvestmentBreakdown:
    """Ultra-detailed investment breakdown for investors"""
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
    
    # Production & Revenue
    daily_production_kg: float
    annual_production_tonnes: float
    hydrogen_selling_price_per_kg: float
    annual_revenue: float
    annual_profit: float
    
    # Investment Metrics
    roi_percentage: float
    payback_period_years: float
    npv_10_years: float
    irr_percentage: float
    debt_equity_ratio: float
    interest_coverage_ratio: float
    
    # Market Analysis
    market_demand_local_tonnes: float
    market_price_volatility: float
    competition_analysis: str
    regulatory_risk_score: float

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

class InvestorGradeEconomicCalculator:
    def __init__(self):
        # Real market costs (2025 prices in ₹)
        self.equipment_costs = {
            # Electrolyzer (per MW capacity)
            'alkaline_electrolyzer_per_mw': 6_50_00_000,  # ₹6.5 Cr/MW
            'pem_electrolyzer_per_mw': 8_50_00_000,       # ₹8.5 Cr/MW (higher efficiency)
            'solid_oxide_per_mw': 12_00_00_000,           # ₹12 Cr/MW (emerging tech)
            
            # Power supply & control (% of electrolyzer cost)
            'power_supply_percentage': 15,
            'control_system_percentage': 8,
            
            # Compression & Storage
            'compressor_350bar_per_kg_day': 25_000,       # ₹25k per kg/day capacity
            'compressor_700bar_per_kg_day': 45_000,       # ₹45k per kg/day capacity
            'storage_tank_per_kg': 8_000,                 # ₹8k per kg storage
            
            # Purification & Safety
            'purification_system_base': 1_20_00_000,      # ₹1.2 Cr base cost
            'safety_systems_base': 80_00_000,             # ₹80 lakh base cost
        }
        
        self.infrastructure_costs = {
            # Construction (per kg/day capacity)
            'plant_building_per_kg_day': 12_000,          # ₹12k per kg/day
            'electrical_infrastructure_per_mw': 35_00_000,  # ₹35 lakh per MW
            'water_treatment_base': 2_50_00_000,          # ₹2.5 Cr base cost
            
            # Connectivity costs
            'pipeline_connection_per_km': 15_00_000,      # ₹15 lakh per km
            'road_development_per_km': 8_00_000,          # ₹8 lakh per km
            'electrical_connection_per_km': 12_00_000,    # ₹12 lakh per km
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
        
        # Production parameters
        self.production_efficiency = {
            'electrolyzer_efficiency': 0.68,              # 68% electrical efficiency
            'kwh_per_kg_h2': 52,                         # kWh per kg H2 (efficient)
            'water_consumption_liters_per_kg': 9,        # 9L per kg H2
            'capacity_factor': 0.85,                     # 85% uptime
        }
        
        # Market parameters (Gujarat 2025)
        self.market_data = {
            'hydrogen_price_industrial': 280,            # ₹280/kg (industrial)
            'hydrogen_price_transport': 350,             # ₹350/kg (transport)
            'hydrogen_price_export': 320,                # ₹320/kg (export)
            'price_escalation_annual': 0.06,             # 6% annual price increase
            'demand_growth_rate': 0.25,                  # 25% annual demand growth
        }
        self.annual_operating_days = 330  # 90% uptime
        
    
    def calculate_detailed_investment_analysis(self, 
                                             location: LocationPoint,
                                             energy_source: EnergySource,
                                             demand_center: DemandCenter,
                                             water_source: WaterSource,
                                             plant_capacity_kg_day: int = 1000,
                                             electrolyzer_type: str = 'pem') -> DetailedInvestmentBreakdown:
        """Calculate ultra-detailed investment analysis for investors"""
        
        # Determine location-specific factors
        location_factors = self._analyze_location_factors(location, energy_source, water_source)
        
        # === DETAILED CAPEX CALCULATION ===
        capex_breakdown = self._calculate_detailed_capex(location_factors, plant_capacity_kg_day, electrolyzer_type)
        
        # === DETAILED OPEX CALCULATION ===
        opex_breakdown = self._calculate_detailed_opex(location_factors, energy_source, plant_capacity_kg_day)
        
        # === PRODUCTION & REVENUE ANALYSIS ===
        production_analysis = self._calculate_production_metrics(plant_capacity_kg_day, demand_center)
        
        # === ADVANCED FINANCIAL METRICS ===
        financial_metrics = self._calculate_investor_metrics(capex_breakdown, opex_breakdown, production_analysis)
        
        # === MARKET & RISK ANALYSIS ===
        market_analysis = self._analyze_market_conditions(location, demand_center)
        
        # Combine all analyses
        return DetailedInvestmentBreakdown(
            # Equipment Costs
            electrolyzer_stack_cost=capex_breakdown['electrolyzer_stack'] / 1_00_00_000,
            electrolyzer_power_supply=capex_breakdown['power_supply'] / 1_00_00_000,
            electrolyzer_control_system=capex_breakdown['control_system'] / 1_00_00_000,
            compression_system=capex_breakdown['compression'] / 1_00_00_000,
            storage_tanks=capex_breakdown['storage'] / 1_00_00_000,
            purification_equipment=capex_breakdown['purification'] / 1_00_00_000,
            safety_systems=capex_breakdown['safety'] / 1_00_00_000,
            
            # Infrastructure
            plant_construction=capex_breakdown['construction'] / 1_00_00_000,
            electrical_infrastructure=capex_breakdown['electrical'] / 1_00_00_000,
            water_treatment_plant=capex_breakdown['water_treatment'] / 1_00_00_000,
            hydrogen_pipeline_connection=capex_breakdown['pipeline'] / 1_00_00_000,
            road_access_development=capex_breakdown['road_access'] / 1_00_00_000,
            utility_connections=capex_breakdown['utilities'] / 1_00_00_000,
            
            # Land & Permits
            land_acquisition=capex_breakdown['land'] / 1_00_00_000,
            environmental_clearance=capex_breakdown['environmental'] / 1_00_00_000,
            regulatory_permits=capex_breakdown['permits'] / 1_00_00_000,
            
            # Project Development
            engineering_design=capex_breakdown['engineering'] / 1_00_00_000,
            project_management=capex_breakdown['project_mgmt'] / 1_00_00_000,
            commissioning_testing=capex_breakdown['commissioning'] / 1_00_00_000,
            contingency_reserve=capex_breakdown['contingency'] / 1_00_00_000,
            
            # OPEX - Production
            electricity_costs=opex_breakdown['electricity'] / 1_00_00_000,
            water_costs=opex_breakdown['water'] / 1_00_00_000,
            raw_material_costs=opex_breakdown['raw_materials'] / 1_00_00_000,
            
            # OPEX - Operations
            skilled_operators=opex_breakdown['operators'] / 1_00_00_000,
            maintenance_technicians=opex_breakdown['technicians'] / 1_00_00_000,
            engineering_staff=opex_breakdown['engineers'] / 1_00_00_000,
            administrative_staff=opex_breakdown['admin'] / 1_00_00_000,
            
            # OPEX - Maintenance
            electrolyzer_maintenance=opex_breakdown['electrolyzer_maint'] / 1_00_00_000,
            equipment_replacement=opex_breakdown['equipment_replace'] / 1_00_00_000,
            facility_maintenance=opex_breakdown['facility_maint'] / 1_00_00_000,
            
            # OPEX - Business
            insurance_costs=opex_breakdown['insurance'] / 1_00_00_000,
            transportation_logistics=opex_breakdown['transport'] / 1_00_00_000,
            marketing_sales=opex_breakdown['marketing'] / 1_00_00_000,
            regulatory_compliance=opex_breakdown['compliance'] / 1_00_00_000,
            
            # Totals
            total_capex=sum(capex_breakdown.values()) / 1_00_00_000,
            total_annual_opex=sum(opex_breakdown.values()) / 1_00_00_000,
            
            # Production & Revenue
            daily_production_kg=production_analysis['daily_kg'],
            annual_production_tonnes=production_analysis['annual_tonnes'],
            hydrogen_selling_price_per_kg=production_analysis['selling_price'],
            annual_revenue=production_analysis['annual_revenue'] / 1_00_00_000,
            annual_profit=production_analysis['annual_profit'] / 1_00_00_000,
            
            # Financial Metrics
            roi_percentage=financial_metrics['roi'],
            payback_period_years=financial_metrics['payback'],
            npv_10_years=financial_metrics['npv'] / 1_00_00_000,
            irr_percentage=financial_metrics['irr'],
            debt_equity_ratio=financial_metrics['debt_equity'],
            interest_coverage_ratio=financial_metrics['interest_coverage'],
            
            # Market Analysis
            market_demand_local_tonnes=market_analysis['local_demand'],
            market_price_volatility=market_analysis['price_volatility'],
            competition_analysis=market_analysis['competition'],
            regulatory_risk_score=market_analysis['regulatory_risk']
        )
    
    def _calculate_capital_costs(self, location: LocationPoint, energy_source: EnergySource, 
                               water_source: WaterSource, capacity_kg_day: int) -> Dict:
        """Calculate all capital expenditure costs"""
        
        # 1. Electrolyzer Cost
        required_power_mw = (capacity_kg_day * self.electricity_requirement_kwh_per_kg_h2) / (24 * self.plant_efficiency)
        electrolyzer_cost = required_power_mw * self.base_electrolyzer_cost_per_mw
        
        # 2. Plant Construction Cost
        construction_cost = capacity_kg_day * self.base_construction_cost_per_kg_day
        
        # 3. Infrastructure Cost (based on distances)
        energy_distance = self._calculate_distance(location, energy_source.location)
        water_distance = self._calculate_distance(location, water_source.location)
        
        # Power line cost: ₹50 lakhs per km
        power_line_cost = energy_distance * 50_00_000 if energy_distance > 1 else 0
        
        # Water pipeline cost: ₹20 lakhs per km
        water_pipeline_cost = water_distance * 20_00_000 if water_distance > 0.5 else 0
        
        # Storage and handling: 15% of plant cost
        storage_cost = construction_cost * 0.15
        
        infrastructure_cost = power_line_cost + water_pipeline_cost + storage_cost
        
        # 4. Land Acquisition Cost
        required_acres = max(5, capacity_kg_day / 200)  # Minimum 5 acres, +1 acre per 200 kg/day
        land_type = self._determine_land_type(location)
        land_cost = required_acres * self.land_cost_per_acre[land_type]
        
        # 5. Total CAPEX
        total_capex = electrolyzer_cost + construction_cost + infrastructure_cost + land_cost
        
        return {
            'electrolyzer': electrolyzer_cost,
            'construction': construction_cost,
            'infrastructure': infrastructure_cost,
            'land': land_cost,
            'total': total_capex
        }
    
    def _calculate_operating_costs(self, location: LocationPoint, energy_source: EnergySource,
                                 demand_center: DemandCenter, water_source: WaterSource,
                                 capacity_kg_day: int) -> Dict:
        """Calculate annual operating costs"""
        
        annual_production_kg = capacity_kg_day * self.annual_operating_days
        
        # 1. Electricity Cost
        annual_electricity_kwh = annual_production_kg * self.electricity_requirement_kwh_per_kg_h2
        
        # Dynamic electricity pricing based on source type and distance
        base_electricity_cost = energy_source.cost_per_kwh
        distance_penalty = self._calculate_distance(location, energy_source.location) * 0.1  # ₹0.1 per km
        electricity_cost_per_kwh = base_electricity_cost + distance_penalty
        
        electricity_cost_annual = annual_electricity_kwh * electricity_cost_per_kwh
        
        # 2. Water Cost
        annual_water_liters = annual_production_kg * self.water_requirement_liters_per_kg_h2
        water_cost_per_liter = getattr(water_source, 'extraction_cost', 0.5)  # Default ₹0.5/L
        water_distance = self._calculate_distance(location, water_source.location)
        
        # Add transportation cost for water if distance > 2km
        if water_distance > 2:
            water_transport_cost = water_distance * 0.2  # ₹0.2 per L per km
            water_cost_per_liter += water_transport_cost
        
        water_cost_annual = annual_water_liters * water_cost_per_liter
        
        # 3. Labor Cost
        # Base staff: 1 operator per 500 kg/day + supervisors + maintenance
        operators_needed = max(2, math.ceil(capacity_kg_day / 500))
        supervisors_needed = max(1, math.ceil(operators_needed / 3))
        maintenance_staff = max(1, math.ceil(capacity_kg_day / 1000))
        
        # Salary costs (annual)
        operator_salary = 6_00_000  # ₹6 lakhs/year
        supervisor_salary = 12_00_000  # ₹12 lakhs/year
        maintenance_salary = 8_00_000  # ₹8 lakhs/year
        
        labor_cost_annual = (operators_needed * operator_salary + 
                           supervisors_needed * supervisor_salary + 
                           maintenance_staff * maintenance_salary)
        
        # 4. Maintenance Cost (3% of CAPEX annually)
        capex = self._calculate_capital_costs(location, energy_source, water_source, capacity_kg_day)
        maintenance_cost_annual = capex['total'] * 0.03
        
        # 5. Transportation Cost (for hydrogen delivery)
        demand_distance = self._calculate_distance(location, demand_center.location)
        
        # Cost depends on transport method
        if demand_distance <= 50:
            # Truck transport: ₹2 per kg per km
            transport_cost_per_kg = demand_distance * 2
        else:
            # Pipeline transport: ₹0.5 per kg per km (if pipeline exists)
            transport_cost_per_kg = demand_distance * 0.5
        
        transportation_cost_annual = annual_production_kg * transport_cost_per_kg
        
        # Total OPEX
        total_opex = (electricity_cost_annual + water_cost_annual + labor_cost_annual + 
                     maintenance_cost_annual + transportation_cost_annual)
        
        return {
            'electricity': electricity_cost_annual,
            'water': water_cost_annual,
            'labor': labor_cost_annual,
            'maintenance': maintenance_cost_annual,
            'transportation': transportation_cost_annual,
            'total': total_opex
        }
    
    def _calculate_revenue(self, demand_center: DemandCenter, capacity_kg_day: int) -> Dict:
        """Calculate annual revenue"""
        
        annual_production_kg = capacity_kg_day * self.annual_operating_days
        
        # Dynamic pricing based on demand center characteristics
        base_price = 300  # ₹300 per kg base price for green hydrogen
        
        # Price premium based on willingness to pay
        willingness_premium = demand_center.willingness_to_pay / 100  # Convert percentage to multiplier
        price_with_premium = base_price * (1 + willingness_premium)
        
        # Market demand adjustment
        demand_ratio = min(1.0, annual_production_kg / demand_center.hydrogen_demand_mt_year / 1000)
        
        # If we can satisfy <50% of demand, we get premium pricing
        if demand_ratio < 0.5:
            market_premium = 1.1  # 10% premium
        elif demand_ratio < 0.8:
            market_premium = 1.05  # 5% premium  
        else:
            market_premium = 1.0   # Market price
        
        final_price_per_kg = price_with_premium * market_premium
        annual_revenue = annual_production_kg * final_price_per_kg
        
        return {
            'price_per_kg': final_price_per_kg,
            'annual': annual_revenue,
            'daily': annual_revenue / 365
        }
    
    def _calculate_financial_metrics(self, capex: Dict, opex: Dict, revenue: Dict) -> Dict:
        """Calculate ROI, payback, NPV, and IRR"""
        
        annual_profit = revenue['annual'] - opex['total']
        roi_percentage = (annual_profit / capex['total']) * 100
        
        # Payback period
        if annual_profit > 0:
            payback_years = capex['total'] / annual_profit
        else:
            payback_years = float('inf')
        
        # NPV calculation (10 years, 12% discount rate)
        discount_rate = 0.12
        npv = -capex['total']  # Initial investment
        
        for year in range(1, 11):
            npv += annual_profit / ((1 + discount_rate) ** year)
        
        # IRR calculation (simplified)
        irr = self._calculate_irr(capex['total'], annual_profit, 10)
        
        return {
            'annual_profit': annual_profit,
            'roi': roi_percentage,
            'payback': payback_years,
            'npv': npv,
            'irr': irr
        }
    
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
                return 'industrial'
        
        # Coastal areas - agricultural
        if location.longitude > 72.5:  # Eastern Gujarat
            return 'agricultural'
        
        # Default - barren (Kutch region)
        return 'barren'
    
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

# Example usage function
def analyze_economic_feasibility(location_data: dict) -> dict:
    """Analyze economic feasibility for a given location"""
    calculator = InvestorGradeEconomicCalculator()
    
    # Extract data from location analysis
    location = LocationPoint(
        latitude=location_data['location']['latitude'],
        longitude=location_data['location']['longitude']
    )
    
    # Mock data for demonstration - replace with actual data
    energy_source = EnergySource(
        id="solar_1",
        name="Charanka Solar Park",
        location=LocationPoint(latitude=23.2, longitude=72.1),
        capacity_mw=345,
        cost_per_kwh=2.5,
        type="solar"
    )
    
    demand_center = DemandCenter(
        id="refinery_1", 
        name="Jamnagar Refinery",
        location=LocationPoint(latitude=22.4, longitude=70.1),
        hydrogen_demand_mt_year=50000,
        willingness_to_pay=15,
        type="refinery"
    )
    
    water_source = WaterSource(
        id="narmada_1",
        name="Narmada Canal",
        location=LocationPoint(latitude=22.5, longitude=72.5),
        capacity_liters_day=10000000,
        extraction_cost=0.3,
        type="canal"
    )
    
    # Calculate economics for different plant sizes
    results = {}
    for capacity in [500, 1000, 2000]:  # kg/day
        analysis = calculator.calculate_comprehensive_economics(
            location, energy_source, demand_center, water_source, capacity
        )
        results[f"{capacity}_kg_day"] = analysis
    
    return results
