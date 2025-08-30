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
    """Get optimal locations using pure algorithm calculation"""
    try:
        logging.info("Starting optimal locations calculation...")
        
        # Create a strategic grid of high-potential locations in Gujarat
        strategic_locations = [
            (23.0225, 72.5714),  # Ahmedabad area
            (22.3072, 70.8022),  # Rajkot area  
            (21.1702, 72.8311),  # Surat area
            (23.0300, 70.2000),  # Kutch area
            (22.7500, 69.8700),  # Mundra area
            (21.6000, 73.0000),  # Ankleshwar area
            (22.5000, 71.5000),  # Central Gujarat
            (23.2000, 71.8000),  # North Gujarat
        ]
        
        optimal_locations = []
        
        # Analyze each strategic location
        for i, (lat, lng) in enumerate(strategic_locations):
            try:
                logging.info(f"Analyzing location {i+1}/{len(strategic_locations)}: {lat}, {lng}")
                location = LocationPoint(latitude=lat, longitude=lng)
                analysis = await optimizer.analyze_location(location, None)
                
                # Include all locations with decent scores
                if analysis['overall_score'] > 30:  # Much lower threshold to get results
                    optimal_locations.append(analysis)
                    logging.info(f"✅ Added location {lat}, {lng} with score {analysis['overall_score']}")
                else:
                    logging.info(f"⚠️ Skipped location {lat}, {lng} with very low score {analysis['overall_score']}")
                    
            except Exception as e:
                logging.error(f"❌ Failed to analyze location {lat}, {lng}: {e}")
                # Continue with other locations
                continue
        
        # Sort by score and return top results
        optimal_locations.sort(key=lambda x: x['overall_score'], reverse=True)
        result = optimal_locations[:10]  # Return top 10
        
        if len(result) == 0:
            logging.error("No valid locations found by algorithm")
            raise HTTPException(status_code=500, detail="Algorithm failed to generate any valid locations")
        
        logging.info(f"✅ Successfully generated {len(result)} optimal locations using algorithm")
        return result
        
    except Exception as e:
        logging.error(f"❌ Optimal location calculation failed: {e}")
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
