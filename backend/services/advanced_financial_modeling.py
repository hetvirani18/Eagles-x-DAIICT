"""
Advanced Financial Modeling for H₂-Optimize
Comprehensive scenario analysis, Monte Carlo simulations, and financing options
"""

# Use try/except for optional dependencies
try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    HAS_NUMPY = False
    
try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False

from dataclasses import dataclass
from typing import Dict, List, Tuple, Optional
from enum import Enum
import random
import math
import random
from datetime import datetime, timedelta

class ScenarioType(Enum):
    OPTIMISTIC = "optimistic"
    MOST_LIKELY = "most_likely"
    PESSIMISTIC = "pessimistic"

class FinancingType(Enum):
    EQUITY_ONLY = "equity_only"
    DEBT_EQUITY_70_30 = "debt_equity_70_30"
    DEBT_EQUITY_80_20 = "debt_equity_80_20"
    PROJECT_FINANCE = "project_finance"

@dataclass
class ScenarioParameters:
    """Parameters for different scenario analyses"""
    hydrogen_price_multiplier: float
    capacity_utilization_modifier: float
    capex_multiplier: float
    opex_multiplier: float
    market_growth_rate: float
    regulatory_support_level: float
    technology_efficiency_gain: float

@dataclass
class MonteCarloResult:
    """Results from Monte Carlo simulation"""
    mean_npv: float
    std_npv: float
    probability_positive_npv: float
    percentile_5_npv: float
    percentile_95_npv: float
    mean_roi: float
    probability_roi_above_15: float
    risk_adjusted_return: float

@dataclass
class FinancingScenario:
    """Different financing structure scenarios"""
    financing_type: FinancingType
    debt_percentage: float
    equity_percentage: float
    debt_interest_rate: float
    loan_term_years: int
    required_equity_return: float
    weighted_cost_of_capital: float

@dataclass
class BreakEvenAnalysis:
    """Break-even analysis results"""
    breakeven_capacity_utilization: float
    breakeven_hydrogen_price: float
    breakeven_electricity_cost: float
    sensitivity_to_capex: float
    sensitivity_to_opex: float
    margin_of_safety: float

