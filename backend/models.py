from pydantic import BaseModel, Field
from typing import List, Optional, Union
from datetime import datetime
import uuid
from enum import Enum

class LocationPoint(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

class EnergySourceType(str, Enum):
    SOLAR = "Solar"
    WIND = "Wind" 
    HYBRID = "Hybrid"

class WaterSourceType(str, Enum):
    RIVER = "River"
    CANAL = "Canal"
    RESERVOIR = "Reservoir"
    GROUNDWATER = "Groundwater"

class IndustryType(str, Enum):
    REFINERY = "Refinery"
    CHEMICAL = "Chemical"
    STEEL = "Steel"
    FERTILIZER = "Fertilizer"
    PORT = "Port"
    AUTOMOTIVE = "Automotive"

class RoadType(str, Enum):
    NATIONAL_HIGHWAY = "National Highway"
    STATE_HIGHWAY = "State Highway"
    MAJOR_DISTRICT_ROAD = "Major District Road"

# Energy Sources Model
class EnergySource(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: EnergySourceType
    location: LocationPoint
    capacity_mw: float
    cost_per_kwh: float
    annual_generation_gwh: float
    operator: str
    commissioned_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EnergySourceCreate(BaseModel):
    name: str
    type: EnergySourceType
    location: LocationPoint
    capacity_mw: float
    cost_per_kwh: float
    annual_generation_gwh: float
    operator: str

# Demand Centers Model  
class DemandCenter(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: IndustryType
    location: LocationPoint
    hydrogen_demand_mt_year: float
    current_hydrogen_source: str
    green_transition_potential: str  # High, Medium, Low
    willingness_to_pay: float  # Premium percentage over current cost
    contact_info: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DemandCenterCreate(BaseModel):
    name: str
    type: IndustryType
    location: LocationPoint
    hydrogen_demand_mt_year: float
    current_hydrogen_source: str
    green_transition_potential: str
    willingness_to_pay: float

# Water Sources Model
class WaterSource(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: WaterSourceType
    location: LocationPoint
    capacity_liters_day: float
    quality_score: float  # 1-10 scale
    seasonal_availability: str  # Perennial, Seasonal, Monsoon-dependent
    extraction_cost: float  # Cost per liter
    regulatory_clearance: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)

class WaterSourceCreate(BaseModel):
    name: str
    type: WaterSourceType
    location: LocationPoint
    capacity_liters_day: float
    quality_score: float
    seasonal_availability: str
    extraction_cost: float
    regulatory_clearance: bool

# Gas Pipelines Model
class GasPipeline(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    operator: str
    route: List[LocationPoint]
    capacity_mmscmd: float  # Million Metric Standard Cubic Meters per Day
    diameter_inches: float
    pressure_kg_cm2: float
    pipeline_type: str  # Natural Gas, LPG, etc.
    connection_cost: float  # Cost to connect per km
    created_at: datetime = Field(default_factory=datetime.utcnow)

class GasPipelineCreate(BaseModel):
    name: str
    operator: str
    route: List[LocationPoint]
    capacity_mmscmd: float
    diameter_inches: float
    pressure_kg_cm2: float
    pipeline_type: str
    connection_cost: float

# Road Networks Model  
class RoadNetwork(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: RoadType
    route: List[LocationPoint]
    connectivity_score: float  # 1-100 scale
    transport_capacity: str  # Heavy, Medium, Light
    condition: str  # Excellent, Good, Fair, Poor
    toll_cost_per_km: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

class RoadNetworkCreate(BaseModel):
    name: str
    type: RoadType
    route: List[LocationPoint]
    connectivity_score: float
    transport_capacity: str
    condition: str
    toll_cost_per_km: float

# Water Bodies Model (Additional water sources like lakes, reservoirs)
class WaterBody(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # Lake, Reservoir, Pond, Dam
    location: LocationPoint
    area_sq_km: float
    depth_meters: float
    water_quality: str  # Excellent, Good, Fair, Poor
    access_permission: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)

class WaterBodyCreate(BaseModel):
    name: str
    type: str
    location: LocationPoint
    area_sq_km: float
    depth_meters: float
    water_quality: str
    access_permission: bool

# Optimal Locations Model (Pre-calculated or real-time)
class OptimalLocation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    location: LocationPoint
    overall_score: float
    energy_score: float
    demand_score: float
    water_score: float
    pipeline_score: float
    transport_score: float
    water_body_score: float
    projected_cost_per_kg: float
    annual_capacity_mt: float
    nearest_energy: dict
    nearest_demand: dict  
    nearest_water: dict
    nearest_pipeline: dict
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Search and Analysis Models
class SearchBounds(BaseModel):
    north: float
    south: float
    east: float
    west: float

class WeightedAnalysisRequest(BaseModel):
    bounds: SearchBounds
    energy_weight: float = 0.25
    demand_weight: float = 0.25
    water_weight: float = 0.20
    pipeline_weight: float = 0.15
    transport_weight: float = 0.10
    water_body_weight: float = 0.05

# Pipeline Infrastructure Models
class PipelineType(str, Enum):
    NATURAL_GAS = "Natural Gas"
    HYDROGEN = "Hydrogen" 
    CRUDE_OIL = "Crude Oil"
    PRODUCT = "Product"
    PLANNED_HYDROGEN = "Planned Hydrogen"

class PipelineStatus(str, Enum):
    OPERATIONAL = "Operational"
    UNDER_CONSTRUCTION = "Under Construction"
    PLANNED = "Planned"
    DECOMMISSIONED = "Decommissioned"

class Pipeline(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: PipelineType
    status: PipelineStatus
    route_points: List[LocationPoint]  # Array of lat/lng points defining the route
    diameter_inches: float
    length_km: float
    capacity_mmscfd: Optional[float] = None  # Million standard cubic feet per day
    pressure_bar: Optional[float] = None
    operator: str
    commissioned_date: Optional[datetime] = None
    planned_completion: Optional[datetime] = None
    investment_cost_cr: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Storage Facility Models
class StorageType(str, Enum):
    UNDERGROUND_CAVERN = "Underground Cavern"
    ABOVE_GROUND_TANK = "Above Ground Tank"
    COMPRESSED_GAS = "Compressed Gas"
    LIQUID_HYDROGEN = "Liquid Hydrogen"
    UNDERGROUND_LINED = "Underground Lined"

class StorageFacility(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: StorageType
    location: LocationPoint
    capacity_kg: float
    working_pressure_bar: float
    storage_medium: str  # "Hydrogen", "Natural Gas", etc.
    operator: str
    commissioned_date: Optional[datetime] = None
    safety_zone_radius_m: float = 500
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Distribution Hub Models
class DistributionType(str, Enum):
    TRUCK_LOADING = "Truck Loading"
    DISPENSING_STATION = "Dispensing Station"
    RAIL_LOADING = "Rail Loading"
    MARINE_TERMINAL = "Marine Terminal"
    INTERCONNECT = "Pipeline Interconnect"

class DistributionHub(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: DistributionType
    location: LocationPoint
    daily_capacity_kg: float
    storage_capacity_kg: Optional[float] = None
    operator: str
    served_industries: List[str] = []
    transport_modes: List[str] = []
    commissioned_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LocationAnalysis(BaseModel):
    location: LocationPoint
    overall_score: float
    factor_scores: dict
    proximity_analysis: dict
    production_potential: dict
    investment_recommendation: str
    risk_factors: List[str]
    
# City Search Model
class City(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    state: str = "Gujarat"
    location: LocationPoint
    population: Optional[int] = None
    district: Optional[str] = None