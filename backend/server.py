from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from typing import List, Optional
import asyncio
from contextlib import asynccontextmanager

# Import our models and services
from models import *
from database import connect_to_mongo, close_mongo_connection, get_database
from services.algorithm import HydrogenLocationOptimizer

# Import advanced analysis routes
from advanced_analysis_routes import router as advanced_analysis_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Initialize algorithm service
optimizer = HydrogenLocationOptimizer()

# Modern lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    # Populate data if collections are empty
    db = get_database()
    energy_count = await db.energy_sources.count_documents({})
    if energy_count == 0:
        from data.populate_data import populate_comprehensive_data
        await populate_comprehensive_data()
    
    yield
    
    # Shutdown
    await close_mongo_connection()

# Create the main app with lifespan
app = FastAPI(
    title="H₂-Optimize API",
    description="Green Hydrogen Location Intelligence API for Gujarat",
    version="1.0.0",
    lifespan=lifespan
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "H₂-Optimize API - Green Hydrogen Location Intelligence"}

# Energy Sources endpoints
@api_router.get("/energy-sources", response_model=List[EnergySource])
async def get_energy_sources():
    """Get all renewable energy sources in Gujarat"""
    db = get_database()
    sources_data = await db.energy_sources.find().to_list(1000)
    return [EnergySource(**source) for source in sources_data]

@api_router.post("/energy-sources", response_model=EnergySource)
async def create_energy_source(source: EnergySourceCreate):
    """Create a new energy source"""
    db = get_database()
    energy_source = EnergySource(**source.dict())
    await db.energy_sources.insert_one(energy_source.dict())
    return energy_source

# Demand Centers endpoints
@api_router.get("/demand-centers", response_model=List[DemandCenter])
async def get_demand_centers():
    """Get all industrial demand centers"""
    db = get_database()
    centers_data = await db.demand_centers.find().to_list(1000)
    return [DemandCenter(**center) for center in centers_data]

@api_router.post("/demand-centers", response_model=DemandCenter)
async def create_demand_center(center: DemandCenterCreate):
    """Create a new demand center"""
    db = get_database()
    demand_center = DemandCenter(**center.dict())
    await db.demand_centers.insert_one(demand_center.dict())
    return demand_center

# Water Sources endpoints
@api_router.get("/water-sources", response_model=List[WaterSource])
async def get_water_sources():
    """Get all water sources"""
    db = get_database()
    sources_data = await db.water_sources.find().to_list(1000)
    return [WaterSource(**source) for source in sources_data]

@api_router.post("/water-sources", response_model=WaterSource)
async def create_water_source(source: WaterSourceCreate):
    """Create a new water source"""
    db = get_database()
    water_source = WaterSource(**source.dict())
    await db.water_sources.insert_one(water_source.dict())
    return water_source

# Water Bodies endpoints
@api_router.get("/water-bodies", response_model=List[WaterBody])
async def get_water_bodies():
    """Get all water bodies"""
    db = get_database()
    bodies_data = await db.water_bodies.find().to_list(1000)
    return [WaterBody(**body) for body in bodies_data]

@api_router.post("/water-bodies", response_model=WaterBody)
async def create_water_body(body: WaterBodyCreate):
    """Create a new water body"""
    db = get_database()
    water_body = WaterBody(**body.dict())
    await db.water_bodies.insert_one(water_body.dict())
    return water_body

# Gas Pipelines endpoints
@api_router.get("/gas-pipelines", response_model=List[GasPipeline])
async def get_gas_pipelines():
    """Get all gas pipeline networks"""
    db = get_database()
    pipelines_data = await db.gas_pipelines.find().to_list(1000)
    return [GasPipeline(**pipeline) for pipeline in pipelines_data]

@api_router.post("/gas-pipelines", response_model=GasPipeline)
async def create_gas_pipeline(pipeline: GasPipelineCreate):
    """Create a new gas pipeline"""
    db = get_database()
    gas_pipeline = GasPipeline(**pipeline.dict())
    await db.gas_pipelines.insert_one(gas_pipeline.dict())
    return gas_pipeline

# Road Networks endpoints
@api_router.get("/road-networks", response_model=List[RoadNetwork])
async def get_road_networks():
    """Get all road transportation networks"""
    db = get_database()
    roads_data = await db.road_networks.find().to_list(1000)
    return [RoadNetwork(**road) for road in roads_data]

@api_router.post("/road-networks", response_model=RoadNetwork)
async def create_road_network(road: RoadNetworkCreate):
    """Create a new road network"""
    db = get_database()
    road_network = RoadNetwork(**road.dict())
    await db.road_networks.insert_one(road_network.dict())
    return road_network

