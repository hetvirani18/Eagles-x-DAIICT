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

export const useApiData = () => {
  const [data, setData] = useState({
    energySources: [],
    demandCenters: [],
    waterSources: [],
    waterBodies: [],
    gasPipelines: [],
    roadNetworks: [],
    optimalLocations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Loading all H₂-Optimize data...');
      
      // Load all data in parallel
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

      // Process responses and handle errors gracefully
      const newData = {
        energySources: energyResponse.status === 'fulfilled' ? energyResponse.value.data : [],
        demandCenters: demandResponse.status === 'fulfilled' ? demandResponse.value.data : [],
        waterSources: waterSourcesResponse.status === 'fulfilled' ? waterSourcesResponse.value.data : [],
        waterBodies: waterBodiesResponse.status === 'fulfilled' ? waterBodiesResponse.value.data : [],
        gasPipelines: pipelinesResponse.status === 'fulfilled' ? pipelinesResponse.value.data : [],
        roadNetworks: roadsResponse.status === 'fulfilled' ? roadsResponse.value.data : [],
        optimalLocations: optimalResponse.status === 'fulfilled' ? optimalResponse.value.data : []
      };

      setData(newData);
      
      console.log('✅ H₂-Optimize data loaded successfully:', {
        energySources: newData.energySources.length,
        demandCenters: newData.demandCenters.length,
        waterSources: newData.waterSources.length,
        waterBodies: newData.waterBodies.length,
        gasPipelines: newData.gasPipelines.length,
        roadNetworks: newData.roadNetworks.length,
        optimalLocations: newData.optimalLocations.length
      });

      // Check for any failures
      const failures = [
        energyResponse, demandResponse, waterSourcesResponse, 
        waterBodiesResponse, pipelinesResponse, roadsResponse, optimalResponse
      ].filter(response => response.status === 'rejected');

      if (failures.length > 0) {
        console.warn(`⚠️ ${failures.length} API calls failed, but app will continue with available data`);
        setError(`Some data sources failed to load (${failures.length}/${7})`);
      }

    } catch (error) {
      console.error('❌ Failed to load H₂-Optimize data:', error);
      const errorInfo = handleApiError(error, 'useApiData.loadAllData');
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const refetch = () => {
    loadAllData();
  };

  return {
    ...data,
    loading,
    error,
    refetch
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