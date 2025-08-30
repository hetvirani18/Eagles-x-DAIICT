const mongoose = require('mongoose');
const OptimalSite = require('../models/OptimalSite');
require('dotenv').config();

const sampleOptimalSites = [
  {
    location: {
      type: 'Point',
      coordinates: [72.5714, 23.0225] // Ahmedabad
    },
    district: 'Ahmedabad',
    region: 'Central Gujarat',
    overallScore: 8.5,
    scores: {
      greenEnergyScore: 8.0,
      waterAccessScore: 8.5,
      industryProximityScore: 9.0,
      transportationScore: 8.5
    },
    nearestResources: {
      greenEnergy: { id: 'ge1', distance: 2.5, name: 'Ahmedabad Solar Park' },
      waterBody: { id: 'wb1', distance: 1.8, name: 'Sabarmati River' },
      industry: { id: 'ind1', distance: 3.2, name: 'Chemical Complex' },
      transportation: { id: 'tr1', distance: 1.5, name: 'Ahmedabad Airport' }
    },
    isGoldenLocation: true,
    analysisDate: new Date()
  },
  {
    location: {
      type: 'Point',
      coordinates: [72.8311, 21.1702] // Surat
    },
    district: 'Surat',
    region: 'South Gujarat',
    overallScore: 7.8,
    scores: {
      greenEnergyScore: 7.5,
      waterAccessScore: 8.0,
      industryProximityScore: 8.5,
      transportationScore: 7.5
    },
    nearestResources: {
      greenEnergy: { id: 'ge2', distance: 3.0, name: 'Surat Wind Farm' },
      waterBody: { id: 'wb2', distance: 2.2, name: 'Tapi River' },
      industry: { id: 'ind2', distance: 2.8, name: 'Diamond Polishing Hub' },
      transportation: { id: 'tr2', distance: 2.0, name: 'Surat Railway Junction' }
    },
    isGoldenLocation: false,
    analysisDate: new Date()
  },
  {
    location: {
      type: 'Point',
      coordinates: [73.1812, 22.3072] // Vadodara
    },
    district: 'Vadodara',
    region: 'Central Gujarat',
    overallScore: 7.2,
    scores: {
      greenEnergyScore: 7.0,
      waterAccessScore: 7.5,
      industryProximityScore: 7.0,
      transportationScore: 7.5
    },
    nearestResources: {
      greenEnergy: { id: 'ge3', distance: 4.0, name: 'Vadodara Solar Plant' },
      waterBody: { id: 'wb3', distance: 3.5, name: 'Vishwamitri River' },
      industry: { id: 'ind3', distance: 2.5, name: 'GIDC Industrial Area' },
      transportation: { id: 'tr3', distance: 3.0, name: 'Vadodara Junction' }
    },
    isGoldenLocation: false,
    analysisDate: new Date()
  },
  {
    location: {
      type: 'Point',
      coordinates: [70.0577, 22.4707] // Jamnagar
    },
    district: 'Jamnagar',
    region: 'Saurashtra',
    overallScore: 8.2,
    scores: {
      greenEnergyScore: 8.8,
      waterAccessScore: 7.0,
      industryProximityScore: 8.5,
      transportationScore: 8.5
    },
    nearestResources: {
      greenEnergy: { id: 'ge6', distance: 1.5, name: 'Jamnagar Solar Complex' },
      waterBody: { id: 'wb6', distance: 3.0, name: 'Gulf of Kutch' },
      industry: { id: 'ind6', distance: 2.0, name: 'Reliance Refinery' },
      transportation: { id: 'tr6', distance: 2.5, name: 'Jamnagar Airport' }
    },
    isGoldenLocation: true,
    analysisDate: new Date()
  }
];

async function seedOptimalSites() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hydrogen-plant-db');
    console.log('Connected to MongoDB');

    // Clear existing optimal sites
    await OptimalSite.deleteMany({});
    console.log('Cleared existing optimal sites');

    // Insert sample optimal sites
    const insertedSites = await OptimalSite.insertMany(sampleOptimalSites);
    console.log(`✅ Inserted ${insertedSites.length} optimal sites`);

    // Create geospatial index
    await OptimalSite.collection.createIndex({ location: '2dsphere' });
    console.log('Created geospatial index');

    console.log('\nOptimal sites added:');
    insertedSites.forEach((site, index) => {
      console.log(`${index + 1}. ${site.district} - Score: ${site.overallScore}/10 ${site.isGoldenLocation ? '⭐' : ''}`);
    });

  } catch (error) {
    console.error('Error seeding optimal sites:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

seedOptimalSites();
