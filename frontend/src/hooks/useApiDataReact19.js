import { useState, useCallback, startTransition, useDeferredValue } from 'react';

/**
 * Modern React 19 Enhanced API Data Hook
 * Features:
 * - Concurrent features with startTransition
 * - useDeferredValue for better performance
 * - Enhanced error handling
 * - Optimistic updates
 */
export const useApiDataReact19 = () => {
  const [data, setData] = useState({
    energySources: [],
    demandCenters: [],
    waterSources: [],
    waterBodies: [],
    gasPipelines: [],
    roadNetworks: [],
    optimalLocations: [],
    cities: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // React 19: Deferred loading state for better UX
  const deferredLoading = useDeferredValue(loading);
  
  // React 19: Enhanced data loading with concurrent features
  const loadData = useCallback(async (endpoint, dataKey) => {
    setIsPending(true);
    
    try {
      console.log(`🔄 React 19 Enhanced Loading: ${endpoint}`);
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // React 19: Use startTransition for non-blocking state updates
      startTransition(() => {
        setData(prevData => ({
          ...prevData,
          [dataKey]: result.data || result
        }));
        setError(null);
        setLastUpdated(new Date().toISOString());
        setIsPending(false);
      });
      
      console.log(`✅ React 19 Enhanced Loaded: ${endpoint}`, result.data?.length || 'N/A', 'items');
      
      return result;
      
    } catch (error) {
      console.error(`❌ React 19 Enhanced Error loading ${endpoint}:`, error);
      
      startTransition(() => {
        setError({
          endpoint,
          message: error.message,
          timestamp: new Date().toISOString()
        });
        setIsPending(false);
      });
      
      throw error;
    }
  }, []);
  
  // React 19: Enhanced bulk data loading
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsPending(true);
    
    console.log('🔄 React 19 Enhanced: Loading all H₂-Optimize data...');
    
    const endpoints = [
      { endpoint: 'energy-sources', key: 'energySources' },
      { endpoint: 'demand-centers', key: 'demandCenters' },
      { endpoint: 'water-sources', key: 'waterSources' },
      { endpoint: 'water-bodies', key: 'waterBodies' },
      { endpoint: 'gas-pipelines', key: 'gasPipelines' },
      { endpoint: 'road-networks', key: 'roadNetworks' },
      { endpoint: 'optimal-locations', key: 'optimalLocations' },
      { endpoint: 'cities', key: 'cities' }
    ];
    
    const results = await Promise.allSettled(
      endpoints.map(({ endpoint, key }) => loadData(endpoint, key))
    );
    
    const failedCount = results.filter(result => result.status === 'rejected').length;
    const successCount = results.filter(result => result.status === 'fulfilled').length;
    
    // React 19: Non-blocking final state update
    startTransition(() => {
      setLoading(false);
      setIsPending(false);
      setLastUpdated(new Date().toISOString());
    });
    
    if (failedCount > 0) {
      console.log(`⚠️ React 19 Enhanced: ${failedCount} API calls failed, but app continues with available data`);
    }
    
    console.log(`✅ React 19 Enhanced: H₂-Optimize data loaded successfully!`, {
      successful: successCount,
      failed: failedCount,
      total: endpoints.length
    });
    
    return {
      successful: successCount,
      failed: failedCount,
      total: endpoints.length,
      data: data
    };
  }, [loadData, data]);
  
  // React 19: Optimistic update function
  const optimisticUpdate = useCallback((dataKey, newData) => {
    startTransition(() => {
      setData(prevData => ({
        ...prevData,
        [dataKey]: newData
      }));
    });
  }, []);
  
  // React 19: Enhanced search with concurrent features
  const searchData = useCallback((query, categories = []) => {
    if (!query || query.length < 2) return [];
    
    const searchableData = categories.length > 0 
      ? categories.reduce((acc, category) => {
          return [...acc, ...(data[category] || [])];
        }, [])
      : Object.values(data).flat();
    
    return searchableData.filter(item => {
      if (!item) return false;
      
      const searchFields = [
        item.name,
        item.title,
        item.location,
        item.city,
        item.district,
        item.type,
        item.description
      ].filter(Boolean);
      
      return searchFields.some(field => 
        field.toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [data]);
  
  return {
    // Data state
    data,
    loading: deferredLoading,
    isPending,
    error,
    lastUpdated,
    
    // Actions
    loadData,
    loadAllData,
    optimisticUpdate,
    searchData,
    
    // React 19 enhanced features
    isReact19Enhanced: true,
    
    // Computed values
    totalItems: Object.values(data).reduce((total, items) => total + (items?.length || 0), 0),
    hasData: Object.values(data).some(items => items?.length > 0),
    
    // Performance indicators
    performanceMetrics: {
      isPending,
      deferredLoading: deferredLoading !== loading,
      lastUpdated
    }
  };
};

export default useApiDataReact19;
