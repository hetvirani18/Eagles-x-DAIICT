const mongoose = require('mongoose');
const GreenEnergy = require('../models/GreenEnergy');
const WaterBody = require('../models/WaterBody');
const Industry = require('../models/Industry');
const Transportation = require('../models/Transportation');
require('dotenv').config();

// Sample data for Gujarat
const sampleGreenEnergy = [
  {
    name: "Charanka Solar Park",
    type: "solar",
    location: { type: "Point", coordinates: [71.1924, 23.9045] },
    capacity: 345,
    operationalStatus: "operational",
    district: "Patan",
    address: "Charanka, Patan District, Gujarat",
    operator: "Gujarat State Electricity Corporation"
  },
  {
    name: "Kutch Wind Farm",
    type: "wind",
    location: { type: "Point", coordinates: [70.3347, 23.7337] },
    capacity: 1000,
    operationalStatus: "operational",
    district: "Kutch",
    address: "Kutch District, Gujarat",
    operator: "Suzlon Energy"
  },
  {
    name: "Ahmedabad Solar Plant",
    type: "solar",
    location: { type: "Point", coordinates: [72.5714, 23.0225] },
    capacity: 50,
    operationalStatus: "operational",
    district: "Ahmedabad",
    address: "Ahmedabad, Gujarat",
    operator: "Adani Green Energy"
  },
  {
    name: "Surat Solar Park",
    type: "solar",
    location: { type: "Point", coordinates: [72.8311, 21.1702] },
    capacity: 75,
    operationalStatus: "operational",
    district: "Surat",
    address: "Surat, Gujarat",
    operator: "Tata Power Solar"
  },
  {
    name: "Vadodara Wind Project",
    type: "wind",
    location: { type: "Point", coordinates: [73.2081, 22.3072] },
    capacity: 200,
    operationalStatus: "under-construction",
    district: "Vadodara",
    address: "Vadodara, Gujarat",
    operator: "ReNew Power"
  }
];

const sampleWaterBodies = [
  {
    name: "Sardar Sarovar Dam",
    type: "reservoir",
    location: { type: "Point", coordinates: [73.7898, 21.8258] },
    waterQuality: "good",
    availabilityPercentage: 95,
    district: "Narmada",
    capacity: 9500000,
    accessibilityRating: 9
  },
  {
    name: "Sabarmati River",
    type: "river",
    location: { type: "Point", coordinates: [72.5857, 23.0333] },
    waterQuality: "moderate",
    availabilityPercentage: 70,
    district: "Ahmedabad",
    capacity: 2000000,
    accessibilityRating: 8
  },
  {
    name: "Tapi River",
    type: "river",
    location: { type: "Point", coordinates: [72.7833, 21.1667] },
    waterQuality: "good",
    availabilityPercentage: 80,
    district: "Surat",
    capacity: 3000000,
    accessibilityRating: 7
  },
  {
    name: "Mahi River",
    type: "river",
    location: { type: "Point", coordinates: [73.1812, 22.6792] },
    waterQuality: "good",
    availabilityPercentage: 75,
    district: "Vadodara",
    capacity: 1500000,
    accessibilityRating: 6
  },
  {
    name: "Narmada Canal",
    type: "canal",
    location: { type: "Point", coordinates: [72.9511, 22.7196] },
    waterQuality: "excellent",
    availabilityPercentage: 100,
    district: "Vadodara",
    capacity: 5000000,
    accessibilityRating: 9
  }
];

const sampleIndustries = [
  {
    name: "Reliance Petroleum Refinery",
    type: "refinery",
    location: { type: "Point", coordinates: [72.9342, 21.1458] },
    hydrogenDemand: 150,
    currentHydrogenSource: "steam-reforming",
    district: "Surat",
    employeeCount: 8000,
    annualRevenue: 45000,
    sustainabilityRating: 7
  },
  {
    name: "GNFC Fertilizer Plant",
    type: "fertilizer",
    location: { type: "Point", coordinates: [72.6369, 23.0593] },
    hydrogenDemand: 80,
    currentHydrogenSource: "steam-reforming",
    district: "Ahmedabad",
    employeeCount: 3500,
    annualRevenue: 12000,
    sustainabilityRating: 6
  },
  {
    name: "Tata Steel Processing Unit",
    type: "steel",
    location: { type: "Point", coordinates: [73.1896, 22.2587] },
    hydrogenDemand: 200,
    currentHydrogenSource: "steam-reforming",
    district: "Vadodara",
    employeeCount: 12000,
    annualRevenue: 25000,
    sustainabilityRating: 8
  },
  {
    name: "Gujarat Alkalies Chemical Plant",
    type: "chemical",
    location: { type: "Point", coordinates: [72.8311, 21.2180] },
    hydrogenDemand: 60,
    currentHydrogenSource: "electrolysis",
    district: "Surat",
    employeeCount: 2800,
    annualRevenue: 8500,
    sustainabilityRating: 7
  },
  {
    name: "Maruti Suzuki Plant",
    type: "automotive",
    location: { type: "Point", coordinates: [72.6815, 23.1685] },
    hydrogenDemand: 25,
    currentHydrogenSource: "none",
    district: "Ahmedabad",
    employeeCount: 6000,
    annualRevenue: 18000,
    sustainabilityRating: 8
  }
];

const sampleTransportation = [
  {
    name: "NH 8 Highway",
    type: "highway",
    location: { 
      type: "LineString", 
      coordinates: [[72.5857, 23.0333], [72.8311, 21.1702]] 
    },
    connectivity: "national",
    trafficDensity: "high",
    district: "Ahmedabad",
    roadCondition: "excellent"
  },
  {
    name: "Ahmedabad Railway Junction",
    type: "railway",
    location: { type: "Point", coordinates: [72.6167, 23.0167] },
    connectivity: "national",
    trafficDensity: "very-high",
    district: "Ahmedabad",
    roadCondition: "excellent"
  },
  {
    name: "Kandla Port",
    type: "port",
    location: { type: "Point", coordinates: [70.2167, 23.0333] },
    connectivity: "national",
    trafficDensity: "high",
    district: "Kutch",
    roadCondition: "good"
  },
  {
    name: "Surat-Pune Highway",
    type: "state-highway",
    location: { 
      type: "LineString", 
      coordinates: [[72.8311, 21.1702], [73.8567, 18.5204]] 
    },
    connectivity: "state",
    trafficDensity: "medium",
    district: "Surat",
    roadCondition: "good"
  },
  {
    name: "Vadodara Airport",
    type: "airport",
    location: { type: "Point", coordinates: [73.2264, 22.3361] },
    connectivity: "state",
    trafficDensity: "medium",
    district: "Vadodara",
    roadCondition: "excellent"
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      GreenEnergy.deleteMany({}),
      WaterBody.deleteMany({}),
      Industry.deleteMany({}),
      Transportation.deleteMany({})
    ]);

    // Insert sample data
    console.log('Inserting sample data...');
    await Promise.all([
      GreenEnergy.insertMany(sampleGreenEnergy),
      WaterBody.insertMany(sampleWaterBodies),
      Industry.insertMany(sampleIndustries),
      Transportation.insertMany(sampleTransportation)
    ]);

    console.log('Sample data inserted successfully!');
    console.log(`
    Data Summary:
    - Green Energy Sources: ${sampleGreenEnergy.length}
    - Water Bodies: ${sampleWaterBodies.length}
    - Industries: ${sampleIndustries.length}
    - Transportation: ${sampleTransportation.length}
    `);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
