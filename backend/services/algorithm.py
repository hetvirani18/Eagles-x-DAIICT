import math
from typing import List, Dict, Tuple
from models import (
    LocationPoint, OptimalLocation, EnergySource, DemandCenter, 
    WaterSource, GasPipeline, RoadNetwork, WaterBody, WeightedAnalysisRequest
)
from database import get_database
import asyncio

class HydrogenLocationOptimizer:
    def __init__(self):
        self.db = get_database()
        # Note: Geospatial indexes will be created on first use
        
    async def ensure_geospatial_indexes(self):
        """Ensure geospatial indexes exist for location-based queries"""
        try:
            collections = [
                "energy_sources", "demand_centers", "water_sources", 
                "water_bodies", "gas_pipelines", "road_networks"
            ]
            
            for collection_name in collections:
                collection = getattr(self.db, collection_name)
                # Create 2dsphere index on location field for geospatial queries
                await collection.create_index([("location", "2dsphere")])
                
            print("✅ Geospatial indexes ensured for optimal performance")
            
        except Exception as e:
            print(f"⚠️ Warning: Could not create geospatial indexes: {e}")
            
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
    
    async def calculate_production_metrics(self, overall_score: float, 
                                         energy_info: dict, demand_info: dict) -> dict:
        """Calculate production cost and capacity based on location factors"""
        base_cost = 3.5  # Base cost per kg in INR
        base_capacity = 15000  # Base capacity in MT/year
        
        # Cost reduction factors
        if overall_score > 250:
            cost_reduction = (overall_score - 200) / 100 * 0.8  # Up to 80% reduction
            base_cost = max(2.0, base_cost - cost_reduction)
            
        # Capacity increase factors  
        if overall_score > 200:
            capacity_multiplier = 1 + (overall_score - 200) / 200
            base_capacity = int(base_capacity * capacity_multiplier)
            
        return {
            'projected_cost_per_kg': round(base_cost, 2),
            'annual_capacity_mt': base_capacity,
            'payback_period_years': max(5, 10 - (overall_score - 200) / 50),
            'roi_percentage': min(25, max(8, (overall_score - 150) / 10))
        }
    
    async def get_nearby_assets(self, location: LocationPoint, collection_name: str, 
                              max_distance_km: float = 200) -> List[dict]:
        """Get assets within specified distance from location using geospatial query"""
        try:
            # Ensure geospatial indexes exist
            collection = getattr(self.db, collection_name)
            try:
                await collection.create_index([("location", "2dsphere")])
            except Exception:
                pass  # Index may already exist
            
            # MongoDB geospatial query to find nearby assets
            query = {
                "location": {
                    "$near": {
                        "$geometry": {
                            "type": "Point",
                            "coordinates": [location.longitude, location.latitude]
                        },
                        "$maxDistance": max_distance_km * 1000  # Convert to meters
                    }
                }
            }
            
            # MongoDB automatically sorts by distance when using $near, limit to top 10
            nearby_assets = await collection.find(query).limit(10).to_list(10)
            return nearby_assets
            
        except Exception as e:
            # Fallback to fetching all if geospatial query fails
            print(f"Geospatial query failed for {collection_name}, using fallback: {e}")
            collection = getattr(self.db, collection_name)
            all_assets = await collection.find().to_list(100)
            
            # Manual distance sorting as fallback
            assets_with_distance = []
            for asset in all_assets:
                if 'location' in asset and 'latitude' in asset['location'] and 'longitude' in asset['location']:
                    distance = self.calculate_distance(
                        location, 
                        LocationPoint(latitude=asset['location']['latitude'], longitude=asset['location']['longitude'])
                    )
                    if distance <= max_distance_km:
                        assets_with_distance.append((asset, distance))
            
            # Sort by distance and return top 10
            assets_with_distance.sort(key=lambda x: x[1])
            return [asset for asset, distance in assets_with_distance[:10]]

    async def analyze_location(self, location: LocationPoint, 
                             weights: WeightedAnalysisRequest = None) -> LocationPoint:
        """Optimized location analysis - only fetches nearby assets"""
        if not weights:
            weights = WeightedAnalysisRequest(bounds=None)
            
        # Fetch only nearby data from database (MAJOR PERFORMANCE IMPROVEMENT)
        energy_sources_data = await self.get_nearby_assets(location, "energy_sources", 150)
        demand_centers_data = await self.get_nearby_assets(location, "demand_centers", 100) 
        water_sources_data = await self.get_nearby_assets(location, "water_sources", 80)
        water_bodies_data = await self.get_nearby_assets(location, "water_bodies", 80)
        gas_pipelines_data = await self.get_nearby_assets(location, "gas_pipelines", 50)
        road_networks_data = await self.get_nearby_assets(location, "road_networks", 30)
        
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
        
        # Calculate weighted overall score
        overall_score = (
            energy_score * weights.energy_weight +
            demand_score * weights.demand_weight + 
            water_score * weights.water_weight +
            pipeline_score * weights.pipeline_weight +
            transport_score * weights.transport_weight
        )
        
        # Production metrics
        production_metrics = await self.calculate_production_metrics(overall_score, energy_info, demand_info)
        
        return {
            'location': location,
            'overall_score': round(overall_score, 1),
            'energy_score': round(energy_score, 1),
            'demand_score': round(demand_score, 1),
            'water_score': round(water_score, 1),
            'pipeline_score': round(pipeline_score, 1),
            'transport_score': round(transport_score, 1),
            'nearest_energy': energy_info,
            'nearest_demand': demand_info,
            'nearest_water': water_info,
            'nearest_pipeline': pipeline_info,
            'nearest_transport': transport_info,
            'production_metrics': production_metrics
        }
    
    async def analyze_single_location_optimized(self, location: LocationPoint, 
                                              weights: WeightedAnalysisRequest = None) -> dict:
        """
        Ultra-optimized analysis for single location queries
        Only processes the most relevant nearby assets
        """
        if not weights:
            weights = WeightedAnalysisRequest(bounds=None)
            
        # Use concurrent queries with smaller radius for faster results and STRICT FILTERING
        tasks = [
            self.get_nearby_assets(location, "energy_sources", 100),  # Matches frontend: 100km
            self.get_nearby_assets(location, "demand_centers", 60),   # Matches frontend: 60km  
            self.get_nearby_assets(location, "water_sources", 50),    # Matches frontend: 50km
            self.get_nearby_assets(location, "water_bodies", 50),     # Matches frontend: 50km
            self.get_nearby_assets(location, "gas_pipelines", 40),    # Matches frontend: 40km
            self.get_nearby_assets(location, "road_networks", 25)     # Matches frontend: 25km
        ]
        
        # Run all queries concurrently for maximum speed
        results = await asyncio.gather(*tasks)
        
        (energy_sources_data, demand_centers_data, water_sources_data, 
         water_bodies_data, gas_pipelines_data, road_networks_data) = results
        
        # Convert to Pydantic models (only process top 3 closest for consistency with frontend)
        energy_sources = [EnergySource(**item) for item in energy_sources_data[:3]]  # Top 3 only
        demand_centers = [DemandCenter(**item) for item in demand_centers_data[:3]]   # Top 3 only
        water_sources = [WaterSource(**item) for item in water_sources_data[:3]]      # Top 3 only
        water_bodies = [WaterBody(**item) for item in water_bodies_data[:2]]          # Top 2 only
        gas_pipelines = [GasPipeline(**item) for item in gas_pipelines_data[:2]]      # Top 2 only
        road_networks = [RoadNetwork(**item) for item in road_networks_data[:2]]      # Top 2 only
        
        # Calculate individual scores (same logic, faster execution)
        energy_score, energy_info = await self.calculate_energy_score(location, energy_sources)
        demand_score, demand_info = await self.calculate_demand_score(location, demand_centers) 
        water_score, water_info = await self.calculate_water_score(location, water_sources, water_bodies)
        pipeline_score, pipeline_info = await self.calculate_pipeline_score(location, gas_pipelines)
        transport_score, transport_info = await self.calculate_transport_score(location, road_networks)
        
        # Calculate weighted overall score
        overall_score = (
            energy_score * weights.energy_weight +
            demand_score * weights.demand_weight + 
            water_score * weights.water_weight +
            pipeline_score * weights.pipeline_weight +
            transport_score * weights.transport_weight
        )
        
        # Production metrics
        production_metrics = await self.calculate_production_metrics(overall_score, energy_info, demand_info)
        
        return {
            'location': location,
            'overall_score': round(overall_score, 1),
            'energy_score': round(energy_score, 1),
            'demand_score': round(demand_score, 1),
            'water_score': round(water_score, 1),
            'pipeline_score': round(pipeline_score, 1),
            'transport_score': round(transport_score, 1),
            'nearest_energy': energy_info,
            'nearest_demand': demand_info,
            'nearest_water': water_info,
            'nearest_pipeline': pipeline_info,
            'nearest_transport': transport_info,
            'production_metrics': production_metrics,
            'optimization_info': {
                'query_type': 'single_location_optimized',
                'assets_processed': {
                    'energy_sources': len(energy_sources),
                    'demand_centers': len(demand_centers),
                    'water_sources': len(water_sources),
                    'water_bodies': len(water_bodies),
                    'gas_pipelines': len(gas_pipelines),
                    'road_networks': len(road_networks)
                }
            }
        }