"""
Investor-Grade Economic Analysis for Green Hydrogen Plants
Comprehensive cost calculation with detailed breakdowns for investment decisions
"""

import math
from typing import Dict, List, Tuple
from dataclasses import dataclass

@dataclass
class InvestorAnalysis:
    """Complete investment analysis for hydrogen plant"""
    
    # === DETAILED CAPEX (₹ Crores) ===
    # Equipment Costs
    electrolyzer_stack: float
    power_electronics: float
    compression_system: float
    storage_infrastructure: float
    purification_equipment: float
    safety_systems: float
    
    # Infrastructure Costs  
    plant_construction: float
    electrical_infrastructure: float
    water_treatment_facility: float
    pipeline_connections: float
    road_access: float
    utilities_connection: float
    
    # Land & Regulatory
    land_acquisition: float
    environmental_permits: float
    regulatory_approvals: float
    
    # Project Costs
    engineering_design: float
    project_management: float
    commissioning: float
    contingency: float
    
    total_capex: float
    
    # === DETAILED OPEX (₹ Crores/year) ===
    # Production Costs
    electricity_annual: float
    water_annual: float
    consumables_annual: float
    
    # Personnel Costs
    operations_staff: float
    maintenance_team: float
    management: float
    
    # Facility Costs
    equipment_maintenance: float
    facility_upkeep: float
    insurance: float
    
    # Business Costs
    transportation: float
    marketing_sales: float
    compliance: float
    
    total_annual_opex: float
    
    # === PRODUCTION & MARKET ===
    daily_production_kg: float
    annual_production_tonnes: float
    capacity_utilization: float
    
    hydrogen_price_per_kg: float
    annual_revenue: float
    annual_profit: float
    
    # === INVESTOR METRICS ===
    roi_percentage: float
    payback_period_years: float
    npv_10_years: float
    irr_percentage: float
    
    # Financial Ratios
    debt_equity_ratio: float
    interest_coverage_ratio: float
    cash_flow_margin: float
    
    # Risk Assessment
    sensitivity_analysis: Dict[str, float]
    market_risk_score: float
    technology_risk_score: float
    regulatory_risk_score: float
    
    # Investment Recommendation
    investment_grade: str
    risk_category: str
    recommendation_summary: str

