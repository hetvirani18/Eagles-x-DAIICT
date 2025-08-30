import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔍 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// API Services
export const energySourcesAPI = {
  getAll: () => apiClient.get('/energy-sources'),
  create: (data) => apiClient.post('/energy-sources', data)
};

export const demandCentersAPI = {
  getAll: () => apiClient.get('/demand-centers'),
  create: (data) => apiClient.post('/demand-centers', data)
};

export const waterSourcesAPI = {
  getAll: () => apiClient.get('/water-sources'),
  create: (data) => apiClient.post('/water-sources', data)
};

export const waterBodiesAPI = {
  getAll: () => apiClient.get('/water-bodies'),
  create: (data) => apiClient.post('/water-bodies', data)
};

export const gasPipelinesAPI = {
  getAll: () => apiClient.get('/gas-pipelines'),
  create: (data) => apiClient.post('/gas-pipelines', data)
};

export const roadNetworksAPI = {
  getAll: () => apiClient.get('/road-networks'),
  create: (data) => apiClient.post('/road-networks', data)
};

export const citiesAPI = {
  search: (query) => apiClient.get(`/cities?q=${encodeURIComponent(query)}`),
  getAll: () => apiClient.get('/cities')
};

export const algorithmAPI = {
  analyzeLocation: (location, weights = null) => 
    apiClient.post('/analyze-location', { location, weights }),
  calculateOptimalLocations: (bounds, weights = null, limit = 10) =>
    apiClient.post('/calculate-optimal-locations', { bounds, weights, limit }),
  getPreCalculated: () => apiClient.get('/optimal-locations')
};

// Utility function to handle API errors
export const handleApiError = (error, context = '') => {
  console.error(`API Error in ${context}:`, error);
  
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.detail || 'Server error occurred',
      status: error.response.status
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      message: 'Network error - please check your connection',
      status: 'network_error'
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'Unknown error occurred',
      status: 'unknown_error'
    };
  }
};

export default apiClient;