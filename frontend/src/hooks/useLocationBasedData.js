import { useState, useEffect } from 'react';
import { 
  energySourcesAPI, 
  demandCentersAPI, 
  waterSourcesAPI, 
  waterBodiesAPI,
  gasPipelinesAPI,
  roadNetworksAPI,
  algorithmAPI,
  handleApiError 
} from '../services/api';

// Calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Filter data by distance from search location
const filterDataByLocation = (data, searchLocation, maxDistance = 100) => {
  if (!searchLocation || !data?.length) return data;
  
  return data.filter(item => {
    if (!item.location?.latitude || !item.location?.longitude) return false;
    
    const distance = calculateDistance(
      searchLocation[0], 
      searchLocation[1], 
      item.location.latitude, 
      item.location.longitude
    );
    
    return distance <= maxDistance;
  });
};

export const useLocationBasedData = (searchLocation) => {
  const [data, setData] = useState({
    energySources: [],
    demandCenters: [],
    waterSources: [],
    waterBodies: [],
    gasPipelines: [],
    roadNetworks: [],
    optimalLocations: []
  });
  const [allData, setAllData] = useState(null); // Cache all data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all data once and cache it
  const loadAllDataOnce = async () => {
    if (allData) return allData; // Return cached data if available
    
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Loading H₂-Optimize data (one-time cache)...');
      
      const [
        energyResponse,
        demandResponse,
        waterSourcesResponse,
        waterBodiesResponse,
        pipelinesResponse,
        roadsResponse,
        optimalResponse
      ] = await Promise.allSettled([
        energySourcesAPI.getAll(),
        demandCentersAPI.getAll(),
        waterSourcesAPI.getAll(),
        waterBodiesAPI.getAll(),
        gasPipelinesAPI.getAll(),
        roadNetworksAPI.getAll(),
        algorithmAPI.getPreCalculated()
      ]);

      const cachedData = {
        energySources: energyResponse.status === 'fulfilled' ? energyResponse.value.data : [],
        demandCenters: demandResponse.status === 'fulfilled' ? demandResponse.value.data : [],
        waterSources: waterSourcesResponse.status === 'fulfilled' ? waterSourcesResponse.value.data : [],
        waterBodies: waterBodiesResponse.status === 'fulfilled' ? waterBodiesResponse.value.data : [],
        gasPipelines: pipelinesResponse.status === 'fulfilled' ? pipelinesResponse.value.data : [],
        roadNetworks: roadsResponse.status === 'fulfilled' ? roadsResponse.value.data : [],
        optimalLocations: optimalResponse.status === 'fulfilled' ? optimalResponse.value.data : []
      };

      setAllData(cachedData);
      console.log('✅ Data cached successfully');
      
      return cachedData;
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      const errorInfo = handleApiError(error, 'useLocationBasedData.loadAllDataOnce');
      setError(errorInfo.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search location
  useEffect(() => {
    const filterDataForLocation = async () => {
      const cachedData = await loadAllDataOnce();
      
      if (!cachedData) return;

      if (!searchLocation) {
        // If no search location, show minimal data or empty
        console.log('📍 No search location - showing minimal data');
        setData({
          energySources: [],
          demandCenters: [],
          waterSources: [],
          waterBodies: [],
          gasPipelines: [],
          roadNetworks: [],
          optimalLocations: cachedData.optimalLocations.slice(0, 5) // Show only top 5 optimal locations
        });
        return;
      }

      console.log('🔍 Filtering data for location:', searchLocation);

      // Filter each dataset by distance from search location (MORE STRICT)
      const filteredData = {
        energySources: filterDataByLocation(cachedData.energySources, searchLocation, 100), // Reduced from 150
        demandCenters: filterDataByLocation(cachedData.demandCenters, searchLocation, 60),  // Reduced from 100
        waterSources: filterDataByLocation(cachedData.waterSources, searchLocation, 50),   // Reduced from 80
        waterBodies: filterDataByLocation(cachedData.waterBodies, searchLocation, 50),     // Reduced from 80
        gasPipelines: filterDataByLocation(cachedData.gasPipelines, searchLocation, 40),   // Reduced from 50
        roadNetworks: filterDataByLocation(cachedData.roadNetworks, searchLocation, 25),   // Reduced from 30
        optimalLocations: filterDataByLocation(cachedData.optimalLocations, searchLocation, 50) // Reduced from 75
      };

      // ADDITIONAL FILTERING: Only show top 3 closest assets per category for cleaner display
      const limitedData = {
        energySources: filteredData.energySources.slice(0, 3),
        demandCenters: filteredData.demandCenters.slice(0, 3),
        waterSources: filteredData.waterSources.slice(0, 3),
        waterBodies: filteredData.waterBodies.slice(0, 2),
        gasPipelines: filteredData.gasPipelines.slice(0, 2),
        roadNetworks: filteredData.roadNetworks.slice(0, 2),
        optimalLocations: filteredData.optimalLocations.slice(0, 5)
      };

      console.log('📊 Filtered data counts (STRICT FILTERING):', {
        energySources: limitedData.energySources.length,
        demandCenters: limitedData.demandCenters.length,
        waterSources: limitedData.waterSources.length,
        waterBodies: limitedData.waterBodies.length,
        gasPipelines: limitedData.gasPipelines.length,
        roadNetworks: limitedData.roadNetworks.length,
        optimalLocations: limitedData.optimalLocations.length
      });

      setData(limitedData);
    };

    filterDataForLocation();
  }, [searchLocation]);

  const refetch = () => {
    setAllData(null); // Clear cache to force reload
    loadAllDataOnce();
  };

  return {
    ...data,
    loading,
    error,
    refetch,
    hasSearchLocation: !!searchLocation
  };
};

export const useLocationAnalysis = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeLocation = async (location, weights = null) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Analyzing location:', location);
      
      const response = await algorithmAPI.analyzeLocation(location, weights);
      setAnalysisData(response.data);
      
      console.log('✅ Location analysis completed:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Location analysis failed:', error);
      const errorInfo = handleApiError(error, 'useLocationAnalysis.analyzeLocation');
      setError(errorInfo.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    analysisData,
    loading,
    error,
    analyzeLocation
  };
};
