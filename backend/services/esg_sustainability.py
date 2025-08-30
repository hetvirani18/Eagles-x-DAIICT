"""
ESG & Sustainability Metrics for H₂-Optimize
Environmental, Social, and Governance impact assessment
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from enum import Enum
import math

class ESGRating(Enum):
    EXCELLENT = "A+"
    VERY_GOOD = "A"
    GOOD = "B+"
    FAIR = "B"
    POOR = "C+"
    VERY_POOR = "C"

class WaterImpactLevel(Enum):
    MINIMAL = "minimal"
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    SEVERE = "severe"

@dataclass
class CarbonFootprintAnalysis:
    """Comprehensive carbon footprint lifecycle analysis"""
    construction_emissions_kg_co2: float
    operational_emissions_kg_co2_per_kg_h2: float
    electricity_source_emissions_factor: float  # kg CO2/kWh
    transportation_emissions_kg_co2: float
    end_of_life_emissions_kg_co2: float
    total_lifecycle_emissions_kg_co2_per_kg_h2: float
    carbon_intensity_vs_grey_hydrogen: float  # % reduction
    carbon_payback_period_years: float

@dataclass
class WaterImpactAssessment:
    """Water usage and environmental impact analysis"""
    water_consumption_liters_per_kg_h2: float
    water_source_sustainability_score: float  # 0-100
    local_water_stress_level: WaterImpactLevel
    groundwater_impact_score: float  # 0-100
    wastewater_treatment_required: bool
    wastewater_discharge_quality: Dict[str, float]
    water_recycling_rate: float  # %
    impact_on_local_ecosystems: str

@dataclass
class SocialImpactMetrics:
    """Social impact and community benefits analysis"""
    direct_employment_created: int
    indirect_employment_created: int
    local_employment_percentage: float
    skill_development_programs: List[str]
    community_investment_crores: float
    local_procurement_percentage: float
    health_safety_incidents_per_year: float
    community_engagement_score: float  # 0-100
    displacement_of_communities: bool
    impact_on_indigenous_communities: bool

@dataclass
class GovernanceMetrics:
    """Corporate governance and compliance metrics"""
    regulatory_compliance_score: float  # 0-100
    environmental_permits_status: str
    stakeholder_engagement_quality: float  # 0-100
    transparency_reporting_level: float  # 0-100
    board_diversity_score: float  # 0-100
    anti_corruption_measures: List[str]
    sustainability_reporting_framework: str
    third_party_esg_certification: Optional[str]

@dataclass
class CircularEconomyMetrics:
    """Circular economy and resource efficiency"""
    material_circularity_rate: float  # %
    waste_generation_kg_per_kg_h2: float
    recycling_rate: float  # %
    renewable_energy_percentage: float
    resource_efficiency_score: float  # 0-100
    byproduct_utilization_rate: float  # %
    equipment_end_of_life_plan: str

@dataclass
class ESGScorecard:
    """Comprehensive ESG scoring and rating"""
    environmental_score: float  # 0-100
    social_score: float  # 0-100
    governance_score: float  # 0-100
    overall_esg_score: float  # 0-100
    esg_rating: ESGRating
    sustainability_highlights: List[str]
    improvement_recommendations: List[str]

class ESGSustainabilityAssessment:
    """Comprehensive ESG and sustainability assessment engine"""
    
    def __init__(self):
        self.water_stress_database = self._initialize_water_stress_data()
        self.regional_factors = self._initialize_regional_factors()
    
    def _initialize_water_stress_data(self) -> Dict[str, WaterImpactLevel]:
        """Initialize regional water stress data"""
        return {
            'gujarat_north': WaterImpactLevel.HIGH,
            'gujarat_central': WaterImpactLevel.MODERATE,
            'gujarat_south': WaterImpactLevel.LOW,
            'gujarat_coastal': WaterImpactLevel.MODERATE,
            'gujarat_kutch': WaterImpactLevel.SEVERE
        }
    
    def _initialize_regional_factors(self) -> Dict[str, Dict]:
        """Initialize regional sustainability factors"""
        return {
            'gujarat': {
                'renewable_energy_grid_mix': 35.0,  # % renewable in grid
                'industrial_employment_multiplier': 2.5,
                'local_skill_availability': 0.75,
                'environmental_regulation_strength': 0.80,
                'community_engagement_culture': 0.70,
                'water_availability_score': 65.0
            }
        }
    
    def assess_carbon_footprint(self, location: Tuple[float, float], 
                               capacity_kg_day: float, electricity_source: str) -> CarbonFootprintAnalysis:
        """Comprehensive lifecycle carbon footprint assessment"""
        
        # Construction phase emissions (one-time)
        plant_size_factor = capacity_kg_day / 1000  # Normalize to tonnes/day
        construction_emissions = plant_size_factor * 2500000  # kg CO2 for construction
        
        # Electricity source emissions factors (kg CO2/kWh)
        emissions_factors = {
            'grid': 0.82,  # Indian grid average
            'solar': 0.05,
            'wind': 0.02,
            'hydro': 0.15,
            'nuclear': 0.05,
            'mixed_renewable': 0.08
        }
        
        electricity_factor = emissions_factors.get(electricity_source, 0.82)
        
        # Operational emissions per kg H2
        # Hydrogen production: ~50 kWh/kg H2 (including auxiliaries)
        electricity_per_kg_h2 = 50.0
        operational_emissions_per_kg = electricity_per_kg_h2 * electricity_factor
        
        # Transportation emissions (assume 100 km average)
        transport_emissions_per_kg = 0.8  # kg CO2/kg H2
        
        # End-of-life emissions (equipment disposal/recycling)
        end_of_life_factor = 0.05  # 5% of construction emissions
        end_of_life_emissions = construction_emissions * end_of_life_factor
        
        # Total lifecycle emissions per kg H2 (20-year plant life)
        annual_production = capacity_kg_day * 330  # Operating days
        total_production_20_years = annual_production * 20
        
        construction_per_kg = construction_emissions / total_production_20_years
        end_of_life_per_kg = end_of_life_emissions / total_production_20_years
        
        total_lifecycle_per_kg = (construction_per_kg + operational_emissions_per_kg + 
                                 transport_emissions_per_kg + end_of_life_per_kg)
        
        # Comparison with grey hydrogen (10-12 kg CO2/kg H2)
        grey_hydrogen_emissions = 11.0  # kg CO2/kg H2
        carbon_reduction = ((grey_hydrogen_emissions - total_lifecycle_per_kg) / 
                           grey_hydrogen_emissions) * 100
        
        # Carbon payback period calculation
        annual_co2_avoided = annual_production * (grey_hydrogen_emissions - total_lifecycle_per_kg)
        carbon_payback_years = construction_emissions / annual_co2_avoided if annual_co2_avoided > 0 else float('inf')
        
        return CarbonFootprintAnalysis(
            construction_emissions_kg_co2=construction_emissions,
            operational_emissions_kg_co2_per_kg_h2=round(operational_emissions_per_kg, 3),
            electricity_source_emissions_factor=electricity_factor,
            transportation_emissions_kg_co2=transport_emissions_per_kg,
            end_of_life_emissions_kg_co2=end_of_life_emissions,
            total_lifecycle_emissions_kg_co2_per_kg_h2=round(total_lifecycle_per_kg, 3),
            carbon_intensity_vs_grey_hydrogen=round(carbon_reduction, 1),
            carbon_payback_period_years=round(carbon_payback_years, 2)
        )
    
    def assess_water_impact(self, location: Tuple[float, float], 
                           capacity_kg_day: float, water_source_type: str) -> WaterImpactAssessment:
        """Comprehensive water impact assessment"""
        
        lat, lng = location
        
        # Determine regional water stress
        if 23.5 <= lat <= 24.5:  # North Gujarat
            water_stress = WaterImpactLevel.HIGH
        elif 22.8 <= lat <= 23.5:  # Central Gujarat
            water_stress = WaterImpactLevel.MODERATE
        elif 21.0 <= lat <= 22.8:  # South Gujarat
            water_stress = WaterImpactLevel.LOW
        elif lng >= 71.0:  # Coastal areas
            water_stress = WaterImpactLevel.MODERATE
        else:  # Kutch region
            water_stress = WaterImpactLevel.SEVERE
        
        # Water consumption calculation
        # Base consumption: 9 liters per kg H2 (theoretical minimum)
        # Add losses and auxiliary consumption
        base_consumption = 9.0
        process_losses = 1.5  # Evaporation, blowdown
        auxiliary_consumption = 2.0  # Cooling, cleaning
        total_consumption = base_consumption + process_losses + auxiliary_consumption
        
        # Water source sustainability scoring
        source_scores = {
            'groundwater': 40.0,  # Not sustainable in water-stressed areas
            'surface_water': 60.0,
            'recycled_water': 90.0,
            'desalinated_water': 75.0,
            'rainwater_harvesting': 85.0
        }
        source_sustainability = source_scores.get(water_source_type, 50.0)
        
        # Adjust for regional water stress
        stress_multipliers = {
            WaterImpactLevel.MINIMAL: 1.0,
            WaterImpactLevel.LOW: 1.1,
            WaterImpactLevel.MODERATE: 1.3,
            WaterImpactLevel.HIGH: 1.6,
            WaterImpactLevel.SEVERE: 2.0
        }
        
        adjusted_consumption = total_consumption * stress_multipliers[water_stress]
        
        # Groundwater impact assessment
        if water_source_type == 'groundwater':
            groundwater_impact = max(0, 100 - source_sustainability)
        else:
            groundwater_impact = 20  # Minimal impact
        
        # Water recycling potential
        recycling_rates = {
            'basic_treatment': 60.0,
            'advanced_treatment': 85.0,
            'zero_liquid_discharge': 95.0
        }
        
        # Assume advanced treatment for new plants
        recycling_rate = recycling_rates['advanced_treatment']
        
        # Wastewater characteristics
        wastewater_quality = {
            'tds_mg_l': 500,  # Total dissolved solids
            'ph': 7.2,
            'temperature_c': 35,
            'organic_load_bod_mg_l': 50
        }
        
        # Ecosystem impact assessment
        if water_stress in [WaterImpactLevel.HIGH, WaterImpactLevel.SEVERE]:
            ecosystem_impact = "Potential stress on local water bodies and aquifers"
        elif water_stress == WaterImpactLevel.MODERATE:
            ecosystem_impact = "Moderate impact requiring monitoring and management"
        else:
            ecosystem_impact = "Minimal impact with proper water management"
        
        return WaterImpactAssessment(
            water_consumption_liters_per_kg_h2=round(adjusted_consumption, 1),
            water_source_sustainability_score=source_sustainability,
            local_water_stress_level=water_stress,
            groundwater_impact_score=round(groundwater_impact, 1),
            wastewater_treatment_required=True,
            wastewater_discharge_quality=wastewater_quality,
            water_recycling_rate=recycling_rate,
            impact_on_local_ecosystems=ecosystem_impact
        )
    
    def assess_social_impact(self, location: Tuple[float, float], 
                           capacity_kg_day: float, investment_crores: float) -> SocialImpactMetrics:
        """Comprehensive social impact assessment"""
        
        # Employment calculations
        # Rule of thumb: 15-20 jobs per MW of electrolyzer capacity
        plant_capacity_mw = capacity_kg_day * 50 / (24 * 1000)  # Rough MW conversion
        direct_employment = int(plant_capacity_mw * 18)
        
        # Indirect employment multiplier (supply chain, services)
        indirect_multiplier = 2.5
        indirect_employment = int(direct_employment * indirect_multiplier)
        
        # Local employment percentage (depends on skill availability)
        regional_factors = self.regional_factors.get('gujarat', {})
        local_skill_factor = regional_factors.get('local_skill_availability', 0.75)
        local_employment_pct = local_skill_factor * 100
        
        # Skill development programs
        skill_programs = [
            "Electrolyzer operation and maintenance training",
            "Power electronics technician certification",
            "Safety and hazard management training",
            "Digital monitoring systems training",
            "Green hydrogen quality control training"
        ]
        
        # Community investment (typically 0.5-1% of CAPEX)
        community_investment = investment_crores * 0.008  # 0.8% of investment
        
        # Local procurement assessment
        local_procurement_pct = 45.0  # Typical for industrial projects in Gujarat
        
        # Safety metrics (green hydrogen plants generally safe)
        safety_incidents_per_year = 0.2  # Very low for well-designed plants
        
        # Community engagement score
        engagement_factors = {
            'stakeholder_consultation': 85.0,
            'local_hiring_commitment': local_employment_pct,
            'community_investment': min(100, community_investment * 10),
            'transparency': 80.0
        }
        community_engagement = sum(engagement_factors.values()) / len(engagement_factors)
        
        return SocialImpactMetrics(
            direct_employment_created=direct_employment,
            indirect_employment_created=indirect_employment,
            local_employment_percentage=round(local_employment_pct, 1),
            skill_development_programs=skill_programs,
            community_investment_crores=round(community_investment, 2),
            local_procurement_percentage=local_procurement_pct,
            health_safety_incidents_per_year=safety_incidents_per_year,
            community_engagement_score=round(community_engagement, 1),
            displacement_of_communities=False,  # Industrial land typically used
            impact_on_indigenous_communities=False
        )
    
    def assess_governance_metrics(self, project_scale: str, 
                                 international_partnerships: bool) -> GovernanceMetrics:
        """Assess governance and compliance metrics"""
        
        # Regulatory compliance assessment
        compliance_factors = {
            'environmental_clearance': 90.0,
            'pollution_control_board': 85.0,
            'industrial_licensing': 95.0,
            'safety_certifications': 90.0,
            'grid_connection_approvals': 80.0
        }
        compliance_score = sum(compliance_factors.values()) / len(compliance_factors)
        
        # Environmental permits status
        permit_status = "All major permits obtained with monitoring compliance"
        
        # Stakeholder engagement quality
        engagement_score = 85.0 if international_partnerships else 75.0
        
        # Transparency and reporting
        if project_scale in ['large', 'mega']:
            transparency_score = 90.0
            reporting_framework = "GRI Standards + SASB + TCFD"
        else:
            transparency_score = 75.0
            reporting_framework = "GRI Standards"
        
        # Board diversity (if corporate project)
        board_diversity = 70.0 if international_partnerships else 60.0
        
        # Anti-corruption measures
        anti_corruption = [
            "Code of conduct implementation",
            "Third-party due diligence",
            "Whistleblower protection",
            "Regular compliance audits",
            "Transparent procurement processes"
        ]
        
        # ESG certification
        esg_cert = "LEED Gold" if project_scale == 'mega' else None
        
        return GovernanceMetrics(
            regulatory_compliance_score=round(compliance_score, 1),
            environmental_permits_status=permit_status,
            stakeholder_engagement_quality=round(engagement_score, 1),
            transparency_reporting_level=round(transparency_score, 1),
            board_diversity_score=round(board_diversity, 1),
            anti_corruption_measures=anti_corruption,
            sustainability_reporting_framework=reporting_framework,
            third_party_esg_certification=esg_cert
        )
    
    def assess_circular_economy(self, technology_type: str, 
                               renewable_energy_pct: float) -> CircularEconomyMetrics:
        """Assess circular economy and resource efficiency"""
        
        # Material circularity (how much of materials can be recycled)
        circularity_rates = {
            'alkaline': 75.0,  # Steel, nickel can be recycled
            'pem': 65.0,  # Some platinum can be recovered
            'soec': 60.0,  # Ceramic materials harder to recycle
            'aem': 70.0
        }
        material_circularity = circularity_rates.get(technology_type, 70.0)
        
        # Waste generation (kg waste per kg H2 produced)
        waste_generation = 0.05  # Very low for hydrogen production
        
        # Recycling rate of operational waste
        recycling_rate = 85.0  # High recycling potential
        
        # Resource efficiency score
        efficiency_factors = {
            'energy_efficiency': min(100, renewable_energy_pct * 1.2),
            'water_efficiency': 80.0,  # With recycling systems
            'material_efficiency': material_circularity,
            'land_use_efficiency': 90.0  # Compact industrial footprint
        }
        resource_efficiency = sum(efficiency_factors.values()) / len(efficiency_factors)
        
        # Byproduct utilization (oxygen from electrolysis)
        byproduct_utilization = 75.0  # Oxygen can be sold to industries
        
        # End-of-life planning
        eol_plan = "Comprehensive decommissioning with 80%+ material recovery"
        
        return CircularEconomyMetrics(
            material_circularity_rate=round(material_circularity, 1),
            waste_generation_kg_per_kg_h2=waste_generation,
            recycling_rate=recycling_rate,
            renewable_energy_percentage=renewable_energy_pct,
            resource_efficiency_score=round(resource_efficiency, 1),
            byproduct_utilization_rate=byproduct_utilization,
            equipment_end_of_life_plan=eol_plan
        )
    
    def generate_esg_scorecard(self, carbon_footprint: CarbonFootprintAnalysis,
                              water_impact: WaterImpactAssessment,
                              social_impact: SocialImpactMetrics,
                              governance: GovernanceMetrics,
                              circular_economy: CircularEconomyMetrics) -> ESGScorecard:
        """Generate comprehensive ESG scorecard and rating"""
        
        # Environmental Score (0-100)
        env_factors = {
            'carbon_performance': min(100, carbon_footprint.carbon_intensity_vs_grey_hydrogen),
            'water_sustainability': water_impact.water_source_sustainability_score,
            'circular_economy': circular_economy.resource_efficiency_score,
            'ecosystem_impact': 100 - water_impact.groundwater_impact_score
        }
        environmental_score = sum(env_factors.values()) / len(env_factors)
        
        # Social Score (0-100)
        social_factors = {
            'employment_creation': min(100, social_impact.direct_employment_created * 2),
            'local_community_benefits': social_impact.community_engagement_score,
            'safety_performance': max(0, 100 - social_impact.health_safety_incidents_per_year * 50),
            'skill_development': 85.0 if social_impact.skill_development_programs else 50.0
        }
        social_score = sum(social_factors.values()) / len(social_factors)
        
        # Governance Score (0-100)
        gov_factors = {
            'regulatory_compliance': governance.regulatory_compliance_score,
            'stakeholder_engagement': governance.stakeholder_engagement_quality,
            'transparency': governance.transparency_reporting_level,
            'board_diversity': governance.board_diversity_score
        }
        governance_score = sum(gov_factors.values()) / len(gov_factors)
        
        # Overall ESG Score (weighted)
        esg_weights = {'environmental': 0.4, 'social': 0.35, 'governance': 0.25}
        overall_score = (
            environmental_score * esg_weights['environmental'] +
            social_score * esg_weights['social'] +
            governance_score * esg_weights['governance']
        )
        
        # ESG Rating
        if overall_score >= 90:
            rating = ESGRating.EXCELLENT
        elif overall_score >= 80:
            rating = ESGRating.VERY_GOOD
        elif overall_score >= 70:
            rating = ESGRating.GOOD
        elif overall_score >= 60:
            rating = ESGRating.FAIR
        elif overall_score >= 50:
            rating = ESGRating.POOR
        else:
            rating = ESGRating.VERY_POOR
        
        # Sustainability highlights
        highlights = []
        if carbon_footprint.carbon_intensity_vs_grey_hydrogen > 80:
            highlights.append(f"{carbon_footprint.carbon_intensity_vs_grey_hydrogen:.1f}% carbon reduction vs grey hydrogen")
        if social_impact.direct_employment_created > 50:
            highlights.append(f"{social_impact.direct_employment_created} direct jobs created")
        if circular_economy.renewable_energy_percentage > 80:
            highlights.append(f"{circular_economy.renewable_energy_percentage}% renewable energy powered")
        if water_impact.water_recycling_rate > 80:
            highlights.append(f"{water_impact.water_recycling_rate}% water recycling rate")
        
        # Improvement recommendations
        recommendations = []
        if environmental_score < 75:
            recommendations.append("Increase renewable energy percentage and improve water efficiency")
        if social_score < 75:
            recommendations.append("Enhance community engagement and local employment programs")
        if governance_score < 75:
            recommendations.append("Strengthen transparency reporting and stakeholder engagement")
        if circular_economy.material_circularity_rate < 80:
            recommendations.append("Develop comprehensive circular economy strategies")
        
        return ESGScorecard(
            environmental_score=round(environmental_score, 1),
            social_score=round(social_score, 1),
            governance_score=round(governance_score, 1),
            overall_esg_score=round(overall_score, 1),
            esg_rating=rating,
            sustainability_highlights=highlights,
            improvement_recommendations=recommendations
        )

def assess_comprehensive_esg_sustainability(location: Tuple[float, float],
                                          capacity_kg_day: float,
                                          investment_crores: float,
                                          technology_type: str = "pem",
                                          electricity_source: str = "mixed_renewable",
                                          water_source: str = "surface_water") -> Dict:
    """Main function for comprehensive ESG and sustainability assessment"""
    
    assessor = ESGSustainabilityAssessment()
    
    # Conduct all assessments
    carbon_analysis = assessor.assess_carbon_footprint(location, capacity_kg_day, electricity_source)
    water_analysis = assessor.assess_water_impact(location, capacity_kg_day, water_source)
    social_analysis = assessor.assess_social_impact(location, capacity_kg_day, investment_crores)
    governance_analysis = assessor.assess_governance_metrics("large", True)
    
    # Determine renewable energy percentage
    renewable_pct = 85.0 if electricity_source in ['solar', 'wind', 'mixed_renewable'] else 35.0
    circular_analysis = assessor.assess_circular_economy(technology_type, renewable_pct)
    
    # Generate ESG scorecard
    esg_scorecard = assessor.generate_esg_scorecard(
        carbon_analysis, water_analysis, social_analysis, 
        governance_analysis, circular_analysis
    )
    
    return {
        'esg_scorecard': {
            'overall_esg_score': esg_scorecard.overall_esg_score,
            'esg_rating': esg_scorecard.esg_rating.value,
            'environmental_score': esg_scorecard.environmental_score,
            'social_score': esg_scorecard.social_score,
            'governance_score': esg_scorecard.governance_score,
            'sustainability_highlights': esg_scorecard.sustainability_highlights,
            'improvement_recommendations': esg_scorecard.improvement_recommendations
        },
        'carbon_footprint_analysis': {
            'total_lifecycle_emissions_kg_co2_per_kg_h2': carbon_analysis.total_lifecycle_emissions_kg_co2_per_kg_h2,
            'carbon_reduction_vs_grey_hydrogen_percent': carbon_analysis.carbon_intensity_vs_grey_hydrogen,
            'carbon_payback_period_years': carbon_analysis.carbon_payback_period_years,
            'operational_emissions_kg_co2_per_kg_h2': carbon_analysis.operational_emissions_kg_co2_per_kg_h2
        },
        'water_impact_assessment': {
            'water_consumption_liters_per_kg_h2': water_analysis.water_consumption_liters_per_kg_h2,
            'water_stress_level': water_analysis.local_water_stress_level.value,
            'water_source_sustainability_score': water_analysis.water_source_sustainability_score,
            'water_recycling_rate_percent': water_analysis.water_recycling_rate,
            'ecosystem_impact_description': water_analysis.impact_on_local_ecosystems
        },
        'social_impact_metrics': {
            'direct_employment_created': social_analysis.direct_employment_created,
            'indirect_employment_created': social_analysis.indirect_employment_created,
            'local_employment_percentage': social_analysis.local_employment_percentage,
            'community_investment_crores': social_analysis.community_investment_crores,
            'community_engagement_score': social_analysis.community_engagement_score,
            'skill_development_programs': social_analysis.skill_development_programs
        },
        'governance_metrics': {
            'regulatory_compliance_score': governance_analysis.regulatory_compliance_score,
            'transparency_reporting_level': governance_analysis.transparency_reporting_level,
            'stakeholder_engagement_quality': governance_analysis.stakeholder_engagement_quality,
            'sustainability_reporting_framework': governance_analysis.sustainability_reporting_framework
        },
        'circular_economy_metrics': {
            'material_circularity_rate_percent': circular_analysis.material_circularity_rate,
            'renewable_energy_percentage': circular_analysis.renewable_energy_percentage,
            'resource_efficiency_score': circular_analysis.resource_efficiency_score,
            'byproduct_utilization_rate_percent': circular_analysis.byproduct_utilization_rate,
            'equipment_end_of_life_plan': circular_analysis.equipment_end_of_life_plan
        }
    }