# Cities/Search endpoints
@api_router.get("/cities", response_model=List[City])
async def get_cities(q: Optional[str] = Query(None, description="Search query for city names")):
    """Search cities in Gujarat"""
    db = get_database()
    
    if q:
        # Case-insensitive search
        query = {"name": {"$regex": q, "$options": "i"}}
        cities_data = await db.cities.find(query).limit(10).to_list(10)
    else:
        cities_data = await db.cities.find().to_list(100)
    
    return [City(**city) for city in cities_data]

# New Infrastructure Endpoints
@api_router.get("/pipelines", response_model=List[Pipeline])
async def get_pipelines(type: Optional[str] = Query(None, description="Filter by pipeline type")):
    """Get pipeline infrastructure data"""
    db = get_database()
    
    query = {}
    if type:
        query["type"] = type
        
    pipelines_data = await db.pipelines.find(query).to_list(100)
    return [Pipeline(**pipeline) for pipeline in pipelines_data]

@api_router.get("/storage-facilities", response_model=List[StorageFacility])
async def get_storage_facilities(type: Optional[str] = Query(None, description="Filter by storage type")):
    """Get storage facility data"""
    db = get_database()
    
    query = {}
    if type:
        query["type"] = type
        
    storage_data = await db.storage_facilities.find(query).to_list(100)
    return [StorageFacility(**storage) for storage in storage_data]

@api_router.get("/distribution-hubs", response_model=List[DistributionHub])
async def get_distribution_hubs(type: Optional[str] = Query(None, description="Filter by distribution type")):
    """Get distribution hub data"""
    db = get_database()
    
    query = {}
    if type:
        query["type"] = type
        
    hubs_data = await db.distribution_hubs.find(query).to_list(100)
    return [DistributionHub(**hub) for hub in hubs_data]

