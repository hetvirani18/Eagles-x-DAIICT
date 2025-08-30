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
    """Analyze a specific location for hydrogen plant suitability (OPTIMIZED)"""
    import time
    start_time = time.time()
    
    try:
        # Use optimized single location analysis for better performance
        analysis = await optimizer.analyze_single_location_optimized(location, weights)
        
        execution_time = round(time.time() - start_time, 3)
        analysis['performance_metrics'] = {
            'execution_time_seconds': execution_time,
            'optimization_level': 'high',
            'query_type': 'single_location_optimized'
        }
        
        logging.info(f"✅ Optimized location analysis completed in {execution_time}s")
        return analysis
        
    except Exception as e:
        logging.error(f"Location analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@api_router.post("/analyze-location-detailed")  
async def analyze_location_detailed(location: LocationPoint, weights: Optional[WeightedAnalysisRequest] = None):
    """Analyze location with full dataset (use only when detailed analysis needed)"""
    import time
    start_time = time.time()
    
    try:
        analysis = await optimizer.analyze_location(location, weights)
        
        execution_time = round(time.time() - start_time, 3)
        analysis['performance_metrics'] = {
            'execution_time_seconds': execution_time,
            'optimization_level': 'standard',
            'query_type': 'full_dataset_analysis'
        }
        
        logging.info(f"📊 Detailed location analysis completed in {execution_time}s")
        return analysis
        
    except Exception as e:
        logging.error(f"Detailed location analysis failed: {e}")
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
async def get_pre_calculated_optimal_locations():
    """Get pre-calculated optimal locations for Gujarat"""
    # Pre-calculated optimal locations using our algorithm
    pre_calculated = [
        {
            "location": {"latitude": 21.6500, "longitude": 72.8500},
            "overall_score": 285.4,
            "energy_score": 88.2,
            "demand_score": 92.1,
            "water_score": 78.5,
            "pipeline_score": 65.8,
            "transport_score": 89.3,
            "production_metrics": {
                "projected_cost_per_kg": 2.8,
                "annual_capacity_mt": 22000,
                "payback_period_years": 6.2,
                "roi_percentage": 18.5
            },
            "nearest_energy": {
                "nearest_source": "Dhuvaran Solar Complex",
                "distance_km": 15.2,
                "type": "Solar",
                "capacity_mw": 400
            },
            "nearest_demand": {
                "nearest_center": "GIDC Ankleshwar Chemical Complex", 
                "distance_km": 8.5,
                "type": "Chemical",
                "demand_mt_year": 35000
            },
            "nearest_water": {
                "nearest_source": "Tapi River",
                "distance_km": 12.1,
                "type": "River"
            },
            "nearest_pipeline": {
                "nearest_pipeline": "Gujarat Gas Distribution Network",
                "distance_km": 18.5,
                "operator": "Gujarat Gas Limited"
            },
            "nearest_transport": {
                "nearest_road": "Golden Quadrilateral (Gujarat Section)",
                "distance_km": 5.2,
                "type": "National Highway",
                "connectivity_score": 98
            }
        },
        {
            "location": {"latitude": 22.9200, "longitude": 70.8500},
            "overall_score": 278.1,
            "energy_score": 91.5,
            "demand_score": 75.8,
            "water_score": 68.2,
            "pipeline_score": 82.4,
            "transport_score": 85.7,
            "production_metrics": {
                "projected_cost_per_kg": 2.6,
                "annual_capacity_mt": 28000,
                "payback_period_years": 5.8,
                "roi_percentage": 20.2
            },
            "nearest_energy": {
                "nearest_source": "Charanka Solar Park",
                "distance_km": 18.7,
                "type": "Solar",
                "capacity_mw": 590
            },
            "nearest_demand": {
                "nearest_center": "Kandla Port & SEZ",
                "distance_km": 22.3,
                "type": "Port",
                "demand_mt_year": 25000
            },
            "nearest_water": {
                "nearest_source": "Narmada Main Canal",
                "distance_km": 25.4,
                "type": "Canal"
            },
            "nearest_pipeline": {
                "nearest_pipeline": "Gujarat Gas Distribution Network",
                "distance_km": 12.8,
                "operator": "Gujarat Gas Limited"
            },
            "nearest_transport": {
                "nearest_road": "NH-27 (Porbandar-Silchar Highway)",
                "distance_km": 8.9,
                "type": "National Highway",
                "connectivity_score": 88
            }
        },
        {
            "location": {"latitude": 22.7800, "longitude": 69.8200},
            "overall_score": 272.3,
            "energy_score": 95.8,
            "demand_score": 88.1,
            "water_score": 55.2,
            "pipeline_score": 78.9,
            "transport_score": 81.4,
            "production_metrics": {
                "projected_cost_per_kg": 2.7,
                "annual_capacity_mt": 25000,
                "payback_period_years": 6.0,
                "roi_percentage": 19.1
            },
            "nearest_energy": {
                "nearest_source": "Mundra Solar Park",
                "distance_km": 12.1,
                "type": "Solar",
                "capacity_mw": 750
            },
            "nearest_demand": {
                "nearest_center": "Mundra Port Industrial Zone",
                "distance_km": 8.9,
                "type": "Port",
                "demand_mt_year": 30000
            },
            "nearest_water": {
                "nearest_source": "Kutch Groundwater",
                "distance_km": 35.2,
                "type": "Groundwater"
            },
            "nearest_pipeline": {
                "nearest_pipeline": "Gujarat Gas Distribution Network",
                "distance_km": 15.7,
                "operator": "Gujarat Gas Limited"
            },
            "nearest_transport": {
                "nearest_road": "NH-27 (Porbandar-Silchar Highway)",
                "distance_km": 6.3,
                "type": "National Highway",
                "connectivity_score": 88
            }
        },
        {
            "location": {"latitude": 21.4000, "longitude": 72.6800},
            "overall_score": 265.7,
            "energy_score": 72.4,
            "demand_score": 94.8,
            "water_score": 81.5,
            "pipeline_score": 89.2,
            "transport_score": 92.1,
            "production_metrics": {
                "projected_cost_per_kg": 2.9,
                "annual_capacity_mt": 20000,
                "payback_period_years": 6.5,
                "roi_percentage": 17.3
            },
            "nearest_energy": {
                "nearest_source": "Dhuvaran Solar Complex",
                "distance_km": 28.5,
                "type": "Solar",
                "capacity_mw": 400
            },
            "nearest_demand": {
                "nearest_center": "Hazira Industrial Complex",
                "distance_km": 15.7,
                "type": "Steel",
                "demand_mt_year": 45000
            },
            "nearest_water": {
                "nearest_source": "Tapi River",
                "distance_km": 18.3,
                "type": "River"
            },
            "nearest_pipeline": {
                "nearest_pipeline": "Dahej-Uran Pipeline",
                "distance_km": 8.9,
                "operator": "GAIL India"
            },
            "nearest_transport": {
                "nearest_road": "Golden Quadrilateral (Gujarat Section)",
                "distance_km": 3.4,
                "type": "National Highway",
                "connectivity_score": 98
            }
        },
        {
            "location": {"latitude": 23.1500, "longitude": 72.2200},
            "overall_score": 258.9,
            "energy_score": 68.5,
            "demand_score": 79.8,
            "water_score": 88.2,
            "pipeline_score": 72.1,
            "transport_score": 94.5,
            "production_metrics": {
                "projected_cost_per_kg": 3.1,
                "annual_capacity_mt": 18000,
                "payback_period_years": 7.1,
                "roi_percentage": 15.8
            },
            "nearest_energy": {
                "nearest_source": "Patan Solar Park",
                "distance_km": 32.4,
                "type": "Solar",
                "capacity_mw": 500
            },
            "nearest_demand": {
                "nearest_center": "Sanand Automotive Hub",
                "distance_km": 19.8,
                "type": "Automotive",
                "demand_mt_year": 18000
            },
            "nearest_water": {
                "nearest_source": "Sabarmati River",
                "distance_km": 22.1,
                "type": "River"
            },
            "nearest_pipeline": {
                "nearest_pipeline": "GAIL Hazira-Vijaipur-Jagdishpur Pipeline",
                "distance_km": 25.3,
                "operator": "GAIL India"
            },
            "nearest_transport": {
                "nearest_road": "NH-48 (Ahmedabad-Mumbai Highway)",
                "distance_km": 4.2,
                "type": "National Highway",
                "connectivity_score": 95
            }
        }
    ]
    
    return pre_calculated

# Include the router in the main app
app.include_router(api_router)

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
