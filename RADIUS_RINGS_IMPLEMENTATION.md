# Circular Radius Rings Implementation for Green Hydrogen Infrastructure Mapping

## Overview

This document explains the implementation of circular radius rings that appear when clicking on Optimal Locations (⭐) in the Green Hydrogen Infrastructure Mapping & Optimization web app. These rings visualize the coverage area of nearby resources that contribute to the optimal location's score.

## How the Rings Are Created

### 1. Trigger Event
- Rings are displayed when a user clicks on any Optimal Location marker (⭐) on the map
- Previous rings are automatically cleared when clicking a different optimal location
- Rings remain visible until another optimal location is selected

### 2. Data Sources
The rings are calculated using the following datasets from the backend:

- **Energy Sources** (`energySources`): Solar, wind, and hybrid power plants with location, capacity, and cost data
- **Industrial Demand Centers** (`demandCenters`): Chemical plants, refineries, steel mills, etc. with hydrogen demand data
- **Water Sources** (`waterSources`): Rivers, canals, reservoirs with capacity and quality data
- **Water Bodies** (`waterBodies`): Lakes, reservoirs, dams with area and quality data
- **Optimal Locations** (`optimalLocations`): Pre-calculated optimal sites with nearest resource information

### 3. Radius Calculation Algorithm

#### Distance Calculation
The system uses the **Haversine formula** to calculate distances between the optimal location and nearby resources:

```javascript
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Returns distance in kilometers
};
```

#### Radius Determination Logic
For each resource type, the algorithm:

1. **Scans all resources** of that type within a reasonable distance
2. **Calculates distances** from the optimal location to each resource
3. **Finds the maximum distance** among relevant resources
4. **Applies minimum radius** for visibility (5km)
5. **Converts to meters** for Leaflet Circle component

```javascript
const calculateResourceRadii = (optimalLocation) => {
  // Initialize maximum distances
  let maxEnergyDistance = 0;
  let maxDemandDistance = 0;
  let maxWaterDistance = 0;

  // Scan energy sources within 100km
  energySources.forEach(source => {
    const distance = calculateDistance(locationLat, locationLng,
      source.location.latitude, source.location.longitude);
    if (distance <= 100) {
      maxEnergyDistance = Math.max(maxEnergyDistance, distance);
    }
  });

  // Similar logic for demand centers (100km range) and water sources (80km range)

  // Set final radii with minimum values
  setResourceRadii({
    energy: maxEnergyDistance > 0 ? Math.max(maxEnergyDistance * 1000, 5000) : null,
    demand: maxDemandDistance > 0 ? Math.max(maxDemandDistance * 1000, 5000) : null,
    water: maxWaterDistance > 0 ? Math.max(maxWaterDistance * 1000, 5000) : null
  });
};
```

### 4. Distance Thresholds by Resource Type

| Resource Type | Maximum Search Distance | Color | Icon |
|---------------|------------------------|-------|------|
| Energy Sources | 100 km | Yellow (#f59e0b) | ⚡ |
| Industrial Demand | 100 km | Red (#dc2626) | 🏭 |
| Water Sources | 80 km | Blue (#0ea5e9) | 💧 |

### 5. Visual Implementation

#### Circle Properties
- **Fill Opacity**: 0.1 (semi-transparent)
- **Border Weight**: 2px
- **Border Style**: Dashed (5, 5)
- **Z-Index**: Below markers but above base map

#### React Leaflet Circle Components
```jsx
<Circle
  center={[latitude, longitude]}
  radius={radiusInMeters}
  pathOptions={{
    color: '#f59e0b', // Resource-specific color
    fillColor: '#f59e0b',
    fillOpacity: 0.1,
    weight: 2,
    dashArray: '5, 5'
  }}
/>
```

### 6. Legend System

A dynamic legend appears in the top-right corner when rings are visible:

```jsx
{selectedOptimalLocation && (resourceRadii.energy || resourceRadii.demand || resourceRadii.water) && (
  <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000] border">
    <h4 className="font-semibold text-sm mb-2 text-gray-800">Resource Coverage</h4>
    <div className="space-y-1 text-xs">
      {resourceRadii.energy && (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600"></div>
          <span>⚡ Energy Sources</span>
        </div>
      )}
      {/* Similar for demand and water */}
    </div>
  </div>
)}
```

## Algorithm Assumptions and Limitations

### Assumptions
1. **Resource Relevance**: Only resources within reasonable distances contribute to the optimal location's viability
2. **Maximum Coverage**: The algorithm shows the full coverage area, not just the nearest resources
3. **Equal Weighting**: All resources of the same type within range are considered equally
4. **Geographic Accuracy**: Uses WGS84 coordinate system with Haversine distance calculations

### Limitations
1. **Performance**: Scans all resources on each click - could be optimized for large datasets
2. **Fixed Thresholds**: Distance limits are hardcoded and may not reflect actual infrastructure constraints
3. **No Terrain Consideration**: Doesn't account for terrain, roads, or physical barriers
4. **Simplified Economics**: Rings show geographic coverage but not economic viability factors

## Integration with Existing System

### Backend Data Structure
The optimal locations include pre-calculated nearest resource information:

```javascript
{
  "location": {"latitude": 21.6500, "longitude": 72.8500},
  "overall_score": 285.4,
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
  }
}
```

### Frontend State Management
```javascript
const [selectedOptimalLocation, setSelectedOptimalLocation] = useState(null);
const [resourceRadii, setResourceRadii] = useState({
  energy: null,
  demand: null,
  water: null
});
```

## Future Enhancements

1. **Dynamic Thresholds**: Calculate optimal distance thresholds based on resource availability
2. **Economic Weighting**: Show rings weighted by economic impact rather than just distance
3. **Interactive Filtering**: Allow users to toggle individual resource type rings
4. **Performance Optimization**: Use spatial indexing for faster distance calculations
5. **Terrain Analysis**: Consider elevation, slope, and infrastructure corridors

## Code Location

The implementation is located in:
- **File**: `frontend/src/components/MapComponent.jsx`
- **Functions**: `calculateDistance()`, `calculateResourceRadii()`, `handleOptimalLocationClick()`
- **Components**: Circle components with resource-specific styling

This implementation provides immediate visual feedback about resource coverage while maintaining good performance and clear user experience.</content>
<parameter name="filePath">c:\Users\brije\Desktop\Eagles-x-DAIICT\RADIUS_RINGS_IMPLEMENTATION.md
