import math
from typing import List, Dict, Tuple
from models import (
    LocationPoint, OptimalLocation, EnergySource, DemandCenter, 
    WaterSource, GasPipeline, RoadNetwork, WaterBody, WeightedAnalysisRequest
)
from database import get_database
from .economic_calculator import EnhancedEconomicCalculator
import asyncio

class HydrogenLocationOptimizer:
    def __init__(self):
        self.db = get_database()
        self.economic_calculator = EnhancedEconomicCalculator()
        
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
                                               nearest_water: WaterSource = None,
                                               *, discount_rate: float = 0.12, horizon_years: int = 10) -> Tuple[float, dict]:
        """Calculate economic viability score based on financial metrics"""
        
        if not (nearest_energy and nearest_demand and nearest_water):
            # Fallback to simple economic estimation
            return 50, {'simplified': True, 'message': 'Limited data for full economic analysis'}
        
        try:
            # Calculate economics for optimal plant size (1000 kg/day)
            analysis = self.economic_calculator.calculate_comprehensive_economics(
                location, nearest_energy, nearest_demand, nearest_water, 1000, discount_rate=discount_rate, horizon_years=horizon_years
            )
            
            # Economic scoring factors (0-100 each)
            
            # 1. ROI Score (0-100) - Higher ROI = better score
            roi_score = 0
            if analysis.roi_percentage > 0:
                if analysis.roi_percentage >= 25:
                    roi_score = 100
                elif analysis.roi_percentage >= 20:
                    roi_score = 90
                elif analysis.roi_percentage >= 15:
                    roi_score = 75
                elif analysis.roi_percentage >= 10:
                    roi_score = 50
                elif analysis.roi_percentage >= 5:
                    roi_score = 25
                else:
                    roi_score = 10
            
            # 2. Payback Period Score (0-100) - Shorter payback = better score
            payback_score = 0
            if analysis.payback_period_years > 0:
                if analysis.payback_period_years <= 4:
                    payback_score = 100
                elif analysis.payback_period_years <= 6:
                    payback_score = 80
                elif analysis.payback_period_years <= 8:
                    payback_score = 60
                elif analysis.payback_period_years <= 10:
                    payback_score = 40
                elif analysis.payback_period_years <= 12:
                    payback_score = 20
                else:
                    payback_score = 5
            
            # 3. Production Cost Score (0-100) - Lower cost = better score
            cost_score = 0
            if analysis.hydrogen_selling_price_per_kg > 0:
                if analysis.hydrogen_selling_price_per_kg <= 250:
                    cost_score = 100
                elif analysis.hydrogen_selling_price_per_kg <= 300:
                    cost_score = 80
                elif analysis.hydrogen_selling_price_per_kg <= 350:
                    cost_score = 60
                elif analysis.hydrogen_selling_price_per_kg <= 400:
                    cost_score = 40
                elif analysis.hydrogen_selling_price_per_kg <= 450:
                    cost_score = 20
                else:
                    cost_score = 5
            
            # 4. NPV Score (0-100) - Higher NPV = better score
            npv_score = 0
            if analysis.npv_10_years > 0:
                npv_crores = analysis.npv_10_years / 1_00_00_000
                if npv_crores >= 20:
                    npv_score = 100
                elif npv_crores >= 15:
                    npv_score = 85
                elif npv_crores >= 10:
                    npv_score = 70
                elif npv_crores >= 5:
                    npv_score = 50
                elif npv_crores >= 1:
                    npv_score = 30
                else:
                    npv_score = 10
            
            # 5. Profit Margin Score (0-100)
            profit_margin = (analysis.annual_profit / analysis.annual_revenue) * 100 if analysis.annual_revenue > 0 else 0
            margin_score = 0
            if profit_margin >= 40:
                margin_score = 100
            elif profit_margin >= 30:
                margin_score = 80
            elif profit_margin >= 20:
                margin_score = 60
            elif profit_margin >= 10:
                margin_score = 40
            elif profit_margin >= 5:
                margin_score = 20
            else:
                margin_score = 5
            
            # Weighted combination of economic factors
            economic_score = (
                roi_score * 0.25 +          # 25% weight on ROI
                payback_score * 0.25 +      # 25% weight on payback
                cost_score * 0.20 +         # 20% weight on production cost
                npv_score * 0.15 +          # 15% weight on NPV
                margin_score * 0.15         # 15% weight on profit margin
            )
            
            return economic_score, {
                'roi_percentage': analysis.roi_percentage,
                'roi_score': roi_score,
                'payback_years': analysis.payback_period_years,
                'payback_score': payback_score,
                'production_cost_per_kg': analysis.hydrogen_selling_price_per_kg,
                'cost_score': cost_score,
                'npv_10_years_crores': analysis.npv_10_years / 1_00_00_000,
                'npv_score': npv_score,
                'discount_rate': discount_rate,
                'horizon_years': horizon_years,
                'profit_margin_percentage': profit_margin,
                'margin_score': margin_score,
                'overall_economic_score': economic_score,
                'economic_grade': self._get_economic_grade(economic_score)
            }
            
        except Exception as e:
            print(f"Economic viability calculation failed: {e}")
            return 30, {'error': str(e), 'fallback': True}
    
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
                                         nearest_energy: EnergySource = None,
                                         nearest_demand: DemandCenter = None,
                                         nearest_water: WaterSource = None,
                                         *, discount_rate: float = 0.12, horizon_years: int = 10) -> dict:
        """Calculate detailed production cost and capacity with economic analysis"""
        
        # If we have actual infrastructure data, use detailed economic calculation
        if nearest_energy and nearest_demand and nearest_water:
            try:
                # Calculate for different plant capacities
                capacities = [500, 1000, 2000]  # kg/day
                economic_analyses = {}
                
                for capacity in capacities:
                    analysis = self.economic_calculator.calculate_comprehensive_economics(
                        location, nearest_energy, nearest_demand, nearest_water, capacity, discount_rate=discount_rate, horizon_years=horizon_years
                    )
                    
                    economic_analyses[f"{capacity}_kg_day"] = {
                        'capacity_kg_day': capacity,
                        'annual_capacity_mt': capacity * 330 / 1000,  # 330 operating days
                        'capex_crores': analysis.total_capex / 1_00_00_000,
                        'opex_annual_crores': analysis.total_opex_annual / 1_00_00_000,
                        'revenue_annual_crores': analysis.annual_revenue / 1_00_00_000,
                        'profit_annual_crores': analysis.annual_profit / 1_00_00_000,
                        'projected_cost_per_kg': analysis.hydrogen_selling_price_per_kg,
                        'roi_percentage': analysis.roi_percentage,
                        'payback_period_years': analysis.payback_period_years,
                        'npv_10_years_crores': analysis.npv_10_years / 1_00_00_000,
                        'irr_percentage': analysis.irr_percentage,
                        'discount_rate': discount_rate,
                        'horizon_years': horizon_years,
                        
                        # Cost breakdown
                        'cost_breakdown': {
                            'electricity_cost_annual': analysis.electricity_cost_annual,
                            'water_cost_annual': analysis.water_cost_annual,
                            'labor_cost_annual': analysis.labor_cost_annual,
                            'maintenance_cost_annual': analysis.maintenance_cost_annual,
                            'transportation_cost_annual': analysis.transportation_cost_annual
                        },
                        
                        # Investment breakdown
                        'investment_breakdown': {
                            'plant_construction': analysis.plant_construction_cost,
                            'electrolyzer_cost': analysis.electrolyzer_cost,
                            'infrastructure_cost': analysis.infrastructure_cost,
                            'land_acquisition': analysis.land_acquisition_cost
                        }
                    }
                
                # Return the most economically viable option
                best_option = min(economic_analyses.values(), 
                                key=lambda x: x['payback_period_years'] if x['roi_percentage'] > 15 else float('inf'))
                
                return best_option
                
            except Exception as e:
                print(f"Economic calculation failed: {e}")
                # Fallback to simple calculation
                pass
        
        # Fallback: Simple calculation based on score
        base_cost = 350  # Base cost per kg in INR
        base_capacity = 15000  # Base capacity in MT/year
        
        # Cost reduction factors based on infrastructure quality
        if overall_score > 250:
            cost_reduction = (overall_score - 200) / 100 * 80  # Up to 80 INR reduction
            base_cost = max(200, base_cost - cost_reduction)
            
        # Capacity increase factors  
        if overall_score > 200:
            capacity_multiplier = 1 + (overall_score - 200) / 200
            base_capacity = int(base_capacity * capacity_multiplier)
            
        return {
            'capacity_kg_day': base_capacity * 1000 / 330,  # Convert to kg/day
            'annual_capacity_mt': base_capacity,
            'projected_cost_per_kg': round(base_cost, 2),
            'payback_period_years': max(5, 12 - (overall_score - 200) / 50),
            'roi_percentage': min(30, max(10, (overall_score - 150) / 10)),
            'simplified_calculation': True
        }
    
    async def analyze_location(self, location: LocationPoint, 
                             weights: WeightedAnalysisRequest = None) -> LocationPoint:
        """Comprehensive location analysis"""
        if not weights:
            weights = WeightedAnalysisRequest(bounds=None)
            
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
        
        # Calculate individual scores
        energy_score, energy_info = await self.calculate_energy_score(location, energy_sources)
        demand_score, demand_info = await self.calculate_demand_score(location, demand_centers) 
        water_score, water_info = await self.calculate_water_score(location, water_sources, water_bodies)
        pipeline_score, pipeline_info = await self.calculate_pipeline_score(location, gas_pipelines)
        transport_score, transport_info = await self.calculate_transport_score(location, road_networks)
        
        # Determine nearest real assets to the requested location
        nearest_energy_asset = None
        nearest_demand_asset = None
        nearest_water_asset = None

        if energy_sources:
            nearest_energy_asset, _ = await self.get_nearest_asset(location, energy_sources)
        if demand_centers:
            nearest_demand_asset, _ = await self.get_nearest_asset(location, demand_centers)
        if water_sources:
            nearest_water_asset, _ = await self.get_nearest_asset(location, water_sources)

        # Calculate economic viability score using nearest assets
        economic_score, economic_info = await self.calculate_economic_viability_score(
            location,
            nearest_energy_asset,
            nearest_demand_asset,
            nearest_water_asset
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
            nearest_energy_asset,
            nearest_demand_asset,
            nearest_water_asset
        )
        
        # Determine overall grade based on final score
        overall_grade = self._get_overall_grade(overall_score)
        
        return {
            'location': location,
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