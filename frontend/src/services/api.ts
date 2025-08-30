import axios from 'axios';
import type { 
  OptimalSite, 
  SiteAnalysis, 
  ApiResponse, 
  AnalysisRequest,
  GreenEnergy,
  WaterBody,
  Industry,
  Transportation,
  ExportOptions
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class ApiService {
  // Sites API
  static async analyzeRegion(request: AnalysisRequest): Promise<ApiResponse<OptimalSite[]>> {
    const response = await api.post('/sites/analyze', request);
    return response.data;
  }

  static async getOptimalSites(
    region: string, 
    limit: number = 50, 
    goldenOnly: boolean = false
  ): Promise<ApiResponse<OptimalSite[]>> {
    // Use 'all' as default if region is empty
    const regionParam = region || 'all';
    const response = await api.get(`/sites/${regionParam}`, {
      params: { limit, goldenOnly }
    });
    return response.data;
  }

  static async getSiteDetails(siteId: string): Promise<SiteAnalysis> {
    const response = await api.get(`/sites/details/${siteId}`);
    return response.data;
  }

  static async getSitesNearby(
    longitude: number, 
    latitude: number, 
    radius: number = 10
  ): Promise<ApiResponse<OptimalSite[]>> {
    const response = await api.get('/sites/nearby', {
      params: { longitude, latitude, radius }
    });
    return response.data;
  }

  static async exportSites(options: ExportOptions): Promise<Blob> {
    const response = await api.get('/sites/export', {
      params: options,
      responseType: 'blob'
    });
    return response.data;
  }

  // Resources API
  static async getGreenEnergy(
    region?: string, 
    type?: string, 
    limit: number = 100
  ): Promise<ApiResponse<GreenEnergy[]>> {
    const response = await api.get('/resources/green-energy', {
      params: { region, type, limit }
    });
    return response.data;
  }

  static async getWaterBodies(
    region?: string, 
    type?: string, 
    limit: number = 100
  ): Promise<ApiResponse<WaterBody[]>> {
    const response = await api.get('/resources/water-bodies', {
      params: { region, type, limit }
    });
    return response.data;
  }

  static async getIndustries(
    region?: string, 
    type?: string, 
    limit: number = 100
  ): Promise<ApiResponse<Industry[]>> {
    const response = await api.get('/resources/industries', {
      params: { region, type, limit }
    });
    return response.data;
  }

  static async getTransportation(
    region?: string, 
    type?: string, 
    limit: number = 100
  ): Promise<ApiResponse<Transportation[]>> {
    const response = await api.get('/resources/transportation', {
      params: { region, type, limit }
    });
    return response.data;
  }

  static async getResourcesSummary(region: string): Promise<any> {
    const response = await api.get(`/resources/summary/${region}`);
    return response.data;
  }

  static async getResourcesNearby(
    longitude: number, 
    latitude: number, 
    radius: number = 10,
    resourceType?: string
  ): Promise<any> {
    const response = await api.get('/resources/nearby', {
      params: { longitude, latitude, radius, resourceType }
    });
    return response.data;
  }

  // Analysis API
  static async getAnalysisStats(region?: string): Promise<any> {
    const response = await api.get('/analysis/stats', {
      params: { region }
    });
    return response.data;
  }

  static async compareSites(siteIds: string[]): Promise<any> {
    const response = await api.post('/analysis/compare', { siteIds });
    return response.data;
  }

  static async getRegionalTrends(): Promise<any> {
    const response = await api.get('/analysis/trends');
    return response.data;
  }
}

export default ApiService;
