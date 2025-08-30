import math
from typing import Dict, List, Tuple
from dataclasses import dataclass
from models import LocationPoint, EnergySource, DemandCenter, WaterSource

@dataclass
class EconomicAnalysis:
    """Comprehensive economic analysis for hydrogen plant"""
    # Capital Costs
    plant_construction_cost: float
    electrolyzer_cost: float
    infrastructure_cost: float
    land_acquisition_cost: float
    total_capex: float
    
    # Operating Costs (Annual)
    electricity_cost_annual: float
    water_cost_annual: float
    labor_cost_annual: float
    maintenance_cost_annual: float
    transportation_cost_annual: float
    total_opex_annual: float
    
    # Revenue
    hydrogen_production_kg_day: float
    hydrogen_selling_price_per_kg: float
    annual_revenue: float
    
    # Financial Metrics
    annual_profit: float
    roi_percentage: float
    payback_period_years: float
    npv_10_years: float
    irr_percentage: float

class EnhancedEconomicCalculator:
    def __init__(self):
        # Base costs in INR
        self.base_electrolyzer_cost_per_mw = 4_00_00_000  # ₹4 crores per MW
        self.base_construction_cost_per_kg_day = 15_00_000  # ₹15 lakhs per kg/day capacity
        self.land_cost_per_acre = {
            'industrial': 50_00_000,  # ₹50 lakhs/acre
            'agricultural': 20_00_000,  # ₹20 lakhs/acre
            'barren': 10_00_000,      # ₹10 lakhs/acre
        }
        
        # Operating parameters
        self.electricity_requirement_kwh_per_kg_h2 = 55  # kWh per kg H2
        self.water_requirement_liters_per_kg_h2 = 9     # Liters per kg H2
        self.plant_efficiency = 0.65  # 65% efficiency
        self.annual_operating_days = 330  # 90% uptime
        
    def calculate_comprehensive_economics(self, 
                                        location: LocationPoint,
                                        energy_source: EnergySource,
                                        demand_center: DemandCenter,
                                        water_source: WaterSource,
                                        plant_capacity_kg_day: int = 1000) -> EconomicAnalysis:
        """Calculate complete economic analysis for a hydrogen plant"""
        
        # === CAPITAL COSTS ===
        capex = self._calculate_capital_costs(location, energy_source, water_source, plant_capacity_kg_day)
        
        # === OPERATING COSTS ===
        opex = self._calculate_operating_costs(location, energy_source, demand_center, water_source, plant_capacity_kg_day)
        
        # === REVENUE CALCULATION ===
        revenue = self._calculate_revenue(demand_center, plant_capacity_kg_day)
        
        # === FINANCIAL METRICS ===
        financial_metrics = self._calculate_financial_metrics(capex, opex, revenue)
        
        return EconomicAnalysis(
            # CAPEX
            plant_construction_cost=capex['construction'],
            electrolyzer_cost=capex['electrolyzer'],
            infrastructure_cost=capex['infrastructure'],
            land_acquisition_cost=capex['land'],
            total_capex=capex['total'],
            
            # OPEX
            electricity_cost_annual=opex['electricity'],
            water_cost_annual=opex['water'],
            labor_cost_annual=opex['labor'],
            maintenance_cost_annual=opex['maintenance'],
            transportation_cost_annual=opex['transportation'],
            total_opex_annual=opex['total'],
            
            # Revenue
            hydrogen_production_kg_day=plant_capacity_kg_day,
            hydrogen_selling_price_per_kg=revenue['price_per_kg'],
            annual_revenue=revenue['annual'],
            
            # Financial metrics
            annual_profit=financial_metrics['annual_profit'],
            roi_percentage=financial_metrics['roi'],
            payback_period_years=financial_metrics['payback'],
            npv_10_years=financial_metrics['npv'],
            irr_percentage=financial_metrics['irr']
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
    calculator = EnhancedEconomicCalculator()
    
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