class AdvancedFinancialModeler:
    """Advanced financial modeling with scenario analysis and risk assessment"""
    
    def __init__(self):
        self.base_scenarios = self._initialize_scenarios()
        self.financing_options = self._initialize_financing_options()
        
    def _initialize_scenarios(self) -> Dict[ScenarioType, ScenarioParameters]:
        """Initialize predefined scenario parameters"""
        return {
            ScenarioType.OPTIMISTIC: ScenarioParameters(
                hydrogen_price_multiplier=1.3,  # 30% higher prices
                capacity_utilization_modifier=1.15,  # 15% better utilization
                capex_multiplier=0.9,  # 10% lower CAPEX
                opex_multiplier=0.85,  # 15% lower OPEX
                market_growth_rate=0.25,  # 25% annual growth
                regulatory_support_level=1.2,  # Strong policy support
                technology_efficiency_gain=1.1  # 10% efficiency improvement
            ),
            ScenarioType.MOST_LIKELY: ScenarioParameters(
                hydrogen_price_multiplier=1.0,  # Base case pricing
                capacity_utilization_modifier=1.0,  # Expected utilization
                capex_multiplier=1.0,  # Expected CAPEX
                opex_multiplier=1.0,  # Expected OPEX
                market_growth_rate=0.15,  # 15% annual growth
                regulatory_support_level=1.0,  # Current policy level
                technology_efficiency_gain=1.05  # 5% efficiency improvement
            ),
            ScenarioType.PESSIMISTIC: ScenarioParameters(
                hydrogen_price_multiplier=0.7,  # 30% lower prices
                capacity_utilization_modifier=0.8,  # 20% lower utilization
                capex_multiplier=1.2,  # 20% higher CAPEX
                opex_multiplier=1.15,  # 15% higher OPEX
                market_growth_rate=0.05,  # 5% annual growth
                regulatory_support_level=0.8,  # Reduced policy support
                technology_efficiency_gain=1.0  # No efficiency gain
            )
        }
    
    def _initialize_financing_options(self) -> Dict[FinancingType, FinancingScenario]:
        """Initialize different financing structure options"""
        return {
            FinancingType.EQUITY_ONLY: FinancingScenario(
                financing_type=FinancingType.EQUITY_ONLY,
                debt_percentage=0.0,
                equity_percentage=100.0,
                debt_interest_rate=0.0,
                loan_term_years=0,
                required_equity_return=15.0,
                weighted_cost_of_capital=15.0
            ),
            FinancingType.DEBT_EQUITY_70_30: FinancingScenario(
                financing_type=FinancingType.DEBT_EQUITY_70_30,
                debt_percentage=70.0,
                equity_percentage=30.0,
                debt_interest_rate=8.5,
                loan_term_years=15,
                required_equity_return=18.0,
                weighted_cost_of_capital=11.35  # WACC calculation
            ),
            FinancingType.DEBT_EQUITY_80_20: FinancingScenario(
                financing_type=FinancingType.DEBT_EQUITY_80_20,
                debt_percentage=80.0,
                equity_percentage=20.0,
                debt_interest_rate=9.0,
                loan_term_years=15,
                required_equity_return=20.0,
                weighted_cost_of_capital=11.2  # WACC calculation
            ),
            FinancingType.PROJECT_FINANCE: FinancingScenario(
                financing_type=FinancingType.PROJECT_FINANCE,
                debt_percentage=75.0,
                equity_percentage=25.0,
                debt_interest_rate=9.5,
                loan_term_years=18,
                required_equity_return=22.0,
                weighted_cost_of_capital=12.625  # WACC calculation
            )
        }
    
    def run_scenario_analysis(self, base_analysis: dict, project_life_years: int = 20) -> Dict[ScenarioType, dict]:
        """Run comprehensive scenario analysis"""
        results = {}
        
        for scenario_type, params in self.base_scenarios.items():
            scenario_result = self._calculate_scenario_metrics(
                base_analysis, params, project_life_years
            )
            results[scenario_type] = scenario_result
            
        return results
    
    def _calculate_scenario_metrics(self, base_analysis: dict, params: ScenarioParameters, 
                                  project_life_years: int) -> dict:
        """Calculate financial metrics for a specific scenario"""
        
        # Adjust base parameters according to scenario
        adjusted_metrics = {
            'capex': base_analysis['total_capex'] * params.capex_multiplier,
            'annual_opex': base_analysis['total_annual_opex'] * params.opex_multiplier,
            'hydrogen_price': base_analysis['hydrogen_price_per_kg'] * params.hydrogen_price_multiplier,
            'capacity_utilization': min(0.95, base_analysis.get('capacity_utilization', 0.85) * params.capacity_utilization_modifier),
            'annual_production': base_analysis['annual_production_tonnes'] * params.capacity_utilization_modifier,
        }
        
        # Calculate scenario-specific cash flows
        annual_revenue = adjusted_metrics['annual_production'] * 1000 * adjusted_metrics['hydrogen_price']  # Convert tonnes to kg
        annual_profit = annual_revenue - adjusted_metrics['annual_opex']
        
        # Technology efficiency gains over time
        efficiency_gains = []
        for year in range(project_life_years):
            yearly_gain = 1 + (params.technology_efficiency_gain - 1) * min(year / 5, 1)  # Ramp up over 5 years
            efficiency_gains.append(yearly_gain)
        
        # Calculate NPV with scenario adjustments
        discount_rate = 0.12  # Base discount rate
        cash_flows = []
        
        for year in range(project_life_years):
            if year == 0:
                cash_flows.append(-adjusted_metrics['capex'])
            else:
                # Apply market growth and efficiency gains
                market_factor = (1 + params.market_growth_rate) ** year
                efficiency_factor = efficiency_gains[year]
                regulatory_factor = params.regulatory_support_level
                
                adjusted_revenue = annual_revenue * market_factor * efficiency_factor * regulatory_factor
                adjusted_opex = adjusted_metrics['annual_opex'] * market_factor * 0.98 ** year  # Slight OPEX efficiency
                
                annual_cash_flow = adjusted_revenue - adjusted_opex
                cash_flows.append(annual_cash_flow)
        
        # Calculate financial metrics
        npv = self._calculate_npv(cash_flows, discount_rate)
        irr = self._calculate_irr(cash_flows)
        payback_period = self._calculate_payback_period(cash_flows)
        
        # ROI calculation
        total_investment = adjusted_metrics['capex']
        cumulative_profit = sum(cash_flows[1:])  # Exclude initial investment
        roi = (cumulative_profit / total_investment) * 100
        
        return {
            'scenario_type': params,
            'adjusted_capex_crores': round(adjusted_metrics['capex'], 2),
            'adjusted_opex_crores': round(adjusted_metrics['annual_opex'], 2),
            'adjusted_hydrogen_price': round(adjusted_metrics['hydrogen_price'], 0),
            'capacity_utilization_percent': round(adjusted_metrics['capacity_utilization'] * 100, 1),
            'annual_revenue_crores': round(annual_revenue, 2),
            'annual_profit_crores': round(annual_profit, 2),
            'npv_crores': round(npv, 2),
            'irr_percentage': round(irr * 100, 2),
            'roi_percentage': round(roi, 2),
            'payback_period_years': round(payback_period, 1),
            'cumulative_cash_flow_crores': round(cumulative_profit, 2),
            'risk_level': self._assess_risk_level(npv, irr, payback_period)
        }
    
    def run_monte_carlo_simulation(self, base_analysis: dict, num_simulations: int = 1000) -> MonteCarloResult:
        """Run Monte Carlo simulation for risk analysis (simplified without numpy)"""
        
        npv_results = []
        roi_results = []
        
        for _ in range(num_simulations):
            # Generate random variables using Python's random module
            hydrogen_price_factor = random.gauss(1.0, 0.15)  # 15% volatility
            capex_factor = random.gauss(1.0, 0.10)  # 10% volatility
            opex_factor = random.gauss(1.0, 0.08)  # 8% volatility
            utilization_factor = random.gauss(1.0, 0.12)  # 12% volatility
            market_growth = random.gauss(0.15, 0.05)  # Market growth uncertainty
            
            # Ensure reasonable bounds
            hydrogen_price_factor = max(0.5, min(1.8, hydrogen_price_factor))
            capex_factor = max(0.8, min(1.4, capex_factor))
            opex_factor = max(0.8, min(1.3, opex_factor))
            utilization_factor = max(0.6, min(1.1, utilization_factor))
            market_growth = max(0.0, min(0.30, market_growth))
            
            # Calculate scenario
            adjusted_capex = base_analysis['total_capex'] * capex_factor
            adjusted_opex = base_analysis['total_annual_opex'] * opex_factor
            adjusted_price = base_analysis['hydrogen_price_per_kg'] * hydrogen_price_factor
            adjusted_production = base_analysis['annual_production_tonnes'] * utilization_factor
            
            # Simple cash flow calculation for Monte Carlo
            annual_revenue = adjusted_production * 1000 * adjusted_price
            annual_profit = annual_revenue - adjusted_opex
            
            # Simple NPV calculation (10 year)
            discount_rate = 0.12
            npv = -adjusted_capex
            for year in range(10):
                npv += annual_profit / ((1 + discount_rate) ** (year + 1))
            
            # ROI calculation
            roi = (annual_profit * 10 - adjusted_capex) / adjusted_capex * 100
            
            npv_results.append(npv)
            roi_results.append(roi)
        
        # Calculate statistics without numpy
        def mean(values):
            return sum(values) / len(values)
        
        def std(values):
            m = mean(values)
            return math.sqrt(sum((x - m) ** 2 for x in values) / len(values))
        
        def percentile(values, p):
            sorted_values = sorted(values)
            index = int(len(sorted_values) * p / 100)
            return sorted_values[min(index, len(sorted_values) - 1)]
        
        npv_positive = len([x for x in npv_results if x > 0])
        roi_above_15 = len([x for x in roi_results if x > 15])
        
        return MonteCarloResult(
            mean_npv=mean(npv_results),
            std_npv=std(npv_results),
            probability_positive_npv=npv_positive / len(npv_results),
            percentile_5_npv=percentile(npv_results, 5),
            percentile_95_npv=percentile(npv_results, 95),
            mean_roi=mean(roi_results),
            probability_roi_above_15=roi_above_15 / len(roi_results),
            risk_adjusted_return=mean(roi_results) / std(roi_results) if std(roi_results) > 0 else 0,
            roi_p10=percentile(roi_results, 10),
            roi_p90=percentile(roi_results, 90),
            risk_level="Low" if std(roi_results) < 5 else "Medium" if std(roi_results) < 10 else "High"
        )
    
    def analyze_financing_options(self, base_analysis: dict) -> Dict[FinancingType, dict]:
        """Analyze different financing structure impacts"""
        results = {}
        
        for financing_type, scenario in self.financing_options.items():
            financing_result = self._calculate_financing_impact(base_analysis, scenario)
            results[financing_type] = financing_result
            
        return results
    
    def _calculate_financing_impact(self, base_analysis: dict, financing: FinancingScenario) -> dict:
        """Calculate the impact of different financing structures"""
        
        total_capex = base_analysis['total_capex']
        annual_profit = base_analysis['annual_profit']
        
        # Calculate debt service
        debt_amount = total_capex * (financing.debt_percentage / 100)
        equity_amount = total_capex * (financing.equity_percentage / 100)
        
        if debt_amount > 0:
            # Calculate annual debt service (principal + interest)
            monthly_rate = financing.debt_interest_rate / 100 / 12
            num_payments = financing.loan_term_years * 12
            
            if monthly_rate > 0:
                monthly_payment = debt_amount * (monthly_rate * (1 + monthly_rate) ** num_payments) / \
                                ((1 + monthly_rate) ** num_payments - 1)
                annual_debt_service = monthly_payment * 12
            else:
                annual_debt_service = debt_amount / financing.loan_term_years
        else:
            annual_debt_service = 0
        
        # Calculate returns to equity
        annual_cash_to_equity = annual_profit - annual_debt_service
        equity_roi = (annual_cash_to_equity / equity_amount) * 100 if equity_amount > 0 else 0
        
        # Calculate leveraged IRR (simplified)
        leveraged_cash_flows = [-equity_amount]  # Initial equity investment
        for year in range(1, 16):  # 15 year analysis
            if year <= financing.loan_term_years:
                yearly_cash_flow = annual_cash_to_equity
            else:
                yearly_cash_flow = annual_profit  # No more debt service
            leveraged_cash_flows.append(yearly_cash_flow)
        
        leveraged_irr = self._calculate_irr(leveraged_cash_flows)
        
        # Debt service coverage ratio
        dscr = annual_profit / annual_debt_service if annual_debt_service > 0 else float('inf')
        
        return {
            'financing_type': financing.financing_type.value,
            'debt_amount_crores': round(debt_amount, 2),
            'equity_amount_crores': round(equity_amount, 2),
            'annual_debt_service_crores': round(annual_debt_service, 2),
            'annual_cash_to_equity_crores': round(annual_cash_to_equity, 2),
            'equity_roi_percentage': round(equity_roi, 2),
            'leveraged_irr_percentage': round(leveraged_irr * 100, 2),
            'debt_service_coverage_ratio': round(dscr, 2),
            'weighted_cost_of_capital': financing.weighted_cost_of_capital,
            'financing_advantage': round(equity_roi - base_analysis.get('roi_percentage', 15), 2)
        }
    
    def calculate_breakeven_analysis(self, base_analysis: dict) -> BreakEvenAnalysis:
        """Calculate comprehensive break-even analysis"""
        
        # Base parameters
        total_capex = base_analysis['total_capex']
        annual_opex = base_analysis['total_annual_opex']
        hydrogen_price = base_analysis['hydrogen_price_per_kg']
        annual_production = base_analysis['annual_production_tonnes']
        capacity_utilization = base_analysis.get('capacity_utilization', 0.85)
        
        # Break-even capacity utilization (keeping all else constant)
        fixed_costs = annual_opex * 0.6  # Assume 60% of OPEX is fixed
        variable_costs = annual_opex * 0.4  # 40% variable with production
        
        # Revenue per unit of capacity utilization
        max_production = annual_production / capacity_utilization
        revenue_per_utilization = max_production * 1000 * hydrogen_price
        variable_cost_per_utilization = variable_costs / capacity_utilization
        
        # Break-even utilization where NPV = 0 (simplified)
        required_annual_return = total_capex * 0.15  # 15% return requirement
        required_annual_cash_flow = fixed_costs + required_annual_return
        
        breakeven_utilization = required_annual_cash_flow / (revenue_per_utilization - variable_cost_per_utilization)
        breakeven_utilization = min(1.0, max(0.0, breakeven_utilization))
        
        # Break-even hydrogen price
        breakeven_price = (annual_opex + total_capex * 0.15) / (annual_production * 1000)
        
        # Break-even electricity cost (major OPEX component)
        electricity_portion = 0.4  # Assume 40% of OPEX is electricity
        current_electricity_cost = annual_opex * electricity_portion
        max_electricity_cost = current_electricity_cost + (hydrogen_price * annual_production * 1000 - annual_opex - total_capex * 0.15)
        
        # Sensitivity analysis
        capex_sensitivity = self._calculate_sensitivity_to_capex(base_analysis)
        opex_sensitivity = self._calculate_sensitivity_to_opex(base_analysis)
        
        # Margin of safety
        current_profit_margin = (hydrogen_price * annual_production * 1000 - annual_opex) / (hydrogen_price * annual_production * 1000)
        breakeven_margin = (breakeven_price * annual_production * 1000 - annual_opex) / (breakeven_price * annual_production * 1000)
        margin_of_safety = current_profit_margin - breakeven_margin
        
        return BreakEvenAnalysis(
            breakeven_capacity_utilization=round(breakeven_utilization * 100, 1),
            breakeven_hydrogen_price=round(breakeven_price, 0),
            breakeven_electricity_cost=round(max_electricity_cost / (annual_production * 1000), 2),
            sensitivity_to_capex=capex_sensitivity,
            sensitivity_to_opex=opex_sensitivity,
            margin_of_safety=round(margin_of_safety * 100, 1)
        )
    
    def _calculate_sensitivity_to_capex(self, base_analysis: dict) -> float:
        """Calculate sensitivity of NPV to CAPEX changes"""
        base_npv = base_analysis.get('npv_10_years', 0)
        capex_increase = base_analysis['total_capex'] * 0.1  # 10% increase
        
        # Simplified sensitivity: 10% CAPEX increase reduces NPV by the increase amount
        new_npv = base_npv - capex_increase
        sensitivity = ((new_npv - base_npv) / base_npv) * 100 if base_npv != 0 else 0
        
        return round(sensitivity / 10, 2)  # Sensitivity per 1% CAPEX change
    
    def _calculate_sensitivity_to_opex(self, base_analysis: dict) -> float:
        """Calculate sensitivity of NPV to OPEX changes"""
        base_npv = base_analysis.get('npv_10_years', 0)
        opex_increase = base_analysis['total_annual_opex'] * 0.1  # 10% increase
        
        # 10% OPEX increase affects NPV over 10 years
        discount_factor = 5.65  # Present value of annuity for 10 years at 12%
        npv_impact = opex_increase * discount_factor
        
        new_npv = base_npv - npv_impact
        sensitivity = ((new_npv - base_npv) / base_npv) * 100 if base_npv != 0 else 0
        
        return round(sensitivity / 10, 2)  # Sensitivity per 1% OPEX change
    
    def _calculate_npv(self, cash_flows: List[float], discount_rate: float) -> float:
        """Calculate Net Present Value"""
        npv = 0
        for i, cash_flow in enumerate(cash_flows):
            npv += cash_flow / ((1 + discount_rate) ** i)
        return npv
    
    def _calculate_irr(self, cash_flows: List[float]) -> float:
        """Calculate Internal Rate of Return using Newton-Raphson method"""
        if not cash_flows or len(cash_flows) < 2:
            return 0
        
        # Initial guess
        rate = 0.1
        
        for _ in range(100):  # Maximum iterations
            npv = sum(cf / ((1 + rate) ** i) for i, cf in enumerate(cash_flows))
            
            if abs(npv) < 1e-6:  # Convergence
                return rate
            
            # Derivative of NPV with respect to rate
            dnpv = sum(-i * cf / ((1 + rate) ** (i + 1)) for i, cf in enumerate(cash_flows))
            
            if abs(dnpv) < 1e-10:  # Avoid division by zero
                break
            
            rate = rate - npv / dnpv
            
            # Keep rate within reasonable bounds
            rate = max(-0.99, min(10.0, rate))
        
        return max(0, rate)  # Return 0 if negative or failed to converge
    
    def _calculate_payback_period(self, cash_flows: List[float]) -> float:
        """Calculate payback period"""
        if not cash_flows or cash_flows[0] >= 0:
            return 0
        
        cumulative = cash_flows[0]
        
        for i in range(1, len(cash_flows)):
            cumulative += cash_flows[i]
            if cumulative >= 0:
                # Linear interpolation for fractional year
                previous_cumulative = cumulative - cash_flows[i]
                fraction = -previous_cumulative / cash_flows[i]
                return i - 1 + fraction
        
        return len(cash_flows)  # Never pays back within the period
    
    def _assess_risk_level(self, npv: float, irr: float, payback_period: float) -> str:
        """Assess overall risk level based on financial metrics"""
        if npv > 50 and irr > 0.2 and payback_period < 5:
            return "Low Risk"
        elif npv > 20 and irr > 0.15 and payback_period < 7:
            return "Medium Risk"
        elif npv > 0 and irr > 0.1 and payback_period < 10:
            return "High Risk"
        else:
            return "Very High Risk"