class InvestorEconomicCalculator:
    """Professional-grade economic calculator for hydrogen plant investments"""
    
    def __init__(self):
        # === REAL MARKET COSTS (2025) ===
        self.capex_rates = {
            # Electrolyzer Technology (₹/kW)
            'alkaline_electrolyzer': 65000,      # ₹65k/kW (mature technology)
            'pem_electrolyzer': 85000,           # ₹85k/kW (higher efficiency)
            'soec_electrolyzer': 120000,         # ₹1.2L/kW (emerging)
            
            # Supporting Equipment (₹/kW)
            'power_electronics': 12000,          # ₹12k/kW
            'control_systems': 8000,             # ₹8k/kW
            
            # Compression & Storage (₹/kg capacity)
            'compression_350bar': 25000,         # ₹25k per kg/day
            'compression_700bar': 45000,         # ₹45k per kg/day  
            'storage_vessels': 8000,             # ₹8k per kg stored
            
            # Infrastructure (base costs + capacity scaling)
            'plant_building': 12000,             # ₹12k per kg/day capacity
            'electrical_infra': 35000,           # ₹35k per kW
            'water_treatment': 250_00_000,       # ₹2.5 Cr base + scaling
            
            # Land (₹/acre by location)
            'industrial_zone': 60_00_000,        # ₹60L/acre
            'sez_zone': 80_00_000,               # ₹80L/acre
            'rural_land': 15_00_000,             # ₹15L/acre
            'coastal_area': 45_00_000,           # ₹45L/acre
            'port_proximity': 100_00_000,        # ₹1 Cr/acre
        }
        
        self.opex_rates = {
            # Electricity Costs (₹/kWh by source)
            'grid_power': 4.2,                   # ₹4.2/kWh industrial rate
            'solar_ppa': 2.8,                    # ₹2.8/kWh solar PPA
            'wind_ppa': 3.1,                     # ₹3.1/kWh wind PPA
            'renewable_hybrid': 2.9,             # ₹2.9/kWh hybrid RE
            
            # Water Costs (₹/liter)
            'municipal_supply': 0.8,             # ₹0.8/L municipal
            'groundwater': 0.3,                  # ₹0.3/L groundwater
            'recycled_water': 0.5,               # ₹0.5/L treated
            'desalinated': 1.2,                  # ₹1.2/L desalinated
            
            # Personnel (Annual ₹)
            'plant_manager': 18_00_000,          # ₹18L/year
            'operations_engineer': 12_00_000,    # ₹12L/year
            'shift_operator': 8_00_000,          # ₹8L/year
            'maintenance_tech': 6_00_000,        # ₹6L/year
            'safety_officer': 10_00_000,         # ₹10L/year
            'admin_staff': 5_00_000,             # ₹5L/year
        }
        
        # Production Parameters
        self.production_params = {
            'electrolyzer_efficiency': 0.68,     # 68% electrical efficiency
            'kwh_per_kg_h2': 52,                 # kWh per kg H2 (optimistic)
            'water_per_kg_h2': 9,                # Liters per kg H2
            'capacity_factor': 0.85,             # 85% uptime
            'plant_life_years': 20,              # 20-year plant life
        }
        
        # Market Data (Gujarat 2025)
        self.market_data = {
            'h2_price_industrial': 280,          # ₹280/kg industrial
            'h2_price_mobility': 320,            # ₹320/kg transport (reduced from 350)
            'h2_price_export': 320,              # ₹320/kg export
            'price_growth_rate': 0.06,           # 6% annual growth
            'demand_growth_rate': 0.25,          # 25% demand growth
        }
    
    def calculate_investor_analysis(self, 
                                  location_data: Dict,
                                  plant_capacity_kg_day: int = 1000,
                                  technology_type: str = 'pem') -> InvestorAnalysis:
        """
        Calculate comprehensive investor-grade analysis
        
        Args:
            location_data: Location characteristics and infrastructure proximity
            plant_capacity_kg_day: Daily hydrogen production capacity
            technology_type: Electrolyzer technology ('alkaline', 'pem', 'soec')
        """
        
        # === CAPEX CALCULATION ===
        capex_breakdown = self._calculate_detailed_capex(location_data, plant_capacity_kg_day, technology_type)
        
        # === OPEX CALCULATION ===
        opex_breakdown = self._calculate_detailed_opex(location_data, plant_capacity_kg_day)
        
        # === PRODUCTION & REVENUE ===
        production_metrics = self._calculate_production_revenue(location_data, plant_capacity_kg_day)
        
        # === FINANCIAL ANALYSIS ===
        financial_metrics = self._calculate_financial_metrics(capex_breakdown, opex_breakdown, production_metrics)
        
        # === RISK ASSESSMENT ===
        risk_analysis = self._assess_investment_risks(location_data, financial_metrics)
        
        # === INVESTMENT RECOMMENDATION ===
        recommendation = self._generate_investment_recommendation(financial_metrics, risk_analysis)
        
        return InvestorAnalysis(
            # CAPEX breakdown (converted to crores)
            electrolyzer_stack=capex_breakdown['electrolyzer'] / 1e7,
            power_electronics=capex_breakdown['power_electronics'] / 1e7,
            compression_system=capex_breakdown['compression'] / 1e7,
            storage_infrastructure=capex_breakdown['storage'] / 1e7,
            purification_equipment=capex_breakdown['purification'] / 1e7,
            safety_systems=capex_breakdown['safety'] / 1e7,
            
            plant_construction=capex_breakdown['construction'] / 1e7,
            electrical_infrastructure=capex_breakdown['electrical'] / 1e7,
            water_treatment_facility=capex_breakdown['water_treatment'] / 1e7,
            pipeline_connections=capex_breakdown['pipeline'] / 1e7,
            road_access=capex_breakdown['road_access'] / 1e7,
            utilities_connection=capex_breakdown['utilities'] / 1e7,
            
            land_acquisition=capex_breakdown['land'] / 1e7,
            environmental_permits=capex_breakdown['environmental'] / 1e7,
            regulatory_approvals=capex_breakdown['regulatory'] / 1e7,
            
            engineering_design=capex_breakdown['engineering'] / 1e7,
            project_management=capex_breakdown['project_mgmt'] / 1e7,
            commissioning=capex_breakdown['commissioning'] / 1e7,
            contingency=capex_breakdown['contingency'] / 1e7,
            
            total_capex=sum(capex_breakdown.values()) / 1e7,
            
            # OPEX breakdown (converted to crores)
            electricity_annual=opex_breakdown['electricity'] / 1e7,
            water_annual=opex_breakdown['water'] / 1e7,
            consumables_annual=opex_breakdown['consumables'] / 1e7,
            
            operations_staff=opex_breakdown['operations_staff'] / 1e7,
            maintenance_team=opex_breakdown['maintenance_team'] / 1e7,
            management=opex_breakdown['management'] / 1e7,
            
            equipment_maintenance=opex_breakdown['equipment_maint'] / 1e7,
            facility_upkeep=opex_breakdown['facility_maint'] / 1e7,
            insurance=opex_breakdown['insurance'] / 1e7,
            
            transportation=opex_breakdown['transportation'] / 1e7,
            marketing_sales=opex_breakdown['marketing'] / 1e7,
            compliance=opex_breakdown['compliance'] / 1e7,
            
            total_annual_opex=sum(opex_breakdown.values()) / 1e7,
            
            # Production metrics
            daily_production_kg=production_metrics['daily_production'],
            annual_production_tonnes=production_metrics['annual_tonnes'],
            capacity_utilization=production_metrics['capacity_utilization'],
            
            hydrogen_price_per_kg=production_metrics['selling_price'],
            annual_revenue=production_metrics['annual_revenue'] / 1e7,
            annual_profit=production_metrics['annual_profit'] / 1e7,
            
            # Financial metrics
            roi_percentage=financial_metrics['roi'],
            payback_period_years=financial_metrics['payback'],
            npv_10_years=financial_metrics['npv'] / 1e7,
            irr_percentage=financial_metrics['irr'],
            
            debt_equity_ratio=financial_metrics['debt_equity'],
            interest_coverage_ratio=financial_metrics['interest_coverage'],
            cash_flow_margin=financial_metrics['cash_flow_margin'],
            
            # Risk assessment
            sensitivity_analysis=risk_analysis['sensitivity'],
            market_risk_score=risk_analysis['market_risk'],
            technology_risk_score=risk_analysis['technology_risk'],
            regulatory_risk_score=risk_analysis['regulatory_risk'],
            
            # Recommendation
            investment_grade=recommendation['grade'],
            risk_category=recommendation['risk_category'],
            recommendation_summary=recommendation['summary']
        )
    
    def _calculate_detailed_capex(self, location_data: Dict, capacity_kg_day: int, technology: str) -> Dict[str, float]:
        """Calculate detailed CAPEX with all components"""
        
        # Required electrical capacity
        kw_required = (capacity_kg_day * self.production_params['kwh_per_kg_h2']) / (24 * self.production_params['capacity_factor'])
        
        # Land area required (acres)
        land_acres = max(5, capacity_kg_day / 200)  # Min 5 acres, scale with capacity
        
        capex = {}
        
        # === EQUIPMENT COSTS ===
        electrolyzer_rate = self.capex_rates[f'{technology}_electrolyzer']
        capex['electrolyzer'] = kw_required * electrolyzer_rate
        capex['power_electronics'] = kw_required * self.capex_rates['power_electronics']
        capex['control_systems'] = kw_required * self.capex_rates['control_systems']
        
        # Compression (assuming 350 bar for industrial use)
        capex['compression'] = capacity_kg_day * self.capex_rates['compression_350bar']
        
        # Storage (24 hours capacity)
        capex['storage'] = capacity_kg_day * 24 * self.capex_rates['storage_vessels']
        
        # Purification & Safety
        capex['purification'] = 120_00_000 + (capacity_kg_day * 5000)  # Base + scaling
        capex['safety'] = 80_00_000 + (kw_required * 1000)            # Base + scaling
        
        # === INFRASTRUCTURE COSTS ===
        capex['construction'] = capacity_kg_day * self.capex_rates['plant_building']
        capex['electrical'] = kw_required * self.capex_rates['electrical_infra']
        capex['water_treatment'] = self.capex_rates['water_treatment'] + (capacity_kg_day * 8000)
        
        # Distance-based infrastructure
        power_distance = location_data.get('power_distance_km', 10)
        water_distance = location_data.get('water_distance_km', 5)
        pipeline_distance = location_data.get('pipeline_distance_km', 20)
        
        capex['pipeline'] = pipeline_distance * 15_00_000         # ₹15L/km pipeline
        capex['road_access'] = max(2, power_distance/5) * 8_00_000  # Road development
        capex['utilities'] = power_distance * 12_00_000           # Electrical connection
        
        # === LAND & PERMITS ===
        zone_type = location_data.get('zone_type', 'rural_land')
        land_rate = self.capex_rates.get(zone_type, self.capex_rates['rural_land'])
        capex['land'] = land_acres * land_rate
        
        capex['environmental'] = max(50_00_000, capacity_kg_day * 25000)  # Environmental clearance
        capex['regulatory'] = max(25_00_000, capacity_kg_day * 15000)     # Regulatory permits
        
        # === PROJECT DEVELOPMENT ===
        equipment_total = capex['electrolyzer'] + capex['power_electronics'] + capex['compression'] + capex['storage']
        capex['engineering'] = equipment_total * 0.08      # 8% of equipment
        capex['project_mgmt'] = equipment_total * 0.05     # 5% of equipment
        capex['commissioning'] = equipment_total * 0.03    # 3% of equipment
        
        # Contingency (10% of all above)
        capex['contingency'] = sum(capex.values()) * 0.10
        
        return capex
    
    def _calculate_detailed_opex(self, location_data: Dict, capacity_kg_day: int) -> Dict[str, float]:
        """Calculate detailed annual OPEX"""
        
        annual_production_kg = capacity_kg_day * 365 * self.production_params['capacity_factor']
        
        opex = {}
        
        # === PRODUCTION COSTS ===
        # Electricity
        power_source = location_data.get('power_source', 'grid_power')
        electricity_rate = self.opex_rates[power_source]
        annual_kwh = annual_production_kg * self.production_params['kwh_per_kg_h2']
        opex['electricity'] = annual_kwh * electricity_rate
        
        # Water
        water_source = location_data.get('water_source', 'municipal_supply')
        water_rate = self.opex_rates[water_source]
        annual_water_liters = annual_production_kg * self.production_params['water_per_kg_h2']
        opex['water'] = annual_water_liters * water_rate
        
        # Consumables
        opex['consumables'] = annual_production_kg * 5  # ₹5/kg for catalysts, etc.
        
        # === PERSONNEL COSTS ===
        # Operations staff (3 shifts × 4 operators)
        opex['operations_staff'] = (
            self.opex_rates['plant_manager'] +                    # 1 manager
            self.opex_rates['operations_engineer'] * 2 +          # 2 engineers  
            self.opex_rates['shift_operator'] * 12 +              # 12 operators (3 shifts)
            self.opex_rates['safety_officer']                     # 1 safety officer
        )
        
        # Maintenance team
        opex['maintenance_team'] = (
            self.opex_rates['maintenance_tech'] * 6 +             # 6 technicians
            self.opex_rates['operations_engineer']                # 1 maintenance engineer
        )
        
        # Management & admin
        opex['management'] = self.opex_rates['admin_staff'] * 4   # 4 admin staff
        
        # === FACILITY COSTS ===
        # Equipment maintenance (2.5% of CAPEX annually)
        equipment_capex = capacity_kg_day * 100000  # Rough estimate
        opex['equipment_maint'] = equipment_capex * 0.025
        
        # Facility maintenance
        opex['facility_maint'] = capacity_kg_day * 5000 * 365    # ₹5k per kg/day annually
        
        # Insurance (0.5% of total CAPEX)
        total_capex_estimate = capacity_kg_day * 150000  # Rough estimate
        opex['insurance'] = total_capex_estimate * 0.005
        
        # === BUSINESS COSTS ===
        # Transportation to customers
        opex['transportation'] = annual_production_kg * 25       # ₹25/kg transport
        
        # Marketing & sales
        opex['marketing'] = annual_production_kg * 8             # ₹8/kg marketing
        
        # Regulatory compliance
        opex['compliance'] = max(25_00_000, annual_production_kg * 3)  # Min ₹25L
        
        return opex
    
    def _calculate_production_revenue(self, location_data: Dict, capacity_kg_day: int) -> Dict[str, float]:
        """Calculate production metrics and revenue"""
        
        daily_production = capacity_kg_day * self.production_params['capacity_factor']
        annual_production_kg = daily_production * 365
        annual_production_tonnes = annual_production_kg / 1000
        
        # Determine selling price based on market segment
        market_segment = location_data.get('market_segment', 'industrial')
        if market_segment == 'mobility':
            selling_price = self.market_data['h2_price_mobility']
        elif market_segment == 'export':
            selling_price = self.market_data['h2_price_export']
        else:
            selling_price = self.market_data['h2_price_industrial']
        
        annual_revenue = annual_production_kg * selling_price
        
        return {
            'daily_production': daily_production,
            'annual_kg': annual_production_kg,
            'annual_tonnes': annual_production_tonnes,
            'capacity_utilization': self.production_params['capacity_factor'],
            'selling_price': selling_price,
            'annual_revenue': annual_revenue,
            'annual_profit': 0  # Will be calculated in financial metrics
        }
    
    def _calculate_financial_metrics(self, capex: Dict, opex: Dict, production: Dict) -> Dict[str, float]:
        """Calculate comprehensive financial metrics"""
        
        total_capex = sum(capex.values())
        total_annual_opex = sum(opex.values())
        annual_revenue = production['annual_revenue']
        annual_profit = annual_revenue - total_annual_opex

        # Update production with profit
        production['annual_profit'] = annual_profit

        # Basic metrics
        roi = (annual_profit / total_capex) * 100 if total_capex > 0 else 0
        # Payback is undefined when profits are non-positive; use infinity for consistency
        payback = total_capex / annual_profit if annual_profit > 0 else float('inf')

        # NPV (10 years, 12% discount rate)
        discount_rate = 0.12
        npv = -total_capex
        for year in range(1, 11):
            # Include price escalation
            escalated_profit = annual_profit * (1 + self.market_data['price_growth_rate']) ** year
            npv += escalated_profit / ((1 + discount_rate) ** year)

        # IRR calculation
        irr = self._calculate_irr(total_capex, annual_profit, 10)

        # Financial ratios
        debt_equity_ratio = 2.33  # Assuming 70:30 debt:equity
        debt_amount = total_capex * 0.7
        annual_interest = debt_amount * 0.08  # 8% interest
        interest_coverage = annual_profit / annual_interest if annual_interest > 0 else 99

        cash_flow_margin = (annual_profit / annual_revenue) * 100 if annual_revenue > 0 else 0

        return {
            'roi': roi,
            'payback': payback,
            'npv': npv,
            'irr': irr,
            'debt_equity': debt_equity_ratio,
            'interest_coverage': interest_coverage,
            'cash_flow_margin': cash_flow_margin
        }
    
    def _assess_investment_risks(self, location_data: Dict, financial_metrics: Dict) -> Dict:
        """Assess investment risks"""
        
        # Sensitivity analysis
        sensitivity = {
            'electricity_price_10pct': self._sensitivity_electricity(financial_metrics, 0.1),
            'h2_price_10pct': self._sensitivity_h2_price(financial_metrics, 0.1),
            'capex_20pct': self._sensitivity_capex(financial_metrics, 0.2),
            'capacity_factor_5pct': self._sensitivity_capacity(financial_metrics, 0.05)
        }
        
        # Risk scores (0-100, lower is better)
        market_risk = 30  # Moderate market risk for hydrogen
        technology_risk = 25  # Mature technology (PEM/Alkaline)
        regulatory_risk = 20  # Supportive policy environment in Gujarat
        
        # Adjust based on location factors
        if location_data.get('zone_type') == 'sez_zone':
            regulatory_risk -= 5
        
        return {
            'sensitivity': sensitivity,
            'market_risk': market_risk,
            'technology_risk': technology_risk,
            'regulatory_risk': regulatory_risk
        }
    
    def _generate_investment_recommendation(self, financial_metrics: Dict, risk_analysis: Dict) -> Dict[str, str]:
        """Generate investment recommendation"""
        
        roi = financial_metrics['roi']
        payback = financial_metrics['payback']
        npv = financial_metrics['npv']
        
        # Determine investment grade
        if roi >= 20 and payback <= 5 and npv > 0:
            grade = "A+ (Excellent)"
            risk_category = "Low Risk"
            summary = "Highly recommended investment with strong returns and manageable risks."
        elif roi >= 15 and payback <= 6 and npv > 0:
            grade = "A (Very Good)"
            risk_category = "Low-Medium Risk"
            summary = "Recommended investment with good returns and acceptable risk profile."
        elif roi >= 12 and payback <= 8 and npv > 0:
            grade = "B+ (Good)"
            risk_category = "Medium Risk"
            summary = "Solid investment opportunity with moderate returns."
        elif roi >= 8 and payback <= 10:
            grade = "B (Acceptable)"
            risk_category = "Medium-High Risk"
            summary = "Acceptable investment but requires careful risk management."
        else:
            grade = "C (Challenging)"
            risk_category = "High Risk"
            summary = "Investment requires significant risk mitigation strategies."
        
        return {
            'grade': grade,
            'risk_category': risk_category,
            'summary': summary
        }
    
    def _calculate_irr(self, initial_investment: float, annual_cash_flow: float, years: int) -> float:
        """Calculate Internal Rate of Return"""
        if annual_cash_flow <= 0:
            return 0
        
        rate = 0.1  # Initial guess
        tolerance = 1000
        max_iterations = 100
        
        for _ in range(max_iterations):
            npv = -initial_investment
            for year in range(1, years + 1):
                npv += annual_cash_flow / ((1 + rate) ** year)
            
            if abs(npv) < tolerance:
                break
            
            # Newton-Raphson method approximation
            if npv > 0:
                rate += 0.01
            else:
                rate -= 0.01
            
            if rate < 0:
                rate = 0.01
        
        return rate * 100
    
    def _sensitivity_electricity(self, base_metrics: Dict, change: float) -> float:
        """Calculate sensitivity to electricity price changes"""
        # Simplified sensitivity calculation
        return base_metrics['roi'] * (1 - change * 0.5)  # Rough approximation
    
    def _sensitivity_h2_price(self, base_metrics: Dict, change: float) -> float:
        """Calculate sensitivity to hydrogen price changes"""
        return base_metrics['roi'] * (1 + change * 0.8)  # Rough approximation
    
    def _sensitivity_capex(self, base_metrics: Dict, change: float) -> float:
        """Calculate sensitivity to CAPEX changes"""
        return base_metrics['roi'] * (1 - change * 0.6)  # Rough approximation
    
    def _sensitivity_capacity(self, base_metrics: Dict, change: float) -> float:
        """Calculate sensitivity to capacity factor changes"""
        return base_metrics['roi'] * (1 + change * 1.2)  # Rough approximation


