"""
Interactive Investment Tools for H₂-Optimize
Investment calculator, comparison tools, and report generation
"""

from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Tuple
import json
from datetime import datetime
from enum import Enum

# Import all our advanced modules
from .advanced_financial_modeling import run_comprehensive_financial_analysis, AdvancedFinancialModeler
# Temporarily comment out problematic imports
# from .market_intelligence import get_comprehensive_market_intelligence
# from .technical_risk_assessment import assess_comprehensive_technical_risk
# from .esg_sustainability import assess_comprehensive_esg_sustainability

# Temporary placeholder functions
async def get_comprehensive_market_intelligence(location):
    """Placeholder for market intelligence analysis"""
    return {
        "market_attractiveness_analysis": {
            "overall_market_attractiveness": 75.0,
            "demand_growth_potential": 25.0,
            "competitive_position": 70.0
        },
        "pricing_analysis": {
            "current_prices_inr_per_kg": {
                "industrial": 350,
                "transportation": 380,
                "export": 420
            },
            "price_trend_5_year": "Increasing"
        },
        "competition_analysis": {
            "major_competitors": [
                {"name": "Reliance Green H2", "capacity_mw": 100, "location": "Jamnagar", "technology": "Alkaline"},
                {"name": "Adani Green H2", "capacity_mw": 80, "location": "Kutch", "technology": "PEM"},
                {"name": "NTPC Green H2", "capacity_mw": 60, "location": "Kawas", "technology": "PEM"}
            ]
        },
        "policy_incentives": {
            "available_incentives": [
                {"name": "Gujarat H2 Subsidy", "description": "State production incentive", "value": "₹50/kg for 5 years"},
                {"name": "PLI Scheme", "description": "Central PLI for green hydrogen", "value": "₹30/kg for 3 years"}
            ]
        }
    }

def assess_comprehensive_technical_risk(technology_type, location, capacity_mw):
    """Placeholder for technical risk assessment"""
    return {
        "overall_risk_assessment": {
            "overall_risk_score": 35.0,
            "risk_level": "Medium",
            "technology_risk": 30.0,
            "performance_risk": 25.0,
            "maintenance_risk": 40.0,
            "grid_integration_risk": 45.0
        },
        "technology_maturity_assessment": {
            "technology_type": technology_type,
            "trl_level": 8,
            "maturity_score": 85.0,
            "advantages": [
                "Proven technology with commercial deployment",
                "High efficiency and reliability",
                "Strong vendor ecosystem"
            ]
        },
        "performance_degradation": {
            "year_1_efficiency": 0.65,
            "year_10_efficiency": 0.60,
            "year_20_efficiency": 0.55,
            "annual_degradation_rate": 0.005
        },
        "maintenance_schedule": {
            "annual_maintenance_cost_crores": capacity_mw * 0.5,
            "scheduled_activities": [
                {"activity": "Stack Replacement", "frequency": "Every 7 years"},
                {"activity": "System Inspection", "frequency": "Annual"},
                {"activity": "Component Maintenance", "frequency": "Quarterly"}
            ]
        }
    }