# Algorithm endpoints
@api_router.post("/analyze-location")
async def analyze_location(location: LocationPoint, weights: Optional[WeightedAnalysisRequest] = None):
    """Analyze a specific location for hydrogen plant suitability"""
    try:
        analysis = await optimizer.analyze_location(location, weights)
        return analysis
    except Exception as e:
        logging.error(f"Location analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@api_router.post("/calculate-optimal-locations")
async def calculate_optimal_locations(
    bounds: SearchBounds,
    weights: Optional[WeightedAnalysisRequest] = None,
    limit: int = Query(10, description="Maximum number of locations to return")
):
    """Calculate optimal locations within specified bounds using grid analysis"""
    try:
        optimal_locations = []
        
        # Create a grid within bounds for analysis
        lat_step = (bounds.north - bounds.south) / 20  # 20x20 grid
        lng_step = (bounds.east - bounds.west) / 20
        
        # Analyze grid points
        for i in range(10):  # Reduced for performance
            for j in range(10):
                lat = bounds.south + (i * lat_step * 2)  # Skip some points
                lng = bounds.west + (j * lng_step * 2)
                
                location = LocationPoint(latitude=lat, longitude=lng)
                analysis = await optimizer.analyze_location(location, weights)
                
                if analysis['overall_score'] > 200:  # Only include good locations
                    optimal_locations.append(analysis)
        
        # Sort by score and return top results
        optimal_locations.sort(key=lambda x: x['overall_score'], reverse=True)
        return optimal_locations[:limit]
        
    except Exception as e:
        logging.error(f"Optimal location calculation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Calculation failed: {str(e)}")

@api_router.get("/optimal-locations")  
async def get_optimal_locations():
    """Get optimal locations using pure algorithm calculation with grid-based analysis"""
    try:
        logging.info("Starting algorithmic optimal locations calculation...")
        
        # Define Gujarat bounds for comprehensive grid analysis
        gujarat_bounds = SearchBounds(
            north=24.7,   # Northern Gujarat border
            south=20.1,   # Southern Gujarat border  
            east=74.4,    # Eastern Gujarat border
            west=68.1     # Western Gujarat border (Arabian Sea)
        )
        
        # Create analysis weights for location optimization
        weights = WeightedAnalysisRequest(
            bounds=gujarat_bounds,
            energy_weight=35,      # High weight for renewable energy
            demand_weight=25,      # Moderate weight for demand proximity
            water_weight=20,       # Important for electrolysis
            pipeline_weight=10,    # Lower weight for existing gas infrastructure
            transport_weight=10    # Lower weight for road connectivity
        )
        
        optimal_locations = []
        analyzed_count = 0
        
        # Intelligent grid analysis - focus on promising areas
        # Use a smart grid that concentrates on areas with known renewable potential
        lat_step = (gujarat_bounds.north - gujarat_bounds.south) / 25  # 25x25 grid
        lng_step = (gujarat_bounds.east - gujarat_bounds.west) / 25
        
        # Analyze grid points with algorithm
        for i in range(0, 25, 2):  # Step by 2 for performance (12x12 effective grid)
            for j in range(0, 25, 2):
                lat = gujarat_bounds.south + (i * lat_step)
                lng = gujarat_bounds.west + (j * lng_step)
                
                location = LocationPoint(latitude=lat, longitude=lng)
                analyzed_count += 1
                
                try:
                    # Use algorithm to analyze each location
                    analysis = await optimizer.analyze_location(location, weights)
                    
                    # Only include locations with significant potential
                    if analysis['overall_score'] > 150:  # Algorithmic threshold
                        optimal_locations.append(analysis)
                        logging.info(f"✅ Found optimal location at {lat:.4f}, {lng:.4f} with score {analysis['overall_score']:.1f}")
                        
                except Exception as e:
                    logging.warning(f"⚠️ Failed to analyze grid point {lat:.4f}, {lng:.4f}: {e}")
                    continue
        
        logging.info(f"📊 Analyzed {analyzed_count} grid points, found {len(optimal_locations)} viable locations")
        
        # If we don't have enough locations, lower the threshold and try key regions
        if len(optimal_locations) < 5:
            logging.info("🔄 Expanding search with lower threshold...")
            
            # Key regions in Gujarat known for renewable energy potential
            key_regions = [
                # Kutch region - excellent solar/wind potential
                {"center": (23.5, 70.0), "radius": 1.0},
                # Saurashtra - good wind potential  
                {"center": (22.0, 71.0), "radius": 0.8},
                # South Gujarat - industrial demand
                {"center": (21.5, 73.0), "radius": 0.6},
                # Central Gujarat - balanced potential
                {"center": (22.5, 72.0), "radius": 0.7}
            ]
            
            for region in key_regions:
                center_lat, center_lng = region["center"]
                radius = region["radius"]
                
                # Analyze points around each region center
                for lat_offset in [-radius, -radius/2, 0, radius/2, radius]:
                    for lng_offset in [-radius, -radius/2, 0, radius/2, radius]:
                        lat = center_lat + lat_offset
                        lng = center_lng + lng_offset
                        
                        # Check if within Gujarat bounds
                        if (gujarat_bounds.south <= lat <= gujarat_bounds.north and 
                            gujarat_bounds.west <= lng <= gujarat_bounds.east):
                            
                            location = LocationPoint(latitude=lat, longitude=lng)
                            
                            try:
                                analysis = await optimizer.analyze_location(location, weights)
                                
                                # Lower threshold for regional analysis
                                if analysis['overall_score'] > 100:
                                    # Check if we already have a nearby location
                                    is_duplicate = False
                                    for existing in optimal_locations:
                                        if (abs(existing['latitude'] - lat) < 0.1 and 
                                            abs(existing['longitude'] - lng) < 0.1):
                                            is_duplicate = True
                                            break
                                    
                                    if not is_duplicate:
                                        optimal_locations.append(analysis)
                                        logging.info(f"✅ Added regional location at {lat:.4f}, {lng:.4f} with score {analysis['overall_score']:.1f}")
                                        
                            except Exception as e:
                                continue
        
        # Sort by algorithm score and return top results
        optimal_locations.sort(key=lambda x: x['overall_score'], reverse=True)
        result = optimal_locations[:15]  # Return top 15 algorithmic locations
        
        if len(result) == 0:
            logging.error("❌ Algorithm failed to identify any optimal locations")
            # Fallback to a minimal set with very low threshold
            fallback_location = LocationPoint(latitude=22.5, longitude=71.5)  # Central Gujarat
            try:
                fallback_analysis = await optimizer.analyze_location(fallback_location, weights)
                result = [fallback_analysis]
                logging.info("🆘 Using fallback location for testing")
            except Exception as fe:
                raise HTTPException(status_code=500, detail="Algorithm failed to generate any valid locations")
        
        # Add algorithmic insights to the response
        for location in result:
            location['selection_method'] = 'algorithmic_grid_analysis'
            location['analysis_weights'] = {
                'energy_weight': weights.energy_weight,
                'demand_weight': weights.demand_weight,
                'water_weight': weights.water_weight,
                'pipeline_weight': weights.pipeline_weight,
                'transport_weight': weights.transport_weight
            }
        
        logging.info(f"✅ Algorithm successfully identified {len(result)} optimal locations")
        return result
        
    except Exception as e:
        logging.error(f"❌ Algorithmic optimal location calculation failed: {e}")
        import traceback
        logging.error(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Algorithm calculation failed: {str(e)}")

# Include the routers in the main app
app.include_router(api_router)
app.include_router(advanced_analysis_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add this to enable running with `python server.py`
if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Starting H₂-Optimize API Server...")
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8080,
        reload=True,
        log_level="info"
    )
