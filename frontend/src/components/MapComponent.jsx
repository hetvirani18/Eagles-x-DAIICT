import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, Zap, Factory, Droplets, MapPin, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApiData } from '../hooks/useApiData';

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

const MapController = ({ searchLocation, onLocationSelect }) => {
  const map = useMap();
  
  useEffect(() => {
    if (searchLocation) {
      map.setView(searchLocation, 10);
    }
  }, [searchLocation, map]);

  return null;
};

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
  const gujaratCenter = [22.5, 71.5];

  const handleOptimalLocationClick = (location) => {
    setSelectedOptimalLocation(location);
    onLocationSelect(location);
  };

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
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController 
          searchLocation={searchLocation} 
          onLocationSelect={onLocationSelect}
        />

        {/* Energy Sources */}
        {energySources.map((source) => (
          <Marker
            key={source.id}
            position={[source.location.latitude, source.location.longitude]}
            icon={createCustomIcon('#f59e0b', 'zap')}
          >
            <Popup>
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
            </Popup>
          </Marker>
        ))}

        {/* Demand Centers */}
        {demandCenters.map((center) => (
          <Marker
            key={center.id}
            position={[center.location.latitude, center.location.longitude]}
            icon={createCustomIcon('#dc2626', 'factory')}
          >
            <Popup>
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
            </Popup>
          </Marker>
        ))}

        {/* Water Sources */}
        {waterSources.map((water) => (
          <Marker
            key={water.id}
            position={[water.location.latitude, water.location.longitude]}
            icon={createCustomIcon('#0ea5e9', 'water')}
          >
            <Popup>
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
            </Popup>
          </Marker>
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
                    <Badge variant="outline" className="bg-green-50 text-green-800">
                      {location.overall_score}/300
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
      </MapContainer>
    </div>
  );
};

export default MapComponent;