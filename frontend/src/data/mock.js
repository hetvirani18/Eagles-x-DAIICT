// Mock data for Gujarat's green hydrogen optimization
export const gujaratBounds = {
  north: 24.7,
  south: 20.1,
  east: 74.5,
  west: 68.2
};

export const gujaratCenter = [22.5, 71.5];

// Solar and Wind Energy Sources in Gujarat
export const energySources = [
  {
    id: 'solar_1',
    name: 'Charanka Solar Park',
    type: 'Solar',
    location: [23.2967, 71.1723],
    capacity: 590, // MW
    costPerKWh: 2.1,
    coordinates: [71.1723, 23.2967]
  },
  {
    id: 'solar_2', 
    name: 'Mundra Solar Park',
    type: 'Solar',
    location: [22.8394, 69.7219],
    capacity: 750,
    costPerKWh: 2.0,
    coordinates: [69.7219, 22.8394]
  },
  {
    id: 'wind_1',
    name: 'Kutch Wind Farm',
    type: 'Wind',
    location: [23.7337, 69.8597],
    capacity: 1200,
    costPerKWh: 2.3,
    coordinates: [69.8597, 23.7337]
  },
  {
    id: 'solar_3',
    name: 'Dhuvaran Solar Complex',
    type: 'Solar',
    location: [21.6417, 72.9981],
    capacity: 400,
    costPerKWh: 2.2,
    coordinates: [72.9981, 21.6417]
  },
  {
    id: 'wind_2',
    name: 'Jamnagar Wind Park',
    type: 'Wind', 
    location: [22.4707, 70.0577],
    capacity: 800,
    costPerKWh: 2.4,
    coordinates: [70.0577, 22.4707]
  }
];

// Industrial Demand Centers
export const demandCenters = [
  {
    id: 'ind_1',
    name: 'Kandla Port & SEZ',
    type: 'Port/Industrial',
    location: [23.0225, 70.2667],
    demandMT: 25000, // Metric tons per year
    coordinates: [70.2667, 23.0225]
  },
  {
    id: 'ind_2',
    name: 'GIDC Ankleshwar',
    type: 'Chemical Complex',
    location: [21.6279, 72.9831],
    demandMT: 35000,
    coordinates: [72.9831, 21.6279]
  },
  {
    id: 'ind_3',
    name: 'Dahej Industrial Complex',
    type: 'Petrochemical',
    location: [21.7000, 72.5667],
    demandMT: 40000,
    coordinates: [72.5667, 21.7000]
  },
  {
    id: 'ind_4',
    name: 'Mundra Port',
    type: 'Port/Logistics',
    location: [22.8394, 69.7219],
    demandMT: 30000,
    coordinates: [69.7219, 22.8394]
  },
  {
    id: 'ind_5',
    name: 'Sanand Industrial Park',
    type: 'Automotive/Industrial',
    location: [22.9826, 72.3881],
    demandMT: 18000,
    coordinates: [72.3881, 22.9826]
  },
  {
    id: 'ind_6',
    name: 'Hazira Industrial Complex',
    type: 'Steel/Chemical',
    location: [21.1167, 72.6167],
    demandMT: 45000,
    coordinates: [72.6167, 21.1167]
  }
];

// Water Sources
export const waterSources = [
  {
    id: 'water_1',
    name: 'Narmada Main Canal',
    type: 'Canal',
    location: [22.7196, 72.1416],
    capacity: 1000000, // Liters per day
    coordinates: [72.1416, 22.7196]
  },
  {
    id: 'water_2',
    name: 'Sardar Sarovar Reservoir',
    type: 'Reservoir',
    location: [21.8333, 73.7500],
    capacity: 2000000,
    coordinates: [73.7500, 21.8333]
  },
  {
    id: 'water_3',
    name: 'Sabarmati River',
    type: 'River',
    location: [23.0225, 72.5714],
    capacity: 800000,
    coordinates: [72.5714, 23.0225]
  },
  {
    id: 'water_4',
    name: 'Mahi River',
    type: 'River',
    location: [22.3039, 73.1812],
    capacity: 600000,
    coordinates: [73.1812, 22.3039]
  },
  {
    id: 'water_5',
    name: 'Tapi River',
    type: 'River',
    location: [21.1702, 72.8311],
    capacity: 700000,
    coordinates: [72.8311, 21.1702]
  }
];