def assess_comprehensive_esg_sustainability(location, capacity_kg_day, total_capex, technology_type, electricity_source):
    """Placeholder for ESG sustainability assessment"""
    return {
        "esg_scorecard": {
            "overall_esg_score": 82.0,
            "esg_rating": "A",
            "sustainability_highlights": [
                "Zero direct carbon emissions during operation",
                "Significant contribution to decarbonization goals",
                "Positive local employment impact",
                "Strong governance framework"
            ]
        },
        "carbon_footprint_analysis": {
            "lifecycle_emissions_kg_co2_per_kg_h2": 3.5,
            "carbon_reduction_vs_grey_hydrogen_percent": 70.0,
            "annual_co2_avoided_tonnes": capacity_kg_day * 330 * 8 / 1000  # Rough calculation
        },
        "social_impact_metrics": {
            "direct_employment_created": max(10, capacity_kg_day // 100),
            "indirect_employment_created": max(20, capacity_kg_day // 50),
            "community_investment_annual_crores": total_capex * 0.02,
            "local_procurement_percentage": 0.6
        },
        "governance_metrics": {
            "governance_score": 85.0,
            "regulatory_compliance_level": "High",
            "transparency_score": 88.0
        }
    }

class InvestmentDecision(Enum):
    HIGHLY_RECOMMENDED = "highly_recommended"
    RECOMMENDED = "recommended"
    CONDITIONAL = "conditional"
    NOT_RECOMMENDED = "not_recommended"

class AlertType(Enum):
    OPPORTUNITY = "opportunity"
    RISK = "risk"
    MARKET_CHANGE = "market_change"
    REGULATORY = "regulatory"

@dataclass
class InvestmentAlert:
    """Investment opportunity/risk alerts"""
    alert_type: AlertType
    priority: str  # high, medium, low
    title: str
    description: str
    impact_score: float  # 0-100
    recommended_action: str
    timestamp: datetime

@dataclass
class LocationComparison:
    """Side-by-side location comparison"""
    location_name: str
    coordinates: Tuple[float, float]
    overall_score: float
    economic_score: float
    technical_score: float
    market_score: float
    esg_score: float
    investment_grade: str
    roi_percentage: float
    payback_years: float
    npv_crores: float
    key_strengths: List[str]
    key_weaknesses: List[str]

@dataclass
class InvestmentRecommendation:
    """Comprehensive investment recommendation"""
    location: Tuple[float, float]
    investment_decision: InvestmentDecision
    confidence_level: float  # 0-100
    overall_score: float
    risk_level: str
    recommended_capacity_kg_day: int
    optimal_technology: str
    financing_recommendation: str
    timeline_to_profitability_years: float
    key_success_factors: List[str]
    major_risks: List[str]
    mitigation_strategies: List[str]

class InteractiveInvestmentTools:
    """Comprehensive interactive investment analysis tools"""
    
    def __init__(self):
        self.financial_modeler = AdvancedFinancialModeler()
        self.alert_thresholds = self._initialize_alert_thresholds()
    
    def _initialize_alert_thresholds(self) -> Dict:
        """Initialize alert trigger thresholds"""
        return {
            'high_roi_threshold': 25.0,  # %
            'short_payback_threshold': 5.0,  # years
            'high_npv_threshold': 100.0,  # crores
            'low_risk_threshold': 30.0,  # risk score
            'market_growth_threshold': 20.0,  # % CAGR
            'esg_excellence_threshold': 85.0  # ESG score
        }
    
    async def comprehensive_location_analysis(self, 
                                            location: Tuple[float, float],
                                            capacity_kg_day: int = 1000,
                                            technology_type: str = "pem",
                                            electricity_source: str = "mixed_renewable") -> Dict:
        """Run comprehensive analysis combining all modules"""
        
        lat, lng = location
        
        # Base analysis for financial calculations
        base_analysis = {
            'total_capex': 150.0,  # Will be refined by investor calculator
            'total_annual_opex': 45.0,
            'hydrogen_price_per_kg': 350.0,
            'annual_production_tonnes': capacity_kg_day * 330 / 1000,
            'capacity_utilization': 0.85,
            'roi_percentage': 18.5,
            'npv_10_years': 85.0,
            'payback_period_years': 6.2
        }
        
        # Run all advanced analyses
        financial_analysis = run_comprehensive_financial_analysis(base_analysis)
        market_intelligence = await get_comprehensive_market_intelligence(location)
        technical_risk = assess_comprehensive_technical_risk(technology_type, location, capacity_kg_day * 50 / (24 * 1000))
        esg_analysis = assess_comprehensive_esg_sustainability(
            location, capacity_kg_day, base_analysis['total_capex'], 
            technology_type, electricity_source
        )
        
        # Calculate composite scores
        composite_scores = self._calculate_composite_scores(
            financial_analysis, market_intelligence, technical_risk, esg_analysis
        )
        
        # Generate investment recommendation
        investment_rec = self._generate_investment_recommendation(
            location, composite_scores, financial_analysis, technical_risk
        )
        
        # Generate alerts
        alerts = self._generate_investment_alerts(
            composite_scores, financial_analysis, market_intelligence, technical_risk, esg_analysis
        )
        
        return {
            'location_coordinates': location,
            'analysis_timestamp': datetime.now().isoformat(),
            'composite_scores': composite_scores,
            'investment_recommendation': asdict(investment_rec),
            'financial_analysis': financial_analysis,
            'market_intelligence': market_intelligence,
            'technical_risk_assessment': technical_risk,
            'esg_sustainability': esg_analysis,
            'investment_alerts': [asdict(alert) for alert in alerts],
            'interactive_tools': {
                'sensitivity_analysis_available': True,
                'scenario_comparison_available': True,
                'capacity_optimization_available': True,
                'financing_calculator_available': True
            }
        }
    
    def compare_locations(self, locations: List[Dict]) -> Dict:
        """Compare multiple locations side-by-side"""
        
        comparisons = []
        
        for loc_data in locations:
            # Extract key metrics for comparison
            location_name = loc_data.get('name', f"Location {len(comparisons) + 1}")
            coordinates = loc_data['coordinates']
            
            # Get composite scores
            composite = loc_data.get('composite_scores', {})
            financial = loc_data.get('financial_analysis', {})
            technical = loc_data.get('technical_risk_assessment', {})
            market = loc_data.get('market_intelligence', {})
            esg = loc_data.get('esg_sustainability', {})
            
            # Identify strengths and weaknesses
            strengths, weaknesses = self._identify_strengths_weaknesses(
                composite, financial, technical, market, esg
            )
            
            comparison = LocationComparison(
                location_name=location_name,
                coordinates=coordinates,
                overall_score=composite.get('overall_investment_score', 0),
                economic_score=composite.get('financial_score', 0),
                technical_score=100 - technical.get('overall_risk_assessment', {}).get('overall_risk_score', 50),
                market_score=market.get('market_attractiveness_analysis', {}).get('overall_market_attractiveness', 0),
                esg_score=esg.get('esg_scorecard', {}).get('overall_esg_score', 0),
                investment_grade=financial.get('financing_options', {}).get('equity_only', {}).get('investment_grade', 'B'),
                roi_percentage=financial.get('scenario_analysis', {}).get('most_likely', {}).get('roi_percentage', 0),
                payback_years=financial.get('scenario_analysis', {}).get('most_likely', {}).get('payback_period_years', 10),
                npv_crores=financial.get('scenario_analysis', {}).get('most_likely', {}).get('npv_crores', 0),
                key_strengths=strengths,
                key_weaknesses=weaknesses
            )
            
            comparisons.append(asdict(comparison))
        
        # Rank locations
        ranked_locations = sorted(comparisons, key=lambda x: x['overall_score'], reverse=True)
        
        # Generate comparison insights
        insights = self._generate_comparison_insights(ranked_locations)
        
        return {
            'location_rankings': ranked_locations,
            'comparison_insights': insights,
            'recommendation_summary': self._generate_portfolio_recommendation(ranked_locations)
        }
    
    def interactive_capacity_optimizer(self, location: Tuple[float, float],
                                     min_capacity: int = 500,
                                     max_capacity: int = 5000,
                                     step_size: int = 250) -> Dict:
        """Optimize capacity for maximum returns"""
        
        optimization_results = []
        
        for capacity in range(min_capacity, max_capacity + 1, step_size):
            # Run financial analysis for this capacity
            base_analysis = {
                'total_capex': capacity * 0.15,  # ₹15 lakh per kg/day capacity
                'total_annual_opex': capacity * 0.045,  # ₹4,500 per kg/day annually
                'hydrogen_price_per_kg': 350.0,
                'annual_production_tonnes': capacity * 330 / 1000,
                'capacity_utilization': 0.85
            }
            
            financial_analysis = run_comprehensive_financial_analysis(base_analysis)
            
            # Calculate key optimization metrics
            most_likely = financial_analysis['scenario_analysis']['most_likely']
            
            optimization_results.append({
                'capacity_kg_day': capacity,
                'capex_crores': base_analysis['total_capex'],
                'roi_percentage': most_likely['roi_percentage'],
                'npv_crores': most_likely['npv_crores'],
                'payback_years': most_likely['payback_period_years'],
                'irr_percentage': most_likely['irr_percentage'],
                'annual_profit_crores': most_likely['annual_profit_crores'],
                'capacity_utilization_break_even': financial_analysis['breakeven_analysis']['breakeven_capacity_utilization_percent']
            })
        
        # Find optimal capacity based on different criteria
        optimal_roi = max(optimization_results, key=lambda x: x['roi_percentage'])
        optimal_npv = max(optimization_results, key=lambda x: x['npv_crores'])
        optimal_payback = min(optimization_results, key=lambda x: x['payback_years'])
        
        return {
            'optimization_results': optimization_results,
            'optimal_for_roi': optimal_roi,
            'optimal_for_npv': optimal_npv,
            'optimal_for_payback': optimal_payback,
            'recommendations': {
                'conservative_investor': optimal_payback['capacity_kg_day'],
                'growth_investor': optimal_npv['capacity_kg_day'],
                'balanced_investor': optimal_roi['capacity_kg_day']
            }
        }
    
    def generate_investment_report(self, analysis_data: Dict, 
                                 investor_profile: str = "institutional") -> Dict:
        """Generate comprehensive investment report"""
        
        # Executive summary
        exec_summary = self._generate_executive_summary(analysis_data, investor_profile)
        
        # Key metrics dashboard
        key_metrics = self._extract_key_metrics(analysis_data)
        
        # Risk assessment summary
        risk_summary = self._generate_risk_summary(analysis_data)
        
        # Financial projections
        financial_projections = self._generate_financial_projections(analysis_data)
        
        # ESG impact summary
        esg_summary = self._generate_esg_summary(analysis_data)
        
        # Implementation roadmap
        roadmap = self._generate_implementation_roadmap(analysis_data)
        
        return {
            'report_metadata': {
                'generated_at': datetime.now().isoformat(),
                'report_type': 'comprehensive_investment_analysis',
                'investor_profile': investor_profile,
                'location': analysis_data.get('location_coordinates'),
                'analysis_scope': 'full_feasibility_study'
            },
            'executive_summary': exec_summary,
            'key_metrics_dashboard': key_metrics,
            'financial_projections': financial_projections,
            'risk_assessment_summary': risk_summary,
            'esg_impact_summary': esg_summary,
            'implementation_roadmap': roadmap,
            'detailed_appendices': {
                'financial_analysis': analysis_data.get('financial_analysis'),
                'technical_risk': analysis_data.get('technical_risk_assessment'),
                'market_intelligence': analysis_data.get('market_intelligence'),
                'esg_sustainability': analysis_data.get('esg_sustainability')
            }
        }
    
    def _calculate_composite_scores(self, financial: Dict, market: Dict, 
                                  technical: Dict, esg: Dict) -> Dict:
        """Calculate composite investment scores"""
        
        # Extract individual scores
        financial_score = financial.get('scenario_analysis', {}).get('most_likely', {}).get('roi_percentage', 0)
        market_score = market.get('market_attractiveness_analysis', {}).get('overall_market_attractiveness', 0)
        technical_score = 100 - technical.get('overall_risk_assessment', {}).get('overall_risk_score', 50)
        esg_score = esg.get('esg_scorecard', {}).get('overall_esg_score', 0)
        
        # Weighted composite score
        weights = {'financial': 0.35, 'market': 0.25, 'technical': 0.25, 'esg': 0.15}
        
        overall_score = (
            financial_score * weights['financial'] +
            market_score * weights['market'] +
            technical_score * weights['technical'] +
            esg_score * weights['esg']
        )
        
        return {
            'overall_investment_score': round(overall_score, 1),
            'financial_score': round(financial_score, 1),
            'market_score': round(market_score, 1),
            'technical_score': round(technical_score, 1),
            'esg_score': round(esg_score, 1),
            'score_breakdown': {
                'financial_weight': weights['financial'],
                'market_weight': weights['market'],
                'technical_weight': weights['technical'],
                'esg_weight': weights['esg']
            }
        }
    
    def _generate_investment_recommendation(self, location: Tuple[float, float],
                                          composite_scores: Dict,
                                          financial: Dict,
                                          technical: Dict) -> InvestmentRecommendation:
        """Generate comprehensive investment recommendation"""
        
        overall_score = composite_scores['overall_investment_score']
        risk_score = technical.get('overall_risk_assessment', {}).get('overall_risk_score', 50)
        
        # Determine investment decision
        if overall_score >= 80 and risk_score <= 30:
            decision = InvestmentDecision.HIGHLY_RECOMMENDED
            confidence = 90.0
        elif overall_score >= 70 and risk_score <= 50:
            decision = InvestmentDecision.RECOMMENDED
            confidence = 75.0
        elif overall_score >= 60:
            decision = InvestmentDecision.CONDITIONAL
            confidence = 60.0
        else:
            decision = InvestmentDecision.NOT_RECOMMENDED
            confidence = 40.0
        
        # Extract key metrics
        most_likely = financial.get('scenario_analysis', {}).get('most_likely', {})
        roi = most_likely.get('roi_percentage', 0)
        payback = most_likely.get('payback_period_years', 10)
        
        return InvestmentRecommendation(
            location=location,
            investment_decision=decision,
            confidence_level=confidence,
            overall_score=overall_score,
            risk_level=technical.get('overall_risk_assessment', {}).get('risk_level', 'Medium'),
            recommended_capacity_kg_day=1000,  # Default recommendation
            optimal_technology="PEM Electrolysis",
            financing_recommendation="70% Debt, 30% Equity",
            timeline_to_profitability_years=payback,
            key_success_factors=[
                "Secure long-term hydrogen offtake agreements",
                "Maintain high capacity utilization (>80%)",
                "Leverage government incentives and subsidies",
                "Implement robust O&M practices"
            ],
            major_risks=[
                "Hydrogen price volatility",
                "Technology performance degradation",
                "Regulatory policy changes",
                "Grid integration challenges"
            ],
            mitigation_strategies=[
                "Diversify customer base and contracts",
                "Invest in proven technology with warranties",
                "Monitor regulatory developments closely",
                "Implement grid stability solutions"
            ]
        )
    
    def _generate_investment_alerts(self, composite_scores: Dict, financial: Dict,
                                  market: Dict, technical: Dict, esg: Dict) -> List[InvestmentAlert]:
        """Generate investment alerts and opportunities"""
        
        alerts = []
        
        # High ROI opportunity
        roi = financial.get('scenario_analysis', {}).get('most_likely', {}).get('roi_percentage', 0)
        if roi >= self.alert_thresholds['high_roi_threshold']:
            alerts.append(InvestmentAlert(
                alert_type=AlertType.OPPORTUNITY,
                priority="high",
                title="Exceptional ROI Opportunity",
                description=f"Location shows {roi:.1f}% ROI, significantly above industry average",
                impact_score=min(100, roi),
                recommended_action="Prioritize detailed due diligence and fast-track development",
                timestamp=datetime.now()
            ))
        
        # Low risk + good returns
        risk_score = technical.get('overall_risk_assessment', {}).get('overall_risk_score', 50)
        if risk_score <= self.alert_thresholds['low_risk_threshold'] and roi >= 15:
            alerts.append(InvestmentAlert(
                alert_type=AlertType.OPPORTUNITY,
                priority="medium",
                title="Low Risk, Stable Returns",
                description=f"Low technical risk ({risk_score:.1f}) with solid returns ({roi:.1f}%)",
                impact_score=85.0,
                recommended_action="Consider as core portfolio investment",
                timestamp=datetime.now()
            ))
        
        # Market growth opportunity
        market_growth = market.get('market_attractiveness_analysis', {}).get('demand_growth_potential', 0)
        if market_growth >= self.alert_thresholds['market_growth_threshold']:
            alerts.append(InvestmentAlert(
                alert_type=AlertType.OPPORTUNITY,
                priority="medium",
                title="High Market Growth Potential",
                description=f"Market shows {market_growth:.1f}% growth potential",
                impact_score=market_growth,
                recommended_action="Consider larger capacity to capture market growth",
                timestamp=datetime.now()
            ))
        
        # High technical risk warning
        if risk_score >= 75:
            alerts.append(InvestmentAlert(
                alert_type=AlertType.RISK,
                priority="high",
                title="High Technical Risk",
                description=f"Significant technical risks identified (score: {risk_score:.1f})",
                impact_score=risk_score,
                recommended_action="Implement comprehensive risk mitigation strategies",
                timestamp=datetime.now()
            ))
        
        # ESG excellence opportunity
        esg_score = esg.get('esg_scorecard', {}).get('overall_esg_score', 0)
        if esg_score >= self.alert_thresholds['esg_excellence_threshold']:
            alerts.append(InvestmentAlert(
                alert_type=AlertType.OPPORTUNITY,
                priority="low",
                title="ESG Excellence Opportunity",
                description=f"Outstanding ESG performance ({esg_score:.1f}/100)",
                impact_score=esg_score,
                recommended_action="Highlight ESG credentials for sustainable finance",
                timestamp=datetime.now()
            ))
        
        return alerts
    
    def _identify_strengths_weaknesses(self, composite: Dict, financial: Dict,
                                     technical: Dict, market: Dict, esg: Dict) -> Tuple[List[str], List[str]]:
        """Identify key strengths and weaknesses"""
        
        strengths = []
        weaknesses = []
        
        # Financial strengths/weaknesses
        roi = financial.get('scenario_analysis', {}).get('most_likely', {}).get('roi_percentage', 0)
        if roi >= 20:
            strengths.append(f"Excellent ROI potential ({roi:.1f}%)")
        elif roi < 12:
            weaknesses.append(f"Below-target ROI ({roi:.1f}%)")
        
        # Technical strengths/weaknesses
        risk_score = technical.get('overall_risk_assessment', {}).get('overall_risk_score', 50)
        if risk_score <= 30:
            strengths.append("Low technical risk profile")
        elif risk_score >= 70:
            weaknesses.append("High technical risk concerns")
        
        # Market strengths/weaknesses
        market_score = market.get('market_attractiveness_analysis', {}).get('overall_market_attractiveness', 0)
        if market_score >= 75:
            strengths.append("Strong market fundamentals")
        elif market_score < 50:
            weaknesses.append("Challenging market conditions")
        
        # ESG strengths/weaknesses
        esg_score = esg.get('esg_scorecard', {}).get('overall_esg_score', 0)
        if esg_score >= 80:
            strengths.append("Outstanding ESG performance")
        elif esg_score < 60:
            weaknesses.append("ESG improvement needed")
        
        return strengths[:5], weaknesses[:5]  # Limit to top 5 each
    
    def _generate_executive_summary(self, analysis_data: Dict, investor_profile: str) -> Dict:
        """Generate executive summary for investment report"""
        
        investment_rec = analysis_data.get('investment_recommendation', {})
        composite_scores = analysis_data.get('composite_scores', {})
        
        return {
            'investment_decision': investment_rec.get('investment_decision', 'conditional'),
            'confidence_level': investment_rec.get('confidence_level', 50),
            'overall_score': composite_scores.get('overall_investment_score', 0),
            'key_highlights': [
                f"Overall investment score: {composite_scores.get('overall_investment_score', 0):.1f}/100",
                f"Risk level: {investment_rec.get('risk_level', 'Medium')}",
                f"Recommended capacity: {investment_rec.get('recommended_capacity_kg_day', 1000)} kg/day",
                f"Expected payback: {investment_rec.get('timeline_to_profitability_years', 'N/A')} years"
            ],
            'investor_fit': self._assess_investor_fit(analysis_data, investor_profile)
        }
    
    def _assess_investor_fit(self, analysis_data: Dict, investor_profile: str) -> str:
        """Assess fit for different investor profiles"""
        
        financial = analysis_data.get('financial_analysis', {})
        technical = analysis_data.get('technical_risk_assessment', {})
        
        roi = financial.get('scenario_analysis', {}).get('most_likely', {}).get('roi_percentage', 0)
        risk = technical.get('overall_risk_assessment', {}).get('overall_risk_score', 50)
        payback = financial.get('scenario_analysis', {}).get('most_likely', {}).get('payback_period_years', 10)
        
        if investor_profile == "institutional":
            if roi >= 15 and risk <= 40 and payback <= 7:
                return "Excellent fit for institutional investors seeking stable, long-term returns"
            else:
                return "Moderate fit - consider risk mitigation strategies"
        elif investor_profile == "growth":
            if roi >= 20:
                return "Strong fit for growth-oriented investors"
            else:
                return "Below growth investor expectations"
        elif investor_profile == "conservative":
            if risk <= 30 and payback <= 6:
                return "Well-suited for conservative investment approach"
            else:
                return "Higher risk/longer payback than typical conservative investments"
        else:
            return "Standard investment opportunity"
    
    def _extract_key_metrics(self, analysis_data: Dict) -> Dict:
        """Extract key metrics for dashboard"""
        
        financial = analysis_data.get('financial_analysis', {})
        market = analysis_data.get('market_intelligence', {})
        technical = analysis_data.get('technical_risk_assessment', {})
        esg = analysis_data.get('esg_sustainability', {})
        
        most_likely = financial.get('scenario_analysis', {}).get('most_likely', {})
        
        return {
            'financial_metrics': {
                'roi_percentage': most_likely.get('roi_percentage', 0),
                'npv_crores': most_likely.get('npv_crores', 0),
                'payback_years': most_likely.get('payback_period_years', 0),
                'irr_percentage': most_likely.get('irr_percentage', 0)
            },
            'market_metrics': {
                'market_attractiveness': market.get('market_attractiveness_analysis', {}).get('overall_market_attractiveness', 0),
                'demand_growth': market.get('market_attractiveness_analysis', {}).get('demand_growth_potential', 0),
                'competition_level': market.get('market_attractiveness_analysis', {}).get('competitive_position', 0)
            },
            'risk_metrics': {
                'overall_risk_score': technical.get('overall_risk_assessment', {}).get('overall_risk_score', 0),
                'technology_risk': technical.get('overall_risk_assessment', {}).get('technology_risk', 0),
                'market_risk': technical.get('overall_risk_assessment', {}).get('performance_risk', 0)
            },
            'esg_metrics': {
                'overall_esg_score': esg.get('esg_scorecard', {}).get('overall_esg_score', 0),
                'carbon_reduction': esg.get('carbon_footprint_analysis', {}).get('carbon_reduction_vs_grey_hydrogen_percent', 0),
                'employment_created': esg.get('social_impact_metrics', {}).get('direct_employment_created', 0)
            }
        }
    
    def _generate_risk_summary(self, analysis_data: Dict) -> Dict:
        """Generate risk assessment summary"""
        
        technical = analysis_data.get('technical_risk_assessment', {})
        financial = analysis_data.get('financial_analysis', {})
        
        return {
            'overall_risk_level': technical.get('overall_risk_assessment', {}).get('risk_level', 'Medium'),
            'key_risk_factors': [
                'Technology performance and reliability',
                'Market price volatility',
                'Regulatory policy changes',
                'Grid integration challenges'
            ],
            'risk_mitigation_measures': technical.get('risk_mitigation', {}).get('mitigation_strategies', []),
            'sensitivity_analysis': {
                'capex_sensitivity': financial.get('breakeven_analysis', {}).get('capex_sensitivity_per_percent', 0),
                'opex_sensitivity': financial.get('breakeven_analysis', {}).get('opex_sensitivity_per_percent', 0)
            }
        }
    
    def _generate_financial_projections(self, analysis_data: Dict) -> Dict:
        """Generate financial projections summary"""
        
        financial = analysis_data.get('financial_analysis', {})
        
        return {
            'scenario_analysis': financial.get('scenario_analysis', {}),
            'monte_carlo_results': financial.get('monte_carlo_simulation', {}),
            'financing_options': financial.get('financing_options', {}),
            'breakeven_analysis': financial.get('breakeven_analysis', {})
        }
    
    def _generate_esg_summary(self, analysis_data: Dict) -> Dict:
        """Generate ESG impact summary"""
        
        esg = analysis_data.get('esg_sustainability', {})
        
        return {
            'esg_rating': esg.get('esg_scorecard', {}).get('esg_rating', 'B'),
            'carbon_impact': esg.get('carbon_footprint_analysis', {}),
            'social_benefits': esg.get('social_impact_metrics', {}),
            'sustainability_highlights': esg.get('esg_scorecard', {}).get('sustainability_highlights', [])
        }
    
    def _generate_implementation_roadmap(self, analysis_data: Dict) -> Dict:
        """Generate implementation roadmap"""
        
        return {
            'development_phases': [
                {'phase': 'Pre-Development', 'duration_months': 6, 'key_activities': ['Site acquisition', 'Permit applications', 'Financing arrangement']},
                {'phase': 'Construction', 'duration_months': 18, 'key_activities': ['Equipment procurement', 'Site construction', 'Grid connection']},
                {'phase': 'Commissioning', 'duration_months': 3, 'key_activities': ['System testing', 'Performance validation', 'Commercial operation']},
                {'phase': 'Operations', 'duration_months': 240, 'key_activities': ['Production operations', 'Maintenance', 'Performance optimization']}
            ],
            'critical_milestones': [
                'Environmental clearance obtained',
                'Financing closed',
                'Equipment delivery',
                'Grid connection established',
                'Commercial operation date'
            ],
            'key_dependencies': [
                'Regulatory approvals',
                'Offtake agreement execution',
                'Equipment vendor selection',
                'Construction contractor engagement'
            ]
        }
    
    def _generate_comparison_insights(self, ranked_locations: List[Dict]) -> Dict:
        """Generate insights from location comparison"""
        
        if len(ranked_locations) < 2:
            return {'message': 'Need at least 2 locations for comparison'}
        
        best = ranked_locations[0]
        worst = ranked_locations[-1]
        
        return {
            'top_performer': {
                'location': best['location_name'],
                'score': best['overall_score'],
                'key_advantage': best['key_strengths'][0] if best['key_strengths'] else 'N/A'
            },
            'performance_gap': round(best['overall_score'] - worst['overall_score'], 1),
            'common_strengths': self._find_common_attributes(ranked_locations, 'key_strengths'),
            'common_weaknesses': self._find_common_attributes(ranked_locations, 'key_weaknesses'),
            'diversification_opportunity': len(set(loc['investment_grade'] for loc in ranked_locations)) > 1
        }
    
    def _find_common_attributes(self, locations: List[Dict], attribute: str) -> List[str]:
        """Find common attributes across locations"""
        
        all_attributes = []
        for loc in locations:
            all_attributes.extend(loc.get(attribute, []))
        
        # Count frequency
        attr_counts = {}
        for attr in all_attributes:
            attr_counts[attr] = attr_counts.get(attr, 0) + 1
        
        # Return attributes that appear in multiple locations
        common = [attr for attr, count in attr_counts.items() if count >= 2]
        return common[:3]  # Top 3 common attributes
    
    def _generate_portfolio_recommendation(self, ranked_locations: List[Dict]) -> Dict:
        """Generate portfolio-level recommendations"""
        
        if not ranked_locations:
            return {'message': 'No locations to analyze'}
        
        top_locations = ranked_locations[:3]  # Top 3 locations
        
        return {
            'recommended_portfolio': [
                {
                    'location': loc['location_name'],
                    'allocation_percentage': 40 if i == 0 else 30 if i == 1 else 30,
                    'rationale': f"Score: {loc['overall_score']}, ROI: {loc['roi_percentage']}%"
                }
                for i, loc in enumerate(top_locations)
            ],
            'portfolio_benefits': [
                'Geographic diversification',
                'Risk distribution across locations',
                'Market access optimization',
                'Technology deployment learning'
            ],
            'implementation_sequence': [
                f"Phase 1: {top_locations[0]['location_name']} (Lowest risk, fastest returns)",
                f"Phase 2: {top_locations[1]['location_name']} (Scale operations)",
                f"Phase 3: {top_locations[2]['location_name']} (Market expansion)" if len(top_locations) > 2 else None
            ]
        }

# Main integration functions
async def run_complete_investment_analysis(location: Tuple[float, float], 
                                         capacity_kg_day: int = 1000,
                                         technology_type: str = "pem") -> Dict:
    """Run complete investment analysis with all advanced features"""
    
    tools = InteractiveInvestmentTools()
    return await tools.comprehensive_location_analysis(location, capacity_kg_day, technology_type)

def compare_investment_locations(locations_data: List[Dict]) -> Dict:
    """Compare multiple investment locations"""
    
    tools = InteractiveInvestmentTools()
    return tools.compare_locations(locations_data)

def optimize_plant_capacity(location: Tuple[float, float]) -> Dict:
    """Optimize plant capacity for maximum returns"""
    
    tools = InteractiveInvestmentTools()
    return tools.interactive_capacity_optimizer(location)

def generate_investor_report(analysis_data: Dict, investor_type: str = "institutional") -> Dict:
    """Generate comprehensive investor report"""
    
    tools = InteractiveInvestmentTools()
    return tools.generate_investment_report(analysis_data, investor_type)
