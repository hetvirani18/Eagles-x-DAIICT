export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GreenEnergy {
  _id: string;
  name: string;
  type: 'solar' | 'wind' | 'hybrid';
  location: Location;
  capacity: number; // in MW
  operationalStatus: 'operational' | 'under-construction' | 'planned';
  district: string;
  address: string;
  operator: string;
  createdAt: string;
  updatedAt: string;
}

export interface WaterBody {
  _id: string;
  name: string;
  type: 'river' | 'reservoir' | 'lake' | 'groundwater' | 'canal';
  location: Location;
  waterQuality: 'excellent' | 'good' | 'moderate' | 'poor';
  availabilityPercentage: number;
  district: string;
  capacity: number; // in million liters
  accessibilityRating: number; // 1-10 scale
  createdAt: string;
  updatedAt: string;
}

export interface Industry {
  _id: string;
  name: string;
  type: 'chemical' | 'steel' | 'refinery' | 'fertilizer' | 'glass' | 'cement' | 'automotive' | 'textile';
  location: Location;
  hydrogenDemand: number; // in tons per day
  currentHydrogenSource: 'steam-reforming' | 'electrolysis' | 'none' | 'mixed';
  district: string;
  employeeCount: number;
  annualRevenue: number; // in crores INR
  sustainabilityRating: number; // 1-10 scale
  createdAt: string;
  updatedAt: string;
}

export interface Transportation {
  _id: string;
  name: string;
  type: 'highway' | 'state-highway' | 'railway' | 'port' | 'airport';
  location: Location | {
    type: 'LineString';
    coordinates: [number, number][];
  };
  connectivity: 'national' | 'state' | 'district' | 'local';
  trafficDensity: 'low' | 'medium' | 'high' | 'very-high';
  district: string;
  roadCondition: 'excellent' | 'good' | 'average' | 'poor';
  createdAt: string;
  updatedAt: string;
}

export interface NearestResource {
  id: string;
  distance: number; // in km
  name: string;
}

export interface OptimalSite {
  _id: string;
  location: Location;
  district: string;
  region: string;
  overallScore: number;
  scores: {
    greenEnergyScore: number;
    waterAccessScore: number;
    industryProximityScore: number;
    transportationScore: number;
  };
  nearestResources: {
    greenEnergy: NearestResource;
    waterBody: NearestResource;
    industry: NearestResource;
    transportation: NearestResource;
  };
  estimatedCosts: {
    landAcquisition: number; // in crores INR
    infrastructure: number; // in crores INR
    connectivity: number; // in crores INR
  };
  isGoldenLocation: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteAnalysis {
  site: OptimalSite;
  detailedAnalysis: {
    strengths: string[];
    challenges: string[];
    recommendations: string[];
  };
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  count?: number;
  sites?: T[];
  error?: string;
}

export interface AnalysisRequest {
  region: string;
  gridResolution?: number;
}

export interface RegionalStats {
  region: string;
  totalSites: number;
  goldenLocations: number;
  averageScore: number;
  topFactors: string[];
}

export interface ExportOptions {
  region: string;
  format: 'json' | 'csv' | 'geojson';
  goldenOnly?: boolean;
}