// Pre-calculated optimal locations using weighted overlay algorithm
export const optimalLocations = [
  {
    id: 'opt_1',
    location: [21.6500, 72.8500],
    score: 285,
    coordinates: [72.8500, 21.6500],
    nearestEnergy: {
      source: 'Dhuvaran Solar Complex',
      distance: 15.2,
      type: 'Solar'
    },
    nearestDemand: {
      center: 'GIDC Ankleshwar', 
      distance: 8.5,
      type: 'Chemical Complex'
    },
    nearestWater: {
      source: 'Tapi River',
      distance: 12.1,
      type: 'River'
    },
    projectedCost: 2.8,
    annualCapacity: 22000
  },
  {
    id: 'opt_2',
    location: [22.9200, 70.8500],
    score: 278,
    coordinates: [70.8500, 22.9200],
    nearestEnergy: {
      source: 'Charanka Solar Park',
      distance: 18.7,
      type: 'Solar'
    },
    nearestDemand: {
      center: 'Kandla Port & SEZ',
      distance: 22.3,
      type: 'Port/Industrial'
    },
    nearestWater: {
      source: 'Narmada Main Canal',
      distance: 25.4,
      type: 'Canal'
    },
    projectedCost: 2.6,
    annualCapacity: 28000
  },
  {
    id: 'opt_3',
    location: [22.7800, 69.8200],
    score: 272,
    coordinates: [69.8200, 22.7800],
    nearestEnergy: {
      source: 'Mundra Solar Park',
      distance: 12.1,
      type: 'Solar'
    },
    nearestDemand: {
      center: 'Mundra Port',
      distance: 8.9,
      type: 'Port/Logistics'
    },
    nearestWater: {
      source: 'Narmada Main Canal',
      distance: 35.2,
      type: 'Canal'
    },
    projectedCost: 2.7,
    annualCapacity: 25000
  },
  {
    id: 'opt_4',
    location: [21.4000, 72.6800],
    score: 265,
    coordinates: [72.6800, 21.4000],
    nearestEnergy: {
      source: 'Dhuvaran Solar Complex',
      distance: 28.5,
      type: 'Solar'
    },
    nearestDemand: {
      center: 'Hazira Industrial Complex',
      distance: 15.7,
      type: 'Steel/Chemical'
    },
    nearestWater: {
      source: 'Tapi River',
      distance: 18.3,
      type: 'River'
    },
    projectedCost: 2.9,
    annualCapacity: 20000
  },
  {
    id: 'opt_5',
    location: [23.1500, 72.2200],
    score: 258,
    coordinates: [72.2200, 23.1500],
    nearestEnergy: {
      source: 'Charanka Solar Park',
      distance: 32.4,
      type: 'Solar'
    },
    nearestDemand: {
      center: 'Sanand Industrial Park',
      distance: 19.8,
      type: 'Automotive/Industrial'
    },
    nearestWater: {
      source: 'Sabarmati River',
      distance: 22.1,
      type: 'River'
    },
    projectedCost: 3.1,
    annualCapacity: 18000
  }
];

// Cities for search functionality
export const gujaratCities = [
  { name: 'Ahmedabad', coordinates: [72.5797, 23.0225] },
  { name: 'Surat', coordinates: [72.8311, 21.1702] },
  { name: 'Vadodara', coordinates: [73.2080, 22.3072] },
  { name: 'Rajkot', coordinates: [70.7833, 22.3039] },
  { name: 'Bhavnagar', coordinates: [72.1519, 21.7645] },
  { name: 'Jamnagar', coordinates: [70.0577, 22.4707] },
  { name: 'Gandhinagar', coordinates: [72.6369, 23.2156] },
  { name: 'Anand', coordinates: [72.9289, 22.5645] },
  { name: 'Kutch', coordinates: [69.8597, 23.7337] },
  { name: 'Mundra', coordinates: [69.7219, 22.8394] }
];