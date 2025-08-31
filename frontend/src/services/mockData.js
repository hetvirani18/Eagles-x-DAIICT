/**
 * Mock API data for testing dynamic integration
 */

// Different mock data for different locations to demonstrate dynamic behavior
export const mockAnalysisDataByLocation = {
  // Kutch - High wind resources
  'kutch': {
    status: 'success',
    base_analysis: {
      optimal_capacity_kg_day: 1359.27,
      total_capex: 29819.46,
      roi_percentage: 12.3,
      hydrogen_price_per_kg: 312.17,
      annual_production_tonnes: 496.6,
      payback_period_years: 8.1
    }
  },
  
  // Ahmedabad - Industrial hub  
  'ahmedabad': {
    status: 'success',
    base_analysis: {
      optimal_capacity_kg_day: 1618.27,
      total_capex: 35419.46,
      roi_percentage: -1.74,
      hydrogen_price_per_kg: 413.17,
      annual_production_tonnes: 534.03,
      payback_period_years: 15.2
    }
  },
  
  // Surat - Coastal advantages
  'surat': {
    status: 'success',
    base_analysis: {
      optimal_capacity_kg_day: 1177.45,
      total_capex: 27850.23,
      roi_percentage: 8.7,
      hydrogen_price_per_kg: 298.45,
      annual_production_tonnes: 429.77,
      payback_period_years: 9.3
    }
  },
  
  // Coastal Gujarat - Offshore wind potential
  'coastal': {
    status: 'success',
    base_analysis: {
      optimal_capacity_kg_day: 1271.83,
      total_capex: 31245.67,
      roi_percentage: 15.8,
      hydrogen_price_per_kg: 267.89,
      annual_production_tonnes: 464.22,
      payback_period_years: 6.3
    }
  }
};

// Function to get mock data based on coordinates
export const getMockAnalysisData = (latitude, longitude) => {
  // Simple coordinate-based mapping to different regions
  if (latitude > 23 && longitude < 70) return mockAnalysisDataByLocation.kutch;
  if (latitude > 22 && longitude > 72) return mockAnalysisDataByLocation.ahmedabad;
  if (latitude < 22 && longitude > 72) return mockAnalysisDataByLocation.surat;
  return mockAnalysisDataByLocation.coastal;
};