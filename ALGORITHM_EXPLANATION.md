# H₂-Optimize: Green Hydrogen Plant Location Algorithm

## Overview
The H₂-Optimize algorithm uses a **weighted overlay analysis** approach to find optimal locations for green hydrogen plants in Gujarat. It evaluates multiple factors simultaneously and combines them into a comprehensive suitability score.

## Algorithm Architecture

### 1. Core Components

```
HydrogenLocationOptimizer
├── Distance Calculations (Haversine Formula)
├── Proximity Scoring Functions
├── Multi-factor Analysis Engine
└── Grid-based Search System
```

### 2. Scoring Framework

Each location receives scores (0-100) across 5 key factors:

#### A. Energy Score (Weight: 30%)
**Purpose**: Proximity to renewable energy sources
```python
def calculate_energy_score(location, energy_sources):
    # Find nearest energy source
    nearest_energy, distance = get_nearest_asset(location, energy_sources)
    
    # Base proximity score (0-100)
    score = score_proximity(distance, max_distance=150km)
    
    # Bonus factors:
    # - High capacity bonus: +20 points (capacity/100 MW)
    # - Low cost bonus: +10 points (based on ₹/kWh)
    
    return min(100, score + bonuses)
```

**Factors Considered**:
- Distance to nearest solar/wind farm
- Energy source capacity (MW)
- Cost per kWh
- Generation reliability

#### B. Demand Score (Weight: 25%)
**Purpose**: Proximity to hydrogen demand centers
```python
def calculate_demand_score(location, demand_centers):
    nearest_demand, distance = get_nearest_asset(location, demand_centers)
    
    score = score_proximity(distance, max_distance=100km)
    
    # Bonus factors:
    # - High demand bonus: +15 points (demand/5000 MT)
    # - Premium willingness: +10 points (willingness_to_pay/10%)
    
    return min(100, score + bonuses)
```

**Factors Considered**:
- Distance to industrial clusters
- Annual hydrogen demand (MT/year)
- Willingness to pay premium for green H₂
- Current hydrogen source (grey vs green transition potential)

#### C. Water Score (Weight: 20%)
**Purpose**: Access to water for electrolysis
```python
def calculate_water_score(location, water_sources, water_bodies):
    all_water = water_sources + water_bodies
    nearest_water, distance = get_nearest_asset(location, all_water)
    
    score = score_proximity(distance, max_distance=80km)
    
    # Bonus factors:
    # - High capacity: +15 points (capacity/100K L/day)
    # - Quality score: +10 points (quality_score/10)
    
    return min(100, score + bonuses)
```

**Factors Considered**:
- Distance to water sources/bodies
- Water availability (liters/day)
- Water quality score
- Seasonal availability
- Regulatory clearance status

#### D. Pipeline Score (Weight: 15%)
**Purpose**: Access to gas pipeline infrastructure
```python
def calculate_pipeline_score(location, gas_pipelines):
    nearest_pipeline, distance = get_nearest_asset(location, pipelines, route_based=True)
    
    score = score_proximity(distance, max_distance=50km)
    
    # Bonus for high capacity pipelines
    capacity_bonus = min(15, pipeline.capacity_mmscmd / 20)
    
    return min(100, score + capacity_bonus)
```

**Factors Considered**:
- Distance to existing gas pipeline network
- Pipeline capacity (MMSCMD)
- Operator reliability
- Connection feasibility

#### E. Transport Score (Weight: 10%)
**Purpose**: Transport connectivity for equipment and distribution
```python
def calculate_transport_score(location, road_networks):
    nearest_road, distance = get_nearest_asset(location, roads, route_based=True)
    
    score = score_proximity(distance, max_distance=30km)
    
    # Bonus for high connectivity
    connectivity_bonus = road.connectivity_score / 10
    
    return min(100, score + connectivity_bonus)
```

**Factors Considered**:
- Distance to major highways
- Road connectivity score
- Transportation infrastructure quality

### 3. Distance Calculation

Uses the **Haversine Formula** for accurate geographic distances:

```python
def calculate_distance(point1, point2):
    R = 6371  # Earth's radius in km
    
    lat1_rad = math.radians(point1.latitude)
    lat2_rad = math.radians(point2.latitude)
    delta_lat = math.radians(point2.latitude - point1.latitude)
    delta_lon = math.radians(point2.longitude - point1.longitude)
    
    a = (math.sin(delta_lat/2)**2 + 
         math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c  # Distance in kilometers
```

### 4. Proximity Scoring Function

Converts distance to score using inverse relationship:

```python
def score_proximity(distance, max_distance=100):
    if distance >= max_distance:
        return 0
    return max(0, 100 * (1 - distance / max_distance))
```

