
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, Zap, Factory, Droplets, MapPin, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApiData } from '../hooks/useApiData';
import { calculateLocationScore, getScoreColor } from '../lib/scoring';

// Fix Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons
const createCustomIcon = (color, IconComponent) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background: ${color}; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
      <div style="color: white; font-size: 14px;">
        ${IconComponent === 'star' ? '⭐' : IconComponent === 'zap' ? '⚡' : IconComponent === 'factory' ? '🏭' : '💧'}
      </div>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

// Viewport tracker component to handle marker visibility
const ViewportTracker = memo(({ onViewportChange }) => {
  const map = useMap();
  
  useEffect(() => {
    const handleMoveEnd = () => {
      const bounds = map.getBounds();
      onViewportChange(bounds);
    };
    
    map.on('moveend', handleMoveEnd);
    map.on('zoomend', handleMoveEnd);
    
    // Initial viewport check
    handleMoveEnd();
    
    return () => {
      map.off('moveend', handleMoveEnd);
      map.off('zoomend', handleMoveEnd);
    };
  }, [map, onViewportChange]);

  return null;
});

const MapController = memo(({ searchLocation, onLocationSelect }) => {
  const map = useMap();
  
  useEffect(() => {
    if (searchLocation) {
      map.flyTo(searchLocation, 12, {
        duration: 1, // Duration in seconds
        easeLinearity: 0.25
      });
    }
  }, [searchLocation, map]);

  return null;
});

// Memoized marker components for better performance
const MarkerWithPopup = memo(({ position, icon, popupContent }) => (
  <Marker position={position} icon={icon}>
    <Popup>{popupContent}</Popup>
  </Marker>
));

const MapComponent = ({ searchLocation, selectedLocation, onLocationSelect }) => {
  const { 
    energySources, 
    demandCenters, 
    waterSources, 
    waterBodies, 
    optimalLocations,
    loading, 
    error 
  } = useApiData();
  
  const [selectedOptimalLocation, setSelectedOptimalLocation] = useState(null);
  const [visibleBounds, setVisibleBounds] = useState(null);
  const gujaratCenter = [22.5, 71.5];

  // Memoize icon creation
  const icons = useMemo(() => ({
    energy: createCustomIcon('#f59e0b', 'zap'),
    demand: createCustomIcon('#dc2626', 'factory'),
    water: createCustomIcon('#0ea5e9', 'water'),
    optimal: createCustomIcon('#22c55e', 'star')
  }), []);

  const [resourceRadii, setResourceRadii] = useState({
    energy: null,
    demand: null,
    water: null
  });

  // Calculate distance between two points using Haversine formula
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

  // Calculate resource radii for the selected optimal location
  const calculateResourceRadii = (optimalLocation) => {
    const locationLat = optimalLocation.location.latitude;
    const locationLng = optimalLocation.location.longitude;

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

    // Scan demand centers within 100km
    demandCenters.forEach(center => {
      const distance = calculateDistance(locationLat, locationLng,
        center.location.latitude, center.location.longitude);
      if (distance <= 100) {
        maxDemandDistance = Math.max(maxDemandDistance, distance);
      }
    });

    // Scan water sources within 80km
    waterSources.forEach(water => {
      const distance = calculateDistance(locationLat, locationLng,
        water.location.latitude, water.location.longitude);
      if (distance <= 80) {
        maxWaterDistance = Math.max(maxWaterDistance, distance);
      }
    });

    // Also scan water bodies within 80km
    waterBodies.forEach(body => {
      const distance = calculateDistance(locationLat, locationLng,
        body.location.latitude, body.location.longitude);
      if (distance <= 80) {
        maxWaterDistance = Math.max(maxWaterDistance, distance);
      }
    });

    // Set final radii with minimum values (convert to meters)
    setResourceRadii({
      energy: maxEnergyDistance > 0 ? Math.max(maxEnergyDistance * 1000, 5000) : null,
      demand: maxDemandDistance > 0 ? Math.max(maxDemandDistance * 1000, 5000) : null,
      water: maxWaterDistance > 0 ? Math.max(maxWaterDistance * 1000, 5000) : null
    });
  };

  const handleOptimalLocationClick = useCallback((location) => {
    setSelectedOptimalLocation(location);
    calculateResourceRadii(location);
    onLocationSelect(location);
  }, [onLocationSelect, calculateResourceRadii]);

  const handleViewportChange = useCallback((bounds) => {
    setVisibleBounds(bounds);
  }, []);

  // Filter markers based on viewport bounds
  const visibleMarkers = useMemo(() => {
    if (!visibleBounds) return { energyMarkers: [], demandMarkers: [], waterMarkers: [] };

    const isInBounds = (lat, lng) => visibleBounds.contains([lat, lng]);

    return {
      energyMarkers: energySources?.filter(source => 
        isInBounds(source.location.latitude, source.location.longitude)
      ) || [],
      demandMarkers: demandCenters?.filter(center => 
        isInBounds(center.location.latitude, center.location.longitude)
      ) || [],
      waterMarkers: waterSources?.filter(source => 
        isInBounds(source.location.latitude, source.location.longitude)
      ) || []
    };
  }, [visibleBounds, energySources, demandCenters, waterSources, optimalLocations]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading H₂-Optimize data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-red-50 rounded-lg">
        <div className="text-center space-y-2">
          <p className="text-red-600 font-medium">Failed to load map data</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={gujaratCenter}
        zoom={7}
        className="h-full w-full rounded-lg"
        zoomControl={true}
        preferCanvas={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController 
          searchLocation={searchLocation} 
          onLocationSelect={onLocationSelect}
        />

        <ViewportTracker onViewportChange={handleViewportChange} />

        {/* Energy Sources */}
        {visibleMarkers.energyMarkers.map((source) => (
          <MarkerWithPopup
            key={source.id}
            position={[source.location.latitude, source.location.longitude]}
            icon={icons.energy}
            popupContent={
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold flex items-center gap-2 text-amber-800">
                  <Zap className="w-4 h-4" />
                  {source.name}
                </h3>
                <div className="space-y-1 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {source.type}
                  </Badge>
                  <p className="text-sm text-gray-600">Capacity: {source.capacity_mw} MW</p>
                  <p className="text-sm text-gray-600">Cost: ₹{source.cost_per_kwh}/kWh</p>
                  <p className="text-sm text-gray-600">Generation: {source.annual_generation_gwh} GWh/year</p>
                  <p className="text-xs text-gray-500">Operator: {source.operator}</p>
                </div>
              </div>
            }
          />
        ))}

        {/* Demand Centers */}
        {visibleMarkers.demandMarkers.map((center) => (
          <MarkerWithPopup
            key={center.id}
            position={[center.location.latitude, center.location.longitude]}
            icon={icons.demand}
            popupContent={
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold flex items-center gap-2 text-red-800">
                  <Factory className="w-4 h-4" />
                  {center.name}
                </h3>
                <div className="space-y-1 mt-2">
                  <Badge variant="destructive" className="text-xs">
                    {center.type}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    H₂ Demand: {center.hydrogen_demand_mt_year.toLocaleString()} MT/year
                  </p>
                  <p className="text-sm text-gray-600">
                    Current Source: {center.current_hydrogen_source}
                  </p>
                  <p className="text-sm text-gray-600">
                    Transition Potential: {center.green_transition_potential}
                  </p>
                  <p className="text-sm text-gray-600">
                    Premium Willingness: +{center.willingness_to_pay}%
                  </p>
                </div>
              </div>
            }
          />
        ))}

        {/* Water Sources */}
        {visibleMarkers.waterMarkers.map((water) => (
          <MarkerWithPopup
            key={water.id}
            position={[water.location.latitude, water.location.longitude]}
            icon={icons.water}
            popupContent={
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold flex items-center gap-2 text-blue-800">
                  <Droplets className="w-4 h-4" />
                  {water.name}
                </h3>
                <div className="space-y-1 mt-2">
                  <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                    {water.type}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Capacity: {water.capacity_liters_day.toLocaleString()} L/day
                  </p>
                  <p className="text-sm text-gray-600">Quality Score: {water.quality_score}/10</p>
                  <p className="text-sm text-gray-600">
                    Availability: {water.seasonal_availability}
                  </p>
                  <p className="text-sm text-gray-600">
                    Cost: ₹{water.extraction_cost}/L
                  </p>
                  <p className="text-xs text-gray-500">
                    Clearance: {water.regulatory_clearance ? 'Approved' : 'Pending'}
                  </p>
                </div>
              </div>
            }
          />
        ))}

        {/* Water Bodies */}
        {waterBodies.map((body) => (
          <Marker
            key={body.id}
            position={[body.location.latitude, body.location.longitude]}
            icon={createCustomIcon('#06b6d4', 'water')}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold flex items-center gap-2 text-cyan-800">
                  <Droplets className="w-4 h-4" />
                  {body.name}
                </h3>
                <div className="space-y-1 mt-2">
                  <Badge variant="outline" className="text-xs border-cyan-300 text-cyan-700">
                    {body.type}
                  </Badge>
                  <p className="text-sm text-gray-600">Area: {body.area_sq_km} km²</p>
                  <p className="text-sm text-gray-600">Depth: {body.depth_meters}m</p>
                  <p className="text-sm text-gray-600">Quality: {body.water_quality}</p>
                  <p className="text-xs text-gray-500">
                    Access: {body.access_permission ? 'Permitted' : 'Restricted'}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Optimal Locations */}
        {optimalLocations.map((location, index) => (
          <Marker
            key={`optimal-${index}`}
            position={[location.location.latitude, location.location.longitude]}
            icon={createCustomIcon('#16a34a', 'star')}
            eventHandlers={{
              click: () => handleOptimalLocationClick(location)
            }}
          >
            <Popup>
              <div className="p-3 min-w-[220px]">
                <h3 className="font-semibold flex items-center gap-2 text-green-800 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  Optimal Location #{index + 1}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Overall Score:</span>
                    <Badge variant="outline" className={getScoreColor(calculateLocationScore(location))}>
                      {calculateLocationScore(location)}/300
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Projected Cost:</span>
                    <span className="text-sm font-medium">
                      ₹{location.production_metrics?.projected_cost_per_kg}/kg
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Capacity:</span>
                    <span className="text-sm font-medium">
                      {location.production_metrics?.annual_capacity_mt.toLocaleString()} MT/year
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="mt-3 w-full"
                  onClick={() => handleOptimalLocationClick(location)}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  View Full Analysis
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Resource Coverage Rings */}
        {selectedOptimalLocation && resourceRadii.energy && (
          <Circle
            center={[selectedOptimalLocation.location.latitude, selectedOptimalLocation.location.longitude]}
            radius={resourceRadii.energy}
            pathOptions={{
              color: '#f59e0b',
              fillColor: '#f59e0b',
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '5, 5'
            }}
          />
        )}
        {selectedOptimalLocation && resourceRadii.demand && (
          <Circle
            center={[selectedOptimalLocation.location.latitude, selectedOptimalLocation.location.longitude]}
            radius={resourceRadii.demand}
            pathOptions={{
              color: '#dc2626',
              fillColor: '#dc2626',
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '5, 5'
            }}
          />
        )}
        {selectedOptimalLocation && resourceRadii.water && (
          <Circle
            center={[selectedOptimalLocation.location.latitude, selectedOptimalLocation.location.longitude]}
            radius={resourceRadii.water}
            pathOptions={{
              color: '#0ea5e9',
              fillColor: '#0ea5e9',
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '5, 5'
            }}
          />
        )}
      </MapContainer>

      {/* Resource Coverage Legend */}
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
            {resourceRadii.demand && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600"></div>
                <span>🏭 Industrial Demand</span>
              </div>
            )}
            {resourceRadii.water && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-600"></div>
                <span>💧 Water Sources</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;