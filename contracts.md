# H₂-Optimize Backend Integration Contracts

## API Contracts

### 1. Data Endpoints

#### GET /api/energy-sources

- **Purpose**: Retrieve all renewable energy sources (solar, wind)
- **Response**: Array of energy source objects with capacity, cost, coordinates
- **Frontend Usage**: Display energy markers on map

#### GET /api/demand-centers  

- **Purpose**: Retrieve industrial centers that can purchase hydrogen
- **Response**: Array of demand center objects with demand volume, industry type
- **Frontend Usage**: Display demand markers on map

#### GET /api/water-sources

- **Purpose**: Retrieve water bodies and sources for hydrogen production
- **Response**: Array of water source objects with capacity, type, coordinates  
- **Frontend Usage**: Display water markers on map

#### GET /api/gas-pipelines

- **Purpose**: Retrieve existing gas pipeline infrastructure
- **Response**: Array of pipeline route objects with capacity, coordinates
- **Frontend Usage**: Display pipeline routes on map

#### GET /api/road-networks

- **Purpose**: Retrieve major transportation routes
- **Response**: Array of road objects with type, connectivity score
- **Frontend Usage**: Display transportation infrastructure

#### POST /api/calculate-optimal-locations

- **Purpose**: Calculate optimal locations using weighted overlay algorithm
- **Request Body**: Search area bounds, weights for different factors
- **Response**: Array of scored optimal location objects
- **Frontend Usage**: Display optimal location markers with scores

#### GET /api/location-analysis/:lat/:lng

- **Purpose**: Get detailed analysis for a specific location
- **Response**: Comprehensive location analysis with proximity data
- **Frontend Usage**: Populate location details panel

### 2. Search Endpoints

#### GET /api/search/cities?q={query}

- **Purpose**: Search Gujarat cities for map navigation
- **Response**: Array of city objects with coordinates
- **Frontend Usage**: Search autocomplete functionality

### 3. Algorithm Endpoints

#### POST /api/algorithm/weighted-overlay

- **Purpose**: Run weighted overlay analysis for custom parameters
- **Request Body**: Area bounds, factor weights, constraints
- **Response**: Heatmap data and top locations
- **Frontend Usage**: Advanced analysis features

## Data Migration Plan

### Phase 1: Replace Mock Data

1. **Remove**: `src/data/mock.js` references from frontend
2. **Replace**: All hardcoded data calls with API calls using axios
3. **Update**: MapComponent, SearchComponent, LocationDetails to use real endpoints

### Phase 2: Backend Integration Points

#### Frontend Files to Update

- `MapComponent.jsx`: Replace mock data imports with API calls
- `SearchComponent.jsx`: Use real city search API
- `LocationDetails.jsx`: Fetch real location analysis data
- `App.js`: Add loading states and error handling

#### API Integration Pattern

```javascript
// Replace this
import { energySources } from '../data/mock';

// With this  
const [energySources, setEnergySources] = useState([]);
useEffect(() => {
  axios.get(`${BACKEND_URL}/api/energy-sources`)
    .then(response => setEnergySources(response.data));
}, []);
```

## Enhanced Algorithm Factors

### Scoring Algorithm Expansion

Current factors (weighted overlay):

1. **Energy Proximity** (25%): Distance to solar/wind farms
2. **Demand Proximity** (25%): Distance to industrial buyers  
3. **Water Access** (20%): Distance to water sources
4. **Pipeline Access** (15%): Distance to existing gas infrastructure
5. **Transportation** (10%): Road network connectivity
6. **Water Bodies** (5%): Additional water source diversity

### New Database Collections

#### 1. gas_pipelines

```javascript
{
  name: "Gujarat Gas Pipeline Network",
  type: "Natural Gas",
  capacity: "50 MMSCMD", 
  coordinates: [[lat, lng], [lat, lng]], // Route array
  operators: ["GAIL", "Gujarat Gas"]
}
```

#### 2. water_bodies  

```javascript
{
  name: "Narmada River",
  type: "River",
  flow_rate: "1200 cumecs",
  coordinates: [lat, lng],
  seasonal_availability: "Perennial"
}
```

#### 3. road_networks

```javascript
{
  name: "NH-48 (Ahmedabad-Mumbai)",
  type: "National Highway", 
  connectivity_score: 95,
  coordinates: [[lat, lng], [lat, lng]], // Route array
  transport_capacity: "Heavy"
}
```

#### 4. industries

```javascript
{
  name: "Reliance Jamnagar Refinery",
  type: "Petroleum Refining",
  hydrogen_demand: "150000", // MT/year
  coordinates: [lat, lng],
  current_source: "SMR", // Steam Methane Reforming
  green_transition_potential: "High"
}
```

## Backend Implementation Tasks

### 1. Database Models (FastAPI + Motor)

- Create Pydantic models for all data types
- Implement CRUD operations for each collection
- Add geospatial indexing for location queries

### 2. Algorithm Engine

- Implement weighted overlay calculation function
- Create proximity analysis utilities  
- Add scoring and ranking logic

### 3. API Endpoints

- Implement all CRUD endpoints
- Add search and filtering capabilities
- Create algorithm execution endpoints

### 4. Data Population

- Create comprehensive Gujarat dataset
- Import real infrastructure data where possible
- Populate database with expanded mock data

## Success Criteria

- ✅ All mock data replaced with database integration
- ✅ Enhanced algorithm considers 6 key factors  
- ✅ Real-time location scoring and analysis
- ✅ Comprehensive Gujarat infrastructure data
- ✅ Responsive API with proper error handling
