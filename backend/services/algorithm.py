import math
from typing import List, Dict, Tuple
from models import (
    LocationPoint, OptimalLocation, EnergySource, DemandCenter, 
    WaterSource, GasPipeline, RoadNetwork, WaterBody, WeightedAnalysisRequest
)
from database import get_database
from .investor_economics import run_investor_grade_analysis
from .dynamic_production_calculator import analyze_location_production_potential
# Temporarily comment out problematic import
# from .interactive_investment_tools import run_complete_investment_analysis
import math
import asyncio

class HydrogenLocationOptimizer:
    def __init__(self):
        self.db = get_database()
        
    def calculate_distance(self, point1: LocationPoint, point2: LocationPoint) -> float:
        """Calculate distance between two points using Haversine formula"""
        R = 6371  # Earth's radius in kilometers
        
        lat1_rad = math.radians(point1.latitude)
        lat2_rad = math.radians(point2.latitude) 
        delta_lat = math.radians(point2.latitude - point1.latitude)
        delta_lon = math.radians(point2.longitude - point1.longitude)
        
        a = (math.sin(delta_lat / 2) ** 2 + 
             math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        return R * c
    
    def calculate_distance_to_route(self, point: LocationPoint, route: List[LocationPoint]) -> float:
        """Calculate minimum distance from point to a route (pipeline/road)"""
        min_distance = float('inf')
        
        for route_point in route:
            distance = self.calculate_distance(point, route_point)
            min_distance = min(min_distance, distance)
            
        return min_distance
    
    def score_proximity(self, distance: float, max_distance: float = 100) -> float:
        """Convert distance to score (0-100, closer is better)"""
        if distance >= max_distance:
            return 0
        return max(0, 100 * (1 - distance / max_distance))
    
    async def get_nearest_asset(self, location: LocationPoint, assets: List, 
                               route_based: bool = False) -> Tuple[dict, float]:
        """Find nearest asset to a location"""
        min_distance = float('inf')
        nearest_asset = None
        
        for asset in assets:
            if route_based and hasattr(asset, 'route'):
                distance = self.calculate_distance_to_route(location, asset.route)
            else:
                distance = self.calculate_distance(location, asset.location)
                
            if distance < min_distance:
                min_distance = distance
                nearest_asset = asset
                
        return nearest_asset, min_distance
    
    async def calculate_energy_score(self, location: LocationPoint, 
                                   energy_sources: List[EnergySource]) -> Tuple[float, dict]:
        """Calculate energy proximity score"""
        if not energy_sources:
            return 0, {}
            
        nearest_energy, distance = await self.get_nearest_asset(location, energy_sources)
        score = self.score_proximity(distance, max_distance=150)
        
        # Bonus for high capacity and low cost
        if nearest_energy:
            capacity_bonus = min(20, nearest_energy.capacity_mw / 100)  # Up to 20 bonus points
            cost_bonus = max(0, 10 - nearest_energy.cost_per_kwh * 4)  # Up to 10 bonus points
            score += capacity_bonus + cost_bonus
            
        return min(100, score), {
            'nearest_source': nearest_energy.name if nearest_energy else None,
            'distance_km': round(distance, 2) if nearest_energy else None,
            'type': nearest_energy.type if nearest_energy else None,
            'capacity_mw': nearest_energy.capacity_mw if nearest_energy else None
        }
    
    async def calculate_demand_score(self, location: LocationPoint,
                                   demand_centers: List[DemandCenter]) -> Tuple[float, dict]:
        """Calculate demand proximity score"""
        if not demand_centers:
            return 0, {}
            
        nearest_demand, distance = await self.get_nearest_asset(location, demand_centers)
        score = self.score_proximity(distance, max_distance=100)
        
        # Bonus for high demand and willingness to pay premium
        if nearest_demand:
            demand_bonus = min(15, nearest_demand.hydrogen_demand_mt_year / 5000)
            premium_bonus = min(10, nearest_demand.willingness_to_pay / 10)
            score += demand_bonus + premium_bonus
            
        return min(100, score), {
            'nearest_center': nearest_demand.name if nearest_demand else None,
            'distance_km': round(distance, 2) if nearest_demand else None,
            'type': nearest_demand.type if nearest_demand else None,
            'demand_mt_year': nearest_demand.hydrogen_demand_mt_year if nearest_demand else None
        }
    
    async def calculate_water_score(self, location: LocationPoint,
                                  water_sources: List[WaterSource],
                                  water_bodies: List[WaterBody]) -> Tuple[float, dict]:
        """Calculate water access score"""
        all_water_assets = water_sources + water_bodies
        
        if not all_water_assets:
            return 0, {}
            
        nearest_water, distance = await self.get_nearest_asset(location, all_water_assets)
        score = self.score_proximity(distance, max_distance=80)
        
        # Bonus for high capacity and quality
        if nearest_water:
            if hasattr(nearest_water, 'capacity_liters_day'):
                capacity_bonus = min(15, nearest_water.capacity_liters_day / 100000)
                score += capacity_bonus
            if hasattr(nearest_water, 'quality_score'):
                quality_bonus = nearest_water.quality_score
                score += quality_bonus
                
        return min(100, score), {
            'nearest_source': nearest_water.name if nearest_water else None,
            'distance_km': round(distance, 2) if nearest_water else None,
            'type': getattr(nearest_water, 'type', None) if nearest_water else None
        }
    
    async def calculate_pipeline_score(self, location: LocationPoint,
                                     gas_pipelines: List[GasPipeline]) -> Tuple[float, dict]:
        """Calculate gas pipeline proximity score"""
        if not gas_pipelines:
            return 0, {}
            
        nearest_pipeline, distance = await self.get_nearest_asset(location, gas_pipelines, route_based=True)
        score = self.score_proximity(distance, max_distance=50)
        
        # Bonus for high capacity pipelines
        if nearest_pipeline:
            capacity_bonus = min(15, nearest_pipeline.capacity_mmscmd / 20)
            score += capacity_bonus
            
        return min(100, score), {
            'nearest_pipeline': nearest_pipeline.name if nearest_pipeline else None,
            'distance_km': round(distance, 2) if nearest_pipeline else None,
            'operator': nearest_pipeline.operator if nearest_pipeline else None
        }
    
    async def calculate_transport_score(self, location: LocationPoint,
                                      road_networks: List[RoadNetwork]) -> Tuple[float, dict]:
        """Calculate transport connectivity score"""
        if not road_networks:
            return 0, {}
            
        nearest_road, distance = await self.get_nearest_asset(location, road_networks, route_based=True)
        score = self.score_proximity(distance, max_distance=30)
        
        # Bonus for high connectivity roads
        if nearest_road:
            connectivity_bonus = nearest_road.connectivity_score / 10  # Max 10 bonus
            score += connectivity_bonus
            
        return min(100, score), {
            'nearest_road': nearest_road.name if nearest_road else None,
            'distance_km': round(distance, 2) if nearest_road else None,
            'type': nearest_road.type if nearest_road else None,
            'connectivity_score': nearest_road.connectivity_score if nearest_road else None
        }

    async def calculate_economic_viability_score(self, location: LocationPoint,
                                               nearest_energy: EnergySource = None,
                                               nearest_demand: DemandCenter = None,
                                               nearest_water: WaterSource = None) -> Tuple[float, dict]:
        """Calculate economic viability score based on simplified financial analysis"""
        
        if not (nearest_energy and nearest_demand and nearest_water):
            # Fallback to dynamic economic estimation based on available data
            return 50, {'simplified': True, 'message': 'Limited data for full economic analysis'}
        
        try:
            # Dynamic economic scoring based on actual resource costs
            basic_score = self._calculate_basic_economic_score(nearest_energy, nearest_demand, nearest_water)
            
            # Dynamic pricing based on electricity costs and local conditions
            electricity_price = getattr(nearest_energy, 'cost_per_kwh', 3.5)
            
            # Calculate location-specific hydrogen price
            # Electricity is 70-80% of production cost
            base_electricity_cost = electricity_price * 55  # 55 kWh per kg H2
            other_production_costs = 45  # Water, O&M, labor etc.
            production_cost = base_electricity_cost + other_production_costs
            
            # Add margin based on scale and risk
            demand_capacity = getattr(nearest_demand, 'hydrogen_demand_mt_year', 1000)
            if demand_capacity > 5000:
                margin = 0.15  # Large market, lower risk
            elif demand_capacity > 2000:
                margin = 0.20  # Medium market
            else:
                margin = 0.25  # Small market, higher risk
                
            hydrogen_price = production_cost * (1 + margin)
            
            # Dynamic capacity based on resource availability and demand
            electricity_mw = getattr(nearest_energy, 'capacity_mw', 50.0)
            max_production_from_electricity = (electricity_mw * 1000 * 24) / 55  # kg/day
            water_capacity = getattr(nearest_water, 'capacity_liters_day', 50000)
            max_production_from_water = water_capacity / 10  # kg/day (10L per kg H2)
            
            # Annual capacity is constrained by lowest resource
            daily_capacity = min(max_production_from_electricity, max_production_from_water, demand_capacity * 1000 / 365)
            annual_capacity = daily_capacity * 330  # MT/year (90% uptime)
            
            # Calculate revenues and costs dynamically
            annual_revenue_cr = annual_capacity * hydrogen_price / 100000  # Convert to crores
            capex_cr = annual_capacity * 0.8  # Estimated CAPEX
            opex_cr = annual_revenue_cr * 0.6  # OPEX as 60% of revenue
            annual_profit_cr = annual_revenue_cr - opex_cr
            
            roi_percentage = (annual_profit_cr / capex_cr) * 100 if capex_cr > 0 else 0
            payback_years = capex_cr / annual_profit_cr if annual_profit_cr > 0 else float('inf')
            
            economic_details = {
                'economic_grade': self._get_economic_grade(basic_score),
                'roi_percentage': round(roi_percentage, 1),
                'payback_period_years': round(min(20, payback_years), 1) if payback_years != float('inf') else float('inf'),
                'hydrogen_price_per_kg': hydrogen_price,
                'electricity_cost_per_kwh': electricity_price,
                'annual_capacity_tonnes': annual_capacity,
                'simplified_calculation': True
            }
            
            return min(100, max(0, basic_score)), economic_details
            
        except Exception as e:
            print(f"Error in economic analysis: {e}")
            # Fallback calculation
            basic_score = self._calculate_basic_economic_score(nearest_energy, nearest_demand, nearest_water)
            return basic_score, {'simplified': True, 'error': str(e)}
    
    def _calculate_basic_economic_score(self, energy: EnergySource, demand: DemandCenter, water: WaterSource) -> float:
        """Basic economic scoring when detailed analysis fails"""
        score = 50  # Base score
        
        if energy and energy.cost_per_kwh:
            # Lower electricity cost = higher score
            if energy.cost_per_kwh <= 2.5:
                score += 20
            elif energy.cost_per_kwh <= 3.5:
                score += 10
            elif energy.cost_per_kwh >= 5.0:
                score -= 10
        
        if demand and demand.hydrogen_demand_mt_year:
            # Higher demand = higher score
            if demand.hydrogen_demand_mt_year >= 5000:
                score += 15
            elif demand.hydrogen_demand_mt_year >= 1000:
                score += 10
            elif demand.hydrogen_demand_mt_year >= 500:
                score += 5
        
        if water and water.quality_score:
            # Better water quality = higher score (quality_score is 1-10 scale)
            if water.quality_score >= 8:
                score += 10
            elif water.quality_score >= 6:
                score += 5
        
        return min(100, max(0, score))
    
    def _get_economic_grade(self, score: float) -> str:
        """Convert economic score to letter grade"""
        if score >= 90:
            return 'A+ (Excellent)'
        elif score >= 80:
            return 'A (Very Good)'
        elif score >= 70:
            return 'B+ (Good)'
        elif score >= 60:
            return 'B (Fair)'
        elif score >= 50:
            return 'C+ (Marginal)'
        elif score >= 40:
            return 'C (Poor)'
        else:
            return 'D (Very Poor)'
    
    async def calculate_production_metrics(self, overall_score: float, 
                                         energy_info: dict, demand_info: dict,
                                         location: LocationPoint,
                                         energy_score: float = 50,
                                         water_score: float = 50,
                                         infrastructure_score: float = 50,
                                         nearest_energy: EnergySource = None,
                                         nearest_demand: DemandCenter = None,
                                         nearest_water: WaterSource = None) -> dict:
        """Calculate detailed production cost and capacity with economic analysis"""
        
        # If we have actual infrastructure data, use dynamic production calculation
        if nearest_energy and nearest_demand and nearest_water:
            try:
                # Get actual resource availability
                electricity_mw = getattr(nearest_energy, 'capacity_mw', 50.0)
                electricity_price = getattr(nearest_energy, 'cost_per_kwh', 3.5)
                water_supply_lph = getattr(nearest_water, 'flow_rate_lph', 50000)
                total_demand_kg_day = getattr(nearest_demand, 'hydrogen_demand_mt_year', 1) * 1000 / 365  # Convert MT/year to kg/day
                
                # Calculate land price based on location
                distance_to_city = energy_info.get('distance_km', 50)
                if distance_to_city < 20:
                    land_price_per_acre_cr = 2.5  # Urban
                elif distance_to_city < 50:
                    land_price_per_acre_cr = 1.8  # Semi-urban
                else:
                    land_price_per_acre_cr = 1.2  # Rural
                
                # Run dynamic production analysis
                production_analysis = analyze_location_production_potential(
                    electricity_mw=electricity_mw,
                    electricity_price=electricity_price,
                    water_supply_lph=water_supply_lph,
                    total_demand_kg_day=total_demand_kg_day,
                    land_available_acres=10,
                    land_price_per_acre_cr=land_price_per_acre_cr
                )
                
                # Get recommended scenario
                recommended = production_analysis.get('recommended_scenario')
                if recommended:
                    scenario = recommended['scenario']
                    
                    return {
                        'capacity_kg_day': scenario.capacity_kg_day,
                        'annual_capacity_mt': scenario.annual_production_tonnes,
                        'projected_cost_per_kg': scenario.hydrogen_price_per_kg if hasattr(scenario, 'hydrogen_price_per_kg') else 350,
                        'electricity_required_mw': scenario.electricity_required_mw,
                        'water_required_lph': scenario.water_required_lph,
                        'land_required_acres': scenario.land_required_acres,
                        'capex_crores': scenario.capex_crores,
                        'opex_annual_crores': scenario.opex_annual_crores,
                        'revenue_annual_crores': scenario.revenue_annual_crores,
                        'profit_annual_crores': scenario.profit_annual_crores,
                        'roi_percentage': scenario.roi_percentage,
                        'payback_period_years': scenario.payback_years,
                        'market_share_percentage': scenario.market_share_percentage,
                        'demand_fulfillment_ratio': scenario.demand_fulfillment_ratio,
                        'limiting_factor': production_analysis['resource_constraints']['limiting_factor'],
                        'electricity_utilization_percent': production_analysis['resource_constraints']['electricity_utilization_percent'],
                        'water_utilization_percent': production_analysis['resource_constraints']['water_utilization_percent'],
                        'investment_grade': self.get_investment_grade(scenario.roi_percentage, scenario.payback_years),
                        'risk_assessment': recommended['risk_level'],
                        'scenario_name': recommended['name'],
                        'unmet_demand_kg_day': production_analysis['market_analysis']['unmet_demand_kg_day'],
                        'alternative_scenarios': [
                            {
                                'name': s['name'],
                                'capacity_kg_day': s['scenario'].capacity_kg_day,
                                'capex_crores': s['scenario'].capex_crores,
                                'roi_percentage': s['scenario'].roi_percentage,
                                'risk_level': s['risk_level']
                            } for s in production_analysis['scenarios']
                        ]
                    }
                
            except Exception as e:
                print(f"Economic calculation failed: {e}")
                # Fallback to simple calculation
                pass
        
        # Fallback: Enhanced dynamic calculation based on actual location characteristics
        
        # 1. Get actual resource data from nearest sources
        electricity_capacity_mw = getattr(nearest_energy, 'capacity_mw', 50.0) if nearest_energy else 50.0
        electricity_base_cost = getattr(nearest_energy, 'cost_per_kwh', 3.5) if nearest_energy else 3.5
        energy_type = getattr(nearest_energy, 'type', 'grid') if nearest_energy else 'grid'
        
        water_capacity_lpd = getattr(nearest_water, 'capacity_liters_day', 50000) if nearest_water else 50000
        water_quality = getattr(nearest_water, 'quality_score', 5) if nearest_water else 5
        
        demand_mt_year = getattr(nearest_demand, 'hydrogen_demand_mt_year', 2000) if nearest_demand else 2000
        
        # 2. Calculate location-adjusted electricity cost
        # Energy source type adjustments
        energy_type_factors = {
            'solar': 0.82,      # 18% lower cost due to declining solar prices
            'wind': 0.85,       # 15% lower cost, good capacity factors
            'hydro': 0.88,      # 12% lower cost, stable generation
            'nuclear': 0.90,    # 10% lower cost, baseload power
            'gas': 1.08,        # 8% higher cost due to fuel volatility
            'coal': 1.15,       # 15% higher cost due to carbon pricing
            'grid': 1.0         # Base grid price
        }
        
        # Infrastructure quality adjustments
        if infrastructure_score > 280:
            infra_factor = 0.92  # 8% reduction for excellent infrastructure
        elif infrastructure_score > 220:
            infra_factor = 0.96  # 4% reduction for good infrastructure
        elif infrastructure_score < 160:
            infra_factor = 1.12  # 12% increase for poor infrastructure
        else:
            infra_factor = 1.0
        
        # Distance penalties (from energy_info if available)
        distance_factor = 1.0
        if energy_info and 'distance_km' in energy_info:
            distance_km = energy_info['distance_km']
            if distance_km > 80:
                distance_factor = 1.18  # 18% penalty for very remote
            elif distance_km > 40:
                distance_factor = 1.08  # 8% penalty for remote
        
        effective_electricity_cost = electricity_base_cost * energy_type_factors.get(energy_type, 1.0) * infra_factor * distance_factor
        
        # 3. Calculate hydrogen production cost components
        # Electrolyzer efficiency varies by technology and scale
        if electricity_capacity_mw > 100:
            electrolyzer_efficiency = 0.78  # Large scale, better efficiency
            kwh_per_kg = 53 / electrolyzer_efficiency
        elif electricity_capacity_mw > 30:
            electrolyzer_efficiency = 0.75  # Medium scale
            kwh_per_kg = 55 / electrolyzer_efficiency
        else:
            electrolyzer_efficiency = 0.72  # Small scale
            kwh_per_kg = 57 / electrolyzer_efficiency
        
        electricity_cost_per_kg = effective_electricity_cost * kwh_per_kg
        
        # 4. Water cost calculation - quality and capacity dependent
        base_water_cost_per_kg = 20  # Base cost for 10L per kg H2
        
        # Water quality adjustments
        if water_quality >= 8:
            water_quality_factor = 0.75  # 25% reduction for excellent quality
        elif water_quality >= 6:
            water_quality_factor = 0.85  # 15% reduction for good quality
        elif water_quality <= 3:
            water_quality_factor = 1.35  # 35% increase for poor quality
        else:
            water_quality_factor = 1.0
        
        # Water capacity/scale adjustments
        if water_capacity_lpd > 200000:
            water_scale_factor = 0.80  # 20% reduction for large capacity
        elif water_capacity_lpd > 80000:
            water_scale_factor = 0.90  # 10% reduction for medium capacity
        elif water_capacity_lpd < 20000:
            water_scale_factor = 1.25  # 25% increase for limited capacity
        else:
            water_scale_factor = 1.0
        
        water_cost_per_kg = base_water_cost_per_kg * water_quality_factor * water_scale_factor
        
        # 5. Operations and maintenance costs (location and scale dependent)
        base_om_cost_per_kg = 45  # Base O&M cost
        
        # Scale economies
        if demand_mt_year > 8000:
            scale_factor = 0.85  # 15% reduction for large scale
        elif demand_mt_year > 3000:
            scale_factor = 0.92  # 8% reduction for medium scale
        elif demand_mt_year < 1000:
            scale_factor = 1.20  # 20% increase for small scale
        else:
            scale_factor = 1.0
        
        # Location operational complexity
        if overall_score > 280:
            complexity_factor = 0.88  # 12% reduction for easy operations
        elif overall_score < 180:
            complexity_factor = 1.25  # 25% increase for complex operations
        else:
            complexity_factor = 1.0
        
        om_cost_per_kg = base_om_cost_per_kg * scale_factor * complexity_factor
        
        # 6. Total production cost
        total_production_cost = electricity_cost_per_kg + water_cost_per_kg + om_cost_per_kg
        
        # 7. Risk and profit margins (dynamic based on multiple factors)
        base_margin = 0.18  # 18% base margin
        
        # Market risk adjustments
        if demand_mt_year > 5000:
            market_risk = -0.03  # Reduce margin for large stable markets
        elif demand_mt_year < 1500:
            market_risk = 0.05   # Increase margin for small markets
        else:
            market_risk = 0
        
        # Technology risk adjustments
        tech_risk = 0
        if energy_type in ['solar', 'wind']:
            tech_risk = 0.02  # Small premium for renewable integration challenges
        
        # Location risk adjustments
        if overall_score > 280:
            location_risk = -0.04  # Reduce margin for excellent locations
        elif overall_score < 180:
            location_risk = 0.07   # Increase margin for challenging locations
        else:
            location_risk = 0
        
        total_margin = base_margin + market_risk + tech_risk + location_risk
        total_margin = max(0.10, min(0.30, total_margin))  # Keep margin between 10-30%
        
        final_cost_per_kg = total_production_cost * (1 + total_margin)
        
        # Market reality bounds
        final_cost_per_kg = max(180, min(480, final_cost_per_kg))
        
        # 8. Dynamic capacity calculation based on actual constraints
        # Electricity constraint
        max_capacity_from_electricity = (electricity_capacity_mw * 1000 * 24 * 0.82) / kwh_per_kg  # kg/day, 82% capacity factor
        
        # Water constraint  
        max_capacity_from_water = water_capacity_lpd / 10  # 10L per kg H2
        
        # Market constraint
        max_capacity_from_market = demand_mt_year * 1000 / 300  # kg/day, allowing for 65 days downtime
        
        # Actual daily capacity (most limiting factor)
        daily_capacity = min(max_capacity_from_electricity, max_capacity_from_water, max_capacity_from_market * 1.15)  # 15% overcapacity for growth
        
        # Minimum viable scale check
        daily_capacity = max(daily_capacity, 500)  # Minimum 500 kg/day for economic viability
        
        annual_capacity_mt = daily_capacity * 300 / 1000  # MT/year, 300 operating days
        
        # 9. Financial analysis with dynamic factors
        annual_revenue_cr = annual_capacity_mt * final_cost_per_kg * 1000 / 10000000  # Revenue in crores
        
        # CAPEX calculation - varies significantly with technology and scale
        if daily_capacity > 10000:
            capex_per_kg_day = 95000   # ₹95k per kg/day for large scale
        elif daily_capacity > 5000:
            capex_per_kg_day = 110000  # ₹110k per kg/day for medium scale
        elif daily_capacity > 2000:
            capex_per_kg_day = 130000  # ₹130k per kg/day for small scale
        else:
            capex_per_kg_day = 155000  # ₹155k per kg/day for very small scale
        
        # Technology adjustments
        if energy_type in ['solar', 'wind']:
            capex_per_kg_day *= 1.12  # 12% higher for renewable integration
        elif energy_type == 'grid':
            capex_per_kg_day *= 0.95  # 5% lower for grid connection
        
        # Location adjustments
        if overall_score < 180:
            capex_per_kg_day *= 1.22  # 22% higher for challenging locations
        elif overall_score > 280:
            capex_per_kg_day *= 0.92  # 8% lower for excellent locations
        
        capex_cr = daily_capacity * capex_per_kg_day / 10000000  # CAPEX in crores
        
        # OPEX calculation - varies with efficiency and location
        if overall_score > 280:
            opex_ratio = 0.58  # 58% of revenue for excellent locations
        elif overall_score > 220:
            opex_ratio = 0.64  # 64% of revenue for good locations
        elif overall_score < 180:
            opex_ratio = 0.72  # 72% of revenue for challenging locations
        else:
            opex_ratio = 0.66  # 66% of revenue for average locations
        
        opex_cr = annual_revenue_cr * opex_ratio
        annual_profit_cr = annual_revenue_cr - opex_cr
        
        # 10. Calculate financial metrics
        if annual_profit_cr > 0 and capex_cr > 0:
            payback_years = capex_cr / annual_profit_cr
            roi_percentage = (annual_profit_cr / capex_cr) * 100
            
            # Risk adjustments for financial metrics
            if overall_score < 180:
                roi_percentage *= 0.82  # 18% reduction for high-risk
                payback_years *= 1.25   # 25% longer payback
            elif overall_score > 280:
                roi_percentage *= 1.12  # 12% boost for low-risk
                payback_years *= 0.88   # 12% shorter payback
        else:
            payback_years = float('inf')
            roi_percentage = 0
        
        return {
            'capacity_kg_day': round(daily_capacity, 1),
            'annual_capacity_mt': round(annual_capacity_mt, 1),
            'projected_cost_per_kg': round(final_cost_per_kg, 2),
            'payback_period_years': round(min(25, payback_years), 1) if payback_years != float('inf') else float('inf'),
            'roi_percentage': round(max(1, min(35, roi_percentage)), 1),
            'capex_crores': round(capex_cr, 2),
            'annual_revenue_crores': round(annual_revenue_cr, 2),
            'annual_profit_crores': round(annual_profit_cr, 2),
            'electricity_cost_kwh': round(effective_electricity_cost, 2),
            'production_breakdown': {
                'electricity_cost_per_kg': round(electricity_cost_per_kg, 2),
                'water_cost_per_kg': round(water_cost_per_kg, 2),
                'om_cost_per_kg': round(om_cost_per_kg, 2),
                'margin_percentage': round(total_margin * 100, 1)
            },
            'capacity_constraints': {
                'electricity_limit_kg_day': round(max_capacity_from_electricity, 1),
                'water_limit_kg_day': round(max_capacity_from_water, 1),
                'market_demand_kg_day': round(max_capacity_from_market, 1),
                'limiting_factor': 'electricity' if max_capacity_from_electricity <= min(max_capacity_from_water, max_capacity_from_market) else 
                                 'water' if max_capacity_from_water <= max_capacity_from_market else 'market'
            },
            'dynamic_calculation': True
        }
    
    async def analyze_location(self, location: LocationPoint, 
                             weights: WeightedAnalysisRequest = None) -> LocationPoint:
        """Comprehensive location analysis with database fallback"""
        if not weights:
            # Create default weights with dummy bounds
            from models import SearchBounds
            default_bounds = SearchBounds(north=25.0, south=20.0, east=75.0, west=68.0)
            weights = WeightedAnalysisRequest(bounds=default_bounds)
            
        try:
            # Fetch all data from database
            energy_sources_data = await self.db.energy_sources.find().to_list(1000)
            demand_centers_data = await self.db.demand_centers.find().to_list(1000)
            water_sources_data = await self.db.water_sources.find().to_list(1000)
            water_bodies_data = await self.db.water_bodies.find().to_list(1000)
            gas_pipelines_data = await self.db.gas_pipelines.find().to_list(1000)
            road_networks_data = await self.db.road_networks.find().to_list(1000)
            
            # Convert to Pydantic models
            energy_sources = [EnergySource(**item) for item in energy_sources_data]
            demand_centers = [DemandCenter(**item) for item in demand_centers_data]
            water_sources = [WaterSource(**item) for item in water_sources_data]
            water_bodies = [WaterBody(**item) for item in water_bodies_data]
            gas_pipelines = [GasPipeline(**item) for item in gas_pipelines_data]
            road_networks = [RoadNetwork(**item) for item in road_networks_data]
            
        except Exception as e:
            # Fallback to default/simulated data if database fails
            energy_sources = self._generate_default_energy_sources()
            demand_centers = self._generate_default_demand_centers()
            water_sources = self._generate_default_water_sources()
            water_bodies = []
            gas_pipelines = self._generate_default_gas_pipelines()
            road_networks = self._generate_default_road_networks()
        
        # Calculate individual scores
        energy_score, energy_info = await self.calculate_energy_score(location, energy_sources)
        demand_score, demand_info = await self.calculate_demand_score(location, demand_centers) 
        water_score, water_info = await self.calculate_water_score(location, water_sources, water_bodies)
        pipeline_score, pipeline_info = await self.calculate_pipeline_score(location, gas_pipelines)
        transport_score, transport_info = await self.calculate_transport_score(location, road_networks)
        
        # Calculate economic viability score
        economic_score, economic_info = await self.calculate_economic_viability_score(
            location,
            energy_sources[0] if energy_sources else None,
            demand_centers[0] if demand_centers else None,
            water_sources[0] if water_sources else None
        )
        
        # Enhanced weighted overall score (now includes economic viability)
        infrastructure_score = (
            energy_score * weights.energy_weight +
            demand_score * weights.demand_weight + 
            water_score * weights.water_weight +
            pipeline_score * weights.pipeline_weight +
            transport_score * weights.transport_weight
        )
        
        # Final score combines infrastructure (70%) and economics (30%)
        overall_score = (infrastructure_score * 0.70) + (economic_score * 0.30)
        
        # Production metrics with economic analysis
        production_metrics = await self.calculate_production_metrics(
            overall_score, energy_info, demand_info, location,
            energy_score, water_score, infrastructure_score,
            energy_sources[0] if energy_sources else None,
            demand_centers[0] if demand_centers else None, 
            water_sources[0] if water_sources else None
        )
        
        # Debug: Print production metrics to see what we're returning
        print(f"📊 Production Metrics for location {location.latitude:.4f}, {location.longitude:.4f}:")
        print(f"   Cost per kg: ₹{production_metrics.get('projected_cost_per_kg', 'N/A')}")
        print(f"   Annual capacity: {production_metrics.get('annual_capacity_mt', 'N/A')} MT")
        print(f"   Payback period: {production_metrics.get('payback_period_years', 'N/A')} years")
        print(f"   ROI: {production_metrics.get('roi_percentage', 'N/A')}%")
        print(f"   Full metrics: {production_metrics}")
        print("---")
        
        # Determine overall grade based on final score
        overall_grade = self._get_overall_grade(overall_score)
        
        return {
            'location': {'latitude': location.latitude, 'longitude': location.longitude},
            'overall_score': round(overall_score, 1),
            'infrastructure_score': round(infrastructure_score, 1),
            'economic_score': round(economic_score, 1),
            'overall_grade': overall_grade,
            
            # Individual infrastructure scores
            'energy_score': round(energy_score, 1),
            'demand_score': round(demand_score, 1),
            'water_score': round(water_score, 1),
            'pipeline_score': round(pipeline_score, 1),
            'transport_score': round(transport_score, 1),
            
            # Detailed information
            'nearest_energy': energy_info,
            'nearest_demand': demand_info,
            'nearest_water': water_info,
            'nearest_pipeline': pipeline_info,
            'nearest_transport': transport_info,
            'economic_analysis': economic_info,
            'production_metrics': production_metrics
        }
    
    def get_investment_grade(self, roi_percentage: float, payback_years: float) -> str:
        """Convert ROI and payback to investment grade"""
        if roi_percentage >= 25 and payback_years <= 4:
            return 'A+ (Excellent)'
        elif roi_percentage >= 20 and payback_years <= 5:
            return 'A (Very Good)'
        elif roi_percentage >= 15 and payback_years <= 6:
            return 'B+ (Good)'
        elif roi_percentage >= 10 and payback_years <= 8:
            return 'B (Acceptable)'
        elif roi_percentage >= 5 and payback_years <= 12:
            return 'C (Below Average)'
        else:
            return 'D (Poor)'
    
    def _get_overall_grade(self, score: float) -> str:
        """Convert overall score to investment grade"""
        if score >= 85:
            return 'AAA (Prime Investment)'
        elif score >= 75:
            return 'AA (Excellent Investment)'  
        elif score >= 65:
            return 'A (Good Investment)'
        elif score >= 55:
            return 'BBB (Acceptable Investment)'
        elif score >= 45:
            return 'BB (Speculative Investment)'
        elif score >= 35:
            return 'B (High Risk Investment)'
        else:
            return 'C (Not Recommended)'
            
    def _generate_default_energy_sources(self):
        """Generate default energy sources for Gujarat when DB is unavailable"""
        return [
            EnergySource(
                name="Charanka Solar Park",
                type="Solar",
                location=LocationPoint(latitude=23.3, longitude=71.2),
                capacity_mw=590,
                cost_per_kwh=2.5,
                annual_generation_gwh=1300,
                operator="Gujarat Urja Vikas Nigam Limited",
                availability_factor=0.22
            ),
            EnergySource(
                name="Mundra Solar Park", 
                type="Solar",
                location=LocationPoint(latitude=22.8, longitude=69.7),
                capacity_mw=750,
                cost_per_kwh=2.3,
                annual_generation_gwh=1650,
                operator="Adani Solar Energy Limited",
                availability_factor=0.24
            ),
            EnergySource(
                name="Dhuvaran Solar Complex",
                type="Solar", 
                location=LocationPoint(latitude=21.6, longitude=72.9),
                capacity_mw=400,
                cost_per_kwh=2.7,
                annual_generation_gwh=875,
                operator="Gujarat State Electricity Corporation",
                availability_factor=0.21
            )
        ]
        
    def _generate_default_demand_centers(self):
        """Generate default demand centers for Gujarat when DB is unavailable"""
        return [
            DemandCenter(
                name="Kandla Port & SEZ",
                type="Port",
                location=LocationPoint(latitude=23.0, longitude=70.2),
                hydrogen_demand_mt_year=25000,
                current_hydrogen_source="Natural Gas SMR",
                green_transition_potential="High",
                willingness_to_pay=8.5
            ),
            DemandCenter(
                name="GIDC Ankleshwar Chemical Complex",
                type="Chemical",
                location=LocationPoint(latitude=21.6, longitude=73.0),
                hydrogen_demand_mt_year=35000,
                current_hydrogen_source="Naphtha Reforming",
                green_transition_potential="High",
                willingness_to_pay=9.2
            ),
            DemandCenter(
                name="Mundra Port Industrial Zone",
                type="Port",
                location=LocationPoint(latitude=22.8, longitude=69.7),
                hydrogen_demand_mt_year=30000,
                current_hydrogen_source="Natural Gas SMR",
                green_transition_potential="Medium",
                willingness_to_pay=8.8
            )
        ]
        
    def _generate_default_water_sources(self):
        """Generate default water sources for Gujarat when DB is unavailable"""
        return [
            WaterSource(
                name="Narmada Main Canal",
                type="Canal",
                location=LocationPoint(latitude=22.5, longitude=72.1),
                capacity_liters_day=500000000,
                quality_score=8.5,
                seasonal_availability="Perennial",
                extraction_cost=0.002,
                regulatory_clearance=True
            ),
            WaterSource(
                name="Tapi River",
                type="River", 
                location=LocationPoint(latitude=21.2, longitude=72.8),
                capacity_liters_day=200000000,
                quality_score=7.2,
                seasonal_availability="Seasonal",
                extraction_cost=0.003,
                regulatory_clearance=True
            ),
            WaterSource(
                name="Kutch Groundwater",
                type="Groundwater",
                location=LocationPoint(latitude=23.2, longitude=69.8),
                capacity_liters_day=100000000,
                quality_score=6.8,
                seasonal_availability="Perennial",
                extraction_cost=0.005,
                regulatory_clearance=True
            )
        ]
        
    def _generate_default_gas_pipelines(self):
        """Generate default gas pipelines for Gujarat when DB is unavailable"""
        return [
            GasPipeline(
                name="Gujarat Gas Distribution Network",
                operator="Gujarat Gas Limited",
                capacity_mmscmd=45,
                diameter_inches=24,
                pressure_kg_cm2=40,
                pipeline_type="Natural Gas",
                connection_cost=50000,  # Cost per km
                route=[
                    LocationPoint(latitude=23.0, longitude=70.0),
                    LocationPoint(latitude=22.5, longitude=71.0),
                    LocationPoint(latitude=22.0, longitude=72.0),
                    LocationPoint(latitude=21.5, longitude=73.0)
                ]
            )
        ]
        
    def _generate_default_road_networks(self):
        """Generate default road networks for Gujarat when DB is unavailable"""
        return [
            RoadNetwork(
                name="NH-27 (Porbandar-Silchar Highway)",
                type="National Highway",
                connectivity_score=88,
                transport_capacity="Heavy",
                condition="Good",
                toll_cost_per_km=2.5,
                route=[
                    LocationPoint(latitude=22.0, longitude=69.5),
                    LocationPoint(latitude=22.5, longitude=70.5),
                    LocationPoint(latitude=23.0, longitude=71.5)
                ]
            ),
            RoadNetwork(
                name="Golden Quadrilateral (Gujarat Section)",
                type="National Highway",
                connectivity_score=98,
                transport_capacity="Heavy",
                condition="Excellent", 
                toll_cost_per_km=3.0,
                route=[
                    LocationPoint(latitude=21.5, longitude=72.0),
                    LocationPoint(latitude=22.0, longitude=72.5),
                    LocationPoint(latitude=22.5, longitude=73.0)
                ]
            )
        ]