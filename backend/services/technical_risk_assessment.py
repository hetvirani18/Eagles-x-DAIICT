"""
Technical Risk Assessment for H₂-Optimize
Technology maturity, performance degradation, and maintenance analysis
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from enum import Enum
import math

class TechnologyType(Enum):
    ALKALINE_ELECTROLYSIS = "alkaline"
    PEM_ELECTROLYSIS = "pem"
    SOLID_OXIDE_ELECTROLYSIS = "soec"
    ANION_EXCHANGE_MEMBRANE = "aem"

class RiskLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class TechnologyMaturityAssessment:
    """Technology readiness and maturity analysis"""
    technology_type: TechnologyType
    trl_level: int  # Technology Readiness Level 1-9
    commercial_deployments: int
    largest_deployment_mw: float
    reliability_factor: float  # 0-1
    efficiency_current: float  # %
    efficiency_degradation_rate: float  # % per year
    maintenance_intensity: str  # low, medium, high
    supply_chain_maturity: float  # 0-1
    cost_reduction_potential: float  # % over 10 years

@dataclass
class PerformanceDegradation:
    """Equipment performance degradation over time"""
    component: str
    initial_efficiency: float
    annual_degradation_rate: float
    degradation_acceleration_factor: float  # How degradation accelerates over time
    maintenance_restoration_factor: float  # How much maintenance restores performance
    replacement_threshold: float  # Efficiency level requiring replacement
    expected_lifetime_years: float

@dataclass
class MaintenanceSchedule:
    """Predictive maintenance scheduling and costs"""
    component: str
    routine_maintenance_interval_hours: int
    major_overhaul_interval_hours: int
    routine_cost_per_event: float
    major_overhaul_cost_per_event: float
    unplanned_maintenance_probability: float  # Per year
    unplanned_maintenance_cost: float
    downtime_hours_routine: int
    downtime_hours_major: int
    downtime_hours_unplanned: int

@dataclass
class GridIntegrationRisk:
    """Power grid integration and stability risks"""
    grid_stability_score: float  # 0-100
    power_quality_issues: List[str]
    grid_congestion_risk: float  # 0-1
    renewable_penetration: float  # % of renewable energy
    grid_flexibility_score: float  # 0-100
    transmission_constraints: bool
    backup_power_required: bool
    grid_connection_cost: float

@dataclass
class TechnicalRiskProfile:
    """Comprehensive technical risk assessment"""
    overall_risk_score: float  # 0-100
    technology_risk: float
    performance_risk: float
    maintenance_risk: float
    grid_integration_risk: float
    risk_mitigation_strategies: List[str]
    recommended_actions: List[str]

class TechnicalRiskAssessment:
    """Comprehensive technical risk assessment engine"""
    
    def __init__(self):
        self.technology_database = self._initialize_technology_database()
        self.degradation_models = self._initialize_degradation_models()
        self.maintenance_schedules = self._initialize_maintenance_schedules()
    
    def _initialize_technology_database(self) -> Dict[TechnologyType, TechnologyMaturityAssessment]:
        """Initialize technology maturity database"""
        return {
            TechnologyType.ALKALINE_ELECTROLYSIS: TechnologyMaturityAssessment(
                technology_type=TechnologyType.ALKALINE_ELECTROLYSIS,
                trl_level=9,  # Fully commercial
                commercial_deployments=150,
                largest_deployment_mw=20,
                reliability_factor=0.92,
                efficiency_current=65.0,
                efficiency_degradation_rate=0.5,  # % per year
                maintenance_intensity="medium",
                supply_chain_maturity=0.85,
                cost_reduction_potential=25.0
            ),
            TechnologyType.PEM_ELECTROLYSIS: TechnologyMaturityAssessment(
                technology_type=TechnologyType.PEM_ELECTROLYSIS,
                trl_level=8,  # Commercial with some limitations
                commercial_deployments=85,
                largest_deployment_mw=10,
                reliability_factor=0.88,
                efficiency_current=70.0,
                efficiency_degradation_rate=0.8,
                maintenance_intensity="medium",
                supply_chain_maturity=0.75,
                cost_reduction_potential=35.0
            ),
            TechnologyType.SOLID_OXIDE_ELECTROLYSIS: TechnologyMaturityAssessment(
                technology_type=TechnologyType.SOLID_OXIDE_ELECTROLYSIS,
                trl_level=6,  # Demonstration scale
                commercial_deployments=12,
                largest_deployment_mw=2,
                reliability_factor=0.75,
                efficiency_current=85.0,
                efficiency_degradation_rate=1.2,
                maintenance_intensity="high",
                supply_chain_maturity=0.45,
                cost_reduction_potential=50.0
            ),
            TechnologyType.ANION_EXCHANGE_MEMBRANE: TechnologyMaturityAssessment(
                technology_type=TechnologyType.ANION_EXCHANGE_MEMBRANE,
                trl_level=5,  # Laboratory/pilot scale
                commercial_deployments=3,
                largest_deployment_mw=0.5,
                reliability_factor=0.70,
                efficiency_current=68.0,
                efficiency_degradation_rate=1.0,
                maintenance_intensity="high",
                supply_chain_maturity=0.30,
                cost_reduction_potential=60.0
            )
        }
    
    def _initialize_degradation_models(self) -> Dict[str, PerformanceDegradation]:
        """Initialize performance degradation models"""
        return {
            'electrolyzer_stack': PerformanceDegradation(
                component='electrolyzer_stack',
                initial_efficiency=70.0,
                annual_degradation_rate=0.6,  # % per year
                degradation_acceleration_factor=1.02,  # Slight acceleration over time
                maintenance_restoration_factor=0.3,  # 30% restoration from maintenance
                replacement_threshold=55.0,  # Replace when efficiency drops to 55%
                expected_lifetime_years=15.0
            ),
            'power_electronics': PerformanceDegradation(
                component='power_electronics',
                initial_efficiency=95.0,
                annual_degradation_rate=0.2,
                degradation_acceleration_factor=1.01,
                maintenance_restoration_factor=0.8,
                replacement_threshold=88.0,
                expected_lifetime_years=20.0
            ),
            'gas_separation': PerformanceDegradation(
                component='gas_separation',
                initial_efficiency=99.5,
                annual_degradation_rate=0.1,
                degradation_acceleration_factor=1.005,
                maintenance_restoration_factor=0.9,
                replacement_threshold=97.0,
                expected_lifetime_years=25.0
            ),
            'compression_system': PerformanceDegradation(
                component='compression_system',
                initial_efficiency=85.0,
                annual_degradation_rate=0.8,
                degradation_acceleration_factor=1.03,
                maintenance_restoration_factor=0.7,
                replacement_threshold=70.0,
                expected_lifetime_years=12.0
            ),
            'control_systems': PerformanceDegradation(
                component='control_systems',
                initial_efficiency=98.0,
                annual_degradation_rate=0.3,
                degradation_acceleration_factor=1.02,
                maintenance_restoration_factor=0.95,
                replacement_threshold=92.0,
                expected_lifetime_years=18.0
            )
        }
    
    def _initialize_maintenance_schedules(self) -> Dict[str, MaintenanceSchedule]:
        """Initialize maintenance schedules for different components"""
        return {
            'electrolyzer_stack': MaintenanceSchedule(
                component='electrolyzer_stack',
                routine_maintenance_interval_hours=2000,  # Every ~3 months
                major_overhaul_interval_hours=16000,  # Every ~2 years
                routine_cost_per_event=1.5,  # ₹1.5 lakh
                major_overhaul_cost_per_event=25.0,  # ₹25 lakh
                unplanned_maintenance_probability=0.15,  # 15% chance per year
                unplanned_maintenance_cost=8.0,  # ₹8 lakh average
                downtime_hours_routine=24,
                downtime_hours_major=120,
                downtime_hours_unplanned=72
            ),
            'power_electronics': MaintenanceSchedule(
                component='power_electronics',
                routine_maintenance_interval_hours=4000,
                major_overhaul_interval_hours=24000,
                routine_cost_per_event=0.8,
                major_overhaul_cost_per_event=12.0,
                unplanned_maintenance_probability=0.08,
                unplanned_maintenance_cost=5.0,
                downtime_hours_routine=8,
                downtime_hours_major=48,
                downtime_hours_unplanned=24
            ),
            'compression_system': MaintenanceSchedule(
                component='compression_system',
                routine_maintenance_interval_hours=1500,
                major_overhaul_interval_hours=12000,
                routine_cost_per_event=2.0,
                major_overhaul_cost_per_event=18.0,
                unplanned_maintenance_probability=0.20,
                unplanned_maintenance_cost=10.0,
                downtime_hours_routine=16,
                downtime_hours_major=96,
                downtime_hours_unplanned=48
            ),
            'gas_separation': MaintenanceSchedule(
                component='gas_separation',
                routine_maintenance_interval_hours=6000,
                major_overhaul_interval_hours=30000,
                routine_cost_per_event=1.2,
                major_overhaul_cost_per_event=15.0,
                unplanned_maintenance_probability=0.05,
                unplanned_maintenance_cost=6.0,
                downtime_hours_routine=12,
                downtime_hours_major=72,
                downtime_hours_unplanned=36
            ),
            'control_systems': MaintenanceSchedule(
                component='control_systems',
                routine_maintenance_interval_hours=8000,
                major_overhaul_interval_hours=40000,
                routine_cost_per_event=0.5,
                major_overhaul_cost_per_event=8.0,
                unplanned_maintenance_probability=0.03,
                unplanned_maintenance_cost=3.0,
                downtime_hours_routine=4,
                downtime_hours_major=24,
                downtime_hours_unplanned=12
            )
        }
    
    def assess_technology_maturity_risk(self, technology_type: TechnologyType) -> Dict:
        """Assess risk based on technology maturity"""
        
        tech_data = self.technology_database[technology_type]
        
        # Calculate risk scores (0-100, lower is better)
        trl_risk = max(0, 100 - (tech_data.trl_level * 11))  # TRL 9 = ~1 risk
        deployment_risk = max(0, 100 - (tech_data.commercial_deployments * 0.5))
        scale_risk = max(0, 100 - (tech_data.largest_deployment_mw * 5))
        reliability_risk = (1 - tech_data.reliability_factor) * 100
        supply_chain_risk = (1 - tech_data.supply_chain_maturity) * 100
        
        # Weighted overall technology risk
        tech_risk_score = (
            trl_risk * 0.3 +
            deployment_risk * 0.2 +
            scale_risk * 0.2 +
            reliability_risk * 0.2 +
            supply_chain_risk * 0.1
        )
        
        return {
            'technology_type': technology_type.value,
            'overall_tech_risk_score': round(tech_risk_score, 1),
            'trl_level': tech_data.trl_level,
            'trl_risk_score': round(trl_risk, 1),
            'deployment_risk_score': round(deployment_risk, 1),
            'scale_risk_score': round(scale_risk, 1),
            'reliability_risk_score': round(reliability_risk, 1),
            'supply_chain_risk_score': round(supply_chain_risk, 1),
            'current_efficiency': tech_data.efficiency_current,
            'degradation_rate_annual': tech_data.efficiency_degradation_rate,
            'cost_reduction_potential': tech_data.cost_reduction_potential,
            'risk_level': self._categorize_risk(tech_risk_score)
        }
    
    def model_performance_degradation(self, technology_type: TechnologyType, 
                                    project_lifetime_years: int = 20) -> Dict:
        """Model equipment performance degradation over project lifetime"""
        
        results = {}
        total_replacement_cost = 0
        total_maintenance_cost = 0
        
        for component_name, degradation in self.degradation_models.items():
            yearly_performance = []
            yearly_maintenance_cost = []
            replacement_years = []
            
            current_efficiency = degradation.initial_efficiency
            
            for year in range(project_lifetime_years):
                # Calculate degradation
                degradation_rate = degradation.annual_degradation_rate * \
                                 (degradation.degradation_acceleration_factor ** year)
                current_efficiency -= degradation_rate
                
                # Check if maintenance restores performance
                if year > 0 and year % 2 == 0:  # Maintenance every 2 years
                    restoration = degradation_rate * degradation.maintenance_restoration_factor
                    current_efficiency = min(degradation.initial_efficiency, 
                                           current_efficiency + restoration)
                
                # Check if replacement is needed
                if current_efficiency <= degradation.replacement_threshold:
                    replacement_years.append(year)
                    current_efficiency = degradation.initial_efficiency
                    # Add replacement cost (component-specific)
                    replacement_cost = self._calculate_replacement_cost(component_name)
                    total_replacement_cost += replacement_cost
                
                yearly_performance.append(current_efficiency)
                
                # Calculate annual maintenance cost
                maintenance_schedule = self.maintenance_schedules.get(component_name)
                if maintenance_schedule:
                    annual_maintenance = self._calculate_annual_maintenance_cost(
                        maintenance_schedule, year
                    )
                    yearly_maintenance_cost.append(annual_maintenance)
                    total_maintenance_cost += annual_maintenance
                else:
                    yearly_maintenance_cost.append(0)
            
            # Calculate average performance and availability
            avg_performance = sum(yearly_performance) / len(yearly_performance)
            availability = self._calculate_component_availability(component_name)
            
            results[component_name] = {
                'average_efficiency_over_lifetime': round(avg_performance, 2),
                'final_efficiency': round(yearly_performance[-1], 2),
                'performance_degradation_total': round(
                    degradation.initial_efficiency - yearly_performance[-1], 2
                ),
                'replacement_events': len(replacement_years),
                'replacement_years': replacement_years,
                'annual_performance_curve': [round(p, 2) for p in yearly_performance],
                'total_maintenance_cost_crores': round(sum(yearly_maintenance_cost), 2),
                'average_availability_percent': round(availability * 100, 1),
                'risk_assessment': self._assess_component_risk(
                    component_name, avg_performance, len(replacement_years)
                )
            }
        
        # Calculate overall system performance
        system_efficiency = min(result['average_efficiency_over_lifetime'] 
                               for result in results.values())
        
        return {
            'component_analysis': results,
            'system_level_analysis': {
                'overall_system_efficiency': round(system_efficiency, 2),
                'total_replacement_cost_crores': round(total_replacement_cost, 2),
                'total_maintenance_cost_crores': round(total_maintenance_cost, 2),
                'system_availability_estimate': round(
                    min(self._calculate_component_availability(comp) 
                        for comp in results.keys()) * 100, 1
                ),
                'performance_risk_level': self._categorize_risk(
                    100 - system_efficiency
                )
            }
        }
    
    def assess_grid_integration_risk(self, location: Tuple[float, float], 
                                   capacity_mw: float) -> GridIntegrationRisk:
        """Assess power grid integration risks"""
        
        lat, lng = location
        
        # Mock grid analysis based on location (replace with actual grid data)
        # Gujarat grid characteristics
        if 22.0 <= lat <= 24.5 and 68.0 <= lng <= 74.5:  # Gujarat bounds
            grid_stability = 75.0  # Reasonably stable grid
            renewable_penetration = 32.0  # Gujarat has good renewable penetration
            transmission_constraints = capacity_mw > 50  # Large plants may face constraints
        else:
            grid_stability = 65.0
            renewable_penetration = 25.0
            transmission_constraints = capacity_mw > 30
        
        # Assess power quality issues
        power_quality_issues = []
        if renewable_penetration > 30:
            power_quality_issues.append("Voltage fluctuations from renewables")
        if capacity_mw > 100:
            power_quality_issues.append("Harmonic distortion from large loads")
        if grid_stability < 70:
            power_quality_issues.append("Frequency instability")
        
        # Calculate grid integration risk score
        stability_risk = max(0, 100 - grid_stability)
        capacity_risk = min(50, capacity_mw * 0.5)  # Risk increases with size
        renewable_risk = max(0, renewable_penetration - 25) * 2  # Risk above 25%
        
        integration_risk_score = (stability_risk + capacity_risk + renewable_risk) / 3
        
        return GridIntegrationRisk(
            grid_stability_score=grid_stability,
            power_quality_issues=power_quality_issues,
            grid_congestion_risk=min(1.0, capacity_mw / 200),  # Risk increases with size
            renewable_penetration=renewable_penetration,
            grid_flexibility_score=max(0, 100 - renewable_risk),
            transmission_constraints=transmission_constraints,
            backup_power_required=grid_stability < 70,
            grid_connection_cost=capacity_mw * 2.5  # ₹2.5 crore per MW
        )
    
    def generate_comprehensive_risk_profile(self, 
                                          technology_type: TechnologyType,
                                          location: Tuple[float, float],
                                          capacity_mw: float,
                                          project_lifetime_years: int = 20) -> TechnicalRiskProfile:
        """Generate comprehensive technical risk profile"""
        
        # Get individual risk assessments
        tech_risk = self.assess_technology_maturity_risk(technology_type)
        performance_risk = self.model_performance_degradation(technology_type, project_lifetime_years)
        grid_risk = self.assess_grid_integration_risk(location, capacity_mw)
        
        # Calculate component risk scores
        technology_risk_score = tech_risk['overall_tech_risk_score']
        performance_risk_score = 100 - performance_risk['system_level_analysis']['overall_system_efficiency']
        maintenance_risk_score = min(100, performance_risk['system_level_analysis']['total_maintenance_cost_crores'] * 2)
        grid_integration_risk_score = max(0, 100 - grid_risk.grid_stability_score)
        
        # Calculate weighted overall risk
        risk_weights = {
            'technology': 0.30,
            'performance': 0.25,
            'maintenance': 0.25,
            'grid_integration': 0.20
        }
        
        overall_risk_score = (
            technology_risk_score * risk_weights['technology'] +
            performance_risk_score * risk_weights['performance'] +
            maintenance_risk_score * risk_weights['maintenance'] +
            grid_integration_risk_score * risk_weights['grid_integration']
        )
        
        # Generate risk mitigation strategies
        mitigation_strategies = self._generate_mitigation_strategies(
            technology_risk_score, performance_risk_score, 
            maintenance_risk_score, grid_integration_risk_score
        )
        
        # Generate recommended actions
        recommended_actions = self._generate_recommended_actions(
            overall_risk_score, tech_risk, performance_risk, grid_risk
        )
        
        return TechnicalRiskProfile(
            overall_risk_score=round(overall_risk_score, 1),
            technology_risk=round(technology_risk_score, 1),
            performance_risk=round(performance_risk_score, 1),
            maintenance_risk=round(maintenance_risk_score, 1),
            grid_integration_risk=round(grid_integration_risk_score, 1),
            risk_mitigation_strategies=mitigation_strategies,
            recommended_actions=recommended_actions
        )
    
    def _calculate_replacement_cost(self, component: str) -> float:
        """Calculate replacement cost for components"""
        replacement_costs = {
            'electrolyzer_stack': 35.0,  # ₹35 crores
            'power_electronics': 15.0,
            'compression_system': 20.0,
            'gas_separation': 12.0,
            'control_systems': 8.0
        }
        return replacement_costs.get(component, 10.0)
    
    def _calculate_annual_maintenance_cost(self, schedule: MaintenanceSchedule, year: int) -> float:
        """Calculate annual maintenance cost including planned and unplanned"""
        
        # Calculate routine maintenance frequency
        annual_hours = 8760  # Hours per year
        routine_events = annual_hours / schedule.routine_maintenance_interval_hours
        major_events = annual_hours / schedule.major_overhaul_interval_hours
        
        planned_cost = (
            routine_events * schedule.routine_cost_per_event +
            major_events * schedule.major_overhaul_cost_per_event
        )
        
        # Add unplanned maintenance
        unplanned_cost = (schedule.unplanned_maintenance_probability * 
                         schedule.unplanned_maintenance_cost)
        
        return planned_cost + unplanned_cost
    
    def _calculate_component_availability(self, component: str) -> float:
        """Calculate component availability considering downtime"""
        
        schedule = self.maintenance_schedules.get(component)
        if not schedule:
            return 0.95  # Default availability
        
        annual_hours = 8760
        
        # Calculate planned downtime
        routine_events = annual_hours / schedule.routine_maintenance_interval_hours
        major_events = annual_hours / schedule.major_overhaul_interval_hours
        
        planned_downtime = (
            routine_events * schedule.downtime_hours_routine +
            major_events * schedule.downtime_hours_major
        )
        
        # Add unplanned downtime
        unplanned_downtime = (schedule.unplanned_maintenance_probability * 
                             schedule.downtime_hours_unplanned)
        
        total_downtime = planned_downtime + unplanned_downtime
        availability = max(0, (annual_hours - total_downtime) / annual_hours)
        
        return availability
    
    def _assess_component_risk(self, component: str, avg_performance: float, 
                              replacement_events: int) -> str:
        """Assess individual component risk level"""
        
        if avg_performance > 90 and replacement_events <= 1:
            return "Low"
        elif avg_performance > 80 and replacement_events <= 2:
            return "Medium"
        elif avg_performance > 70 and replacement_events <= 3:
            return "High"
        else:
            return "Critical"
    
    def _categorize_risk(self, risk_score: float) -> str:
        """Categorize numerical risk score into risk levels"""
        if risk_score <= 25:
            return "Low"
        elif risk_score <= 50:
            return "Medium"
        elif risk_score <= 75:
            return "High"
        else:
            return "Critical"
    
    def _generate_mitigation_strategies(self, tech_risk: float, perf_risk: float,
                                       maint_risk: float, grid_risk: float) -> List[str]:
        """Generate specific risk mitigation strategies"""
        strategies = []
        
        if tech_risk > 50:
            strategies.extend([
                "Implement proven technology with established track record",
                "Secure long-term service agreements with OEM",
                "Establish local spare parts inventory",
                "Partner with experienced technology providers"
            ])
        
        if perf_risk > 50:
            strategies.extend([
                "Implement condition monitoring systems",
                "Establish performance guarantees with suppliers",
                "Plan for mid-life refurbishments",
                "Design for redundancy in critical components"
            ])
        
        if maint_risk > 50:
            strategies.extend([
                "Implement predictive maintenance programs",
                "Train local maintenance teams",
                "Establish maintenance partnerships",
                "Stock critical spare parts locally"
            ])
        
        if grid_risk > 50:
            strategies.extend([
                "Install power conditioning equipment",
                "Implement grid stability systems",
                "Consider backup power systems",
                "Coordinate with grid operator for upgrades"
            ])
        
        return strategies[:8]  # Return top 8 strategies
    
    def _generate_recommended_actions(self, overall_risk: float, 
                                     tech_risk: Dict, perf_risk: Dict, 
                                     grid_risk: GridIntegrationRisk) -> List[str]:
        """Generate specific recommended actions"""
        actions = []
        
        if overall_risk > 75:
            actions.append("Consider alternative technology or location")
            actions.append("Implement comprehensive risk management plan")
        
        if tech_risk['trl_level'] < 8:
            actions.append("Wait for technology maturation or select proven alternative")
        
        if perf_risk['system_level_analysis']['overall_system_efficiency'] < 70:
            actions.append("Review system design for optimization opportunities")
        
        if grid_risk.grid_stability_score < 70:
            actions.append("Conduct detailed grid impact study")
            actions.append("Consider grid reinforcement investments")
        
        if grid_risk.transmission_constraints:
            actions.append("Evaluate transmission upgrade requirements")
        
        actions.extend([
            "Develop detailed HAZOP and risk assessment",
            "Establish comprehensive insurance coverage",
            "Create detailed O&M procedures",
            "Implement robust monitoring and control systems"
        ])
        
        return actions[:10]  # Return top 10 actions

def assess_comprehensive_technical_risk(technology_type: str, location: Tuple[float, float], 
                                      capacity_mw: float) -> Dict:
    """Main function to assess comprehensive technical risk"""
    
    # Convert string to enum
    tech_type = TechnologyType(technology_type.lower())
    
    assessor = TechnicalRiskAssessment()
    
    # Generate comprehensive risk profile
    risk_profile = assessor.generate_comprehensive_risk_profile(
        tech_type, location, capacity_mw
    )
    
    # Get detailed assessments
    tech_maturity = assessor.assess_technology_maturity_risk(tech_type)
    performance_model = assessor.model_performance_degradation(tech_type)
    grid_integration = assessor.assess_grid_integration_risk(location, capacity_mw)
    
    return {
        'overall_risk_assessment': {
            'overall_risk_score': risk_profile.overall_risk_score,
            'risk_level': assessor._categorize_risk(risk_profile.overall_risk_score),
            'technology_risk': risk_profile.technology_risk,
            'performance_risk': risk_profile.performance_risk,
            'maintenance_risk': risk_profile.maintenance_risk,
            'grid_integration_risk': risk_profile.grid_integration_risk
        },
        'technology_maturity_analysis': tech_maturity,
        'performance_degradation_model': performance_model,
        'grid_integration_analysis': {
            'grid_stability_score': grid_integration.grid_stability_score,
            'power_quality_issues': grid_integration.power_quality_issues,
            'grid_congestion_risk': round(grid_integration.grid_congestion_risk * 100, 1),
            'renewable_penetration': grid_integration.renewable_penetration,
            'transmission_constraints': grid_integration.transmission_constraints,
            'backup_power_required': grid_integration.backup_power_required,
            'grid_connection_cost_crores': round(grid_integration.grid_connection_cost, 2)
        },
        'risk_mitigation': {
            'mitigation_strategies': risk_profile.risk_mitigation_strategies,
            'recommended_actions': risk_profile.recommended_actions
        }
    }