**Scoring Logic**:
- 0 km = 100 points
- 50% of max_distance = 50 points  
- max_distance = 0 points
- Beyond max_distance = 0 points

### 5. Overall Score Calculation

```python
overall_score = (
    energy_score * 0.30 +      # 30% weight
    demand_score * 0.25 +      # 25% weight
    water_score * 0.20 +       # 20% weight
    pipeline_score * 0.15 +    # 15% weight
    transport_score * 0.10     # 10% weight
)
```

**Score Ranges**:
- 0-150: Poor location
- 150-200: Moderate potential
- 200-250: Good location
- 250+: Excellent location

### 6. Grid-Based Search Algorithm

For finding optimal locations across Gujarat:

```python
def calculate_optimal_locations(bounds, weights, limit=10):
    optimal_locations = []
    
    # Create 20x20 analysis grid
    lat_step = (bounds.north - bounds.south) / 20
    lng_step = (bounds.east - bounds.west) / 20
    
    # Analyze every other grid point (10x10 for performance)
    for i in range(10):
        for j in range(10):
            lat = bounds.south + (i * lat_step * 2)
            lng = bounds.west + (j * lng_step * 2)
            
            location = LocationPoint(latitude=lat, longitude=lng)
            analysis = analyze_location(location, weights)
            
            # Only include high-scoring locations
            if analysis['overall_score'] > 200:
                optimal_locations.append(analysis)
    
    # Sort by score and return top results
    optimal_locations.sort(key=lambda x: x['overall_score'], reverse=True)
    return optimal_locations[:limit]
```

### 7. Production Metrics Calculation

Based on the overall score, the algorithm calculates:

```python
def calculate_production_metrics(overall_score, energy_info, demand_info):
    base_cost = 3.5  # Base cost per kg in INR
    base_capacity = 15000  # Base capacity in MT/year
    
    # Cost reduction for high scores
    if overall_score > 250:
        cost_reduction = (overall_score - 200) / 100 * 0.8
        base_cost = max(2.0, base_cost - cost_reduction)
    
    # Capacity increase for high scores
    if overall_score > 200:
        capacity_multiplier = 1 + (overall_score - 200) / 200
        base_capacity = int(base_capacity * capacity_multiplier)
    
    return {
        'projected_cost_per_kg': round(base_cost, 2),
        'annual_capacity_mt': base_capacity,
        'payback_period_years': max(5, 10 - (overall_score - 200) / 50),
        'roi_percentage': min(25, max(8, (overall_score - 150) / 10))
    }
```

## Algorithm Flow

```
1. Input: Location coordinates (lat, lng)
   ↓
2. Fetch all infrastructure data from database
   ↓
3. Calculate 5 individual scores in parallel:
   - Energy Score (0-100)
   - Demand Score (0-100) 
   - Water Score (0-100)
   - Pipeline Score (0-100)
   - Transport Score (0-100)
   ↓
4. Apply weighted combination:
   Overall Score = Σ(score_i × weight_i)
   ↓
5. Calculate production metrics based on overall score
   ↓
6. Return comprehensive analysis with:
   - Individual scores
   - Nearest infrastructure details
   - Production cost & capacity projections
   - ROI and payback estimates
```

## Key Features

### ✅ **Weighted Multi-Criteria Analysis**
- Customizable weights for different priorities
- Combines multiple infrastructure factors
- Accounts for both proximity and quality

### ✅ **Geographic Accuracy** 
- Haversine formula for precise distances
- Route-based distance for linear infrastructure
- Grid-based systematic search

### ✅ **Economic Modeling**
- Cost projections based on location factors
- Capacity estimates for plant sizing
- ROI and payback period calculations

### ✅ **Real-time Analysis**
- Can analyze any location in Gujarat
- Considers current infrastructure data
- Scalable for different regions

## Performance Optimizations

1. **Parallel Processing**: All 5 scores calculated simultaneously
2. **Grid Sampling**: 10x10 instead of 20x20 for faster search
3. **Score Thresholding**: Only locations with score > 200 are considered
4. **Database Indexing**: Geospatial indexes for fast proximity queries
5. **Caching**: Pre-calculated results for common queries

## Use Cases

1. **Investment Planning**: Find best locations for new plants
2. **Site Selection**: Compare multiple potential sites
3. **Risk Assessment**: Understand infrastructure dependencies
4. **Policy Planning**: Identify infrastructure gaps
5. **Strategic Analysis**: Regional hydrogen development planning

This algorithm provides a comprehensive, data-driven approach to green hydrogen plant location optimization, balancing multiple critical factors to identify the most suitable sites in Gujarat.