# Usage example for integration
def calculate_location_economics(location_point, energy_source, demand_center, water_source, capacity_kg_day=1000):
    """
    Main function to calculate economics for a location
    This replaces the old economic calculator
    """
    
    calculator = InvestorEconomicCalculator()
    
    # Prepare location data
    location_data = {
        'zone_type': 'industrial_zone',  # Would be determined from location analysis
        'power_distance_km': 10,        # Distance to energy source
        'water_distance_km': 5,         # Distance to water source
        'pipeline_distance_km': 20,     # Distance to pipeline
        'power_source': 'renewable_hybrid',  # Based on energy source
        'water_source': 'municipal_supply',  # Based on water source
        'market_segment': 'industrial'   # Based on demand center
    }
    
    # Calculate comprehensive analysis
    analysis = calculator.calculate_investor_analysis(
        location_data=location_data,
        plant_capacity_kg_day=capacity_kg_day,
        technology_type='pem'
    )
    
    return analysis


def run_investor_grade_analysis(location: tuple, capacity_mw: float, 
                               electricity_price: float, hydrogen_price: float) -> any:
    """
    Run investor-grade analysis for a specific location
    Compatible with algorithm.py requirements
    """
    
    calculator = InvestorEconomicCalculator()
    
    # Convert MW to kg/day (rough conversion: 1 MW = ~20 kg/day)
    capacity_kg_day = int(capacity_mw * 20)
    
    # Prepare location data based on inputs
    location_data = {
        'zone_type': 'industrial_zone',
        'power_distance_km': 5,  # Default values
        'water_distance_km': 3,
        'pipeline_distance_km': 15,
        'power_source': 'renewable_hybrid',
        'water_source': 'municipal_supply',
        'market_segment': 'industrial',
        'electricity_rate': electricity_price,
        'hydrogen_selling_price': hydrogen_price
    }
    
    # Calculate analysis
    analysis = calculator.calculate_investor_analysis(
        location_data=location_data,
        plant_capacity_kg_day=capacity_kg_day,
        technology_type='pem'
    )
    
    return analysis