def run_comprehensive_financial_analysis(base_analysis: dict) -> dict:
    """Run complete advanced financial analysis"""
    modeler = AdvancedFinancialModeler()
    
    # Run all analyses
    scenario_results = modeler.run_scenario_analysis(base_analysis)
    monte_carlo_results = modeler.run_monte_carlo_simulation(base_analysis)
    financing_results = modeler.analyze_financing_options(base_analysis)
    breakeven_results = modeler.calculate_breakeven_analysis(base_analysis)
    
    return {
        'scenario_analysis': {
            'optimistic': scenario_results[ScenarioType.OPTIMISTIC],
            'most_likely': scenario_results[ScenarioType.MOST_LIKELY],
            'pessimistic': scenario_results[ScenarioType.PESSIMISTIC]
        },
        'monte_carlo_simulation': {
            'mean_npv_crores': round(monte_carlo_results.mean_npv, 2),
            'npv_standard_deviation': round(monte_carlo_results.std_npv, 2),
            'probability_positive_npv': round(monte_carlo_results.probability_positive_npv * 100, 1),
            'npv_5th_percentile': round(monte_carlo_results.percentile_5_npv, 2),
            'npv_95th_percentile': round(monte_carlo_results.percentile_95_npv, 2),
            'mean_roi_percentage': round(monte_carlo_results.mean_roi, 2),
            'probability_roi_above_15_percent': round(monte_carlo_results.probability_roi_above_15 * 100, 1),
            'risk_adjusted_return_ratio': round(monte_carlo_results.risk_adjusted_return, 2)
        },
        'financing_options': {
            'equity_only': financing_results[FinancingType.EQUITY_ONLY],
            'debt_equity_70_30': financing_results[FinancingType.DEBT_EQUITY_70_30],
            'debt_equity_80_20': financing_results[FinancingType.DEBT_EQUITY_80_20],
            'project_finance': financing_results[FinancingType.PROJECT_FINANCE]
        },
        'breakeven_analysis': {
            'breakeven_capacity_utilization_percent': breakeven_results.breakeven_capacity_utilization,
            'breakeven_hydrogen_price_per_kg': breakeven_results.breakeven_hydrogen_price,
            'breakeven_electricity_cost_per_kwh': breakeven_results.breakeven_electricity_cost,
            'capex_sensitivity_per_percent': breakeven_results.sensitivity_to_capex,
            'opex_sensitivity_per_percent': breakeven_results.sensitivity_to_opex,
            'margin_of_safety_percent': breakeven_results.margin_of_safety
        }
    }
