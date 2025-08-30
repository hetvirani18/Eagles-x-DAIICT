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
      greenEnergy: { distance: 2.5, name: 'Solar Farm Ahmedabad' },
      waterBody: { distance: 1.8, name: 'Sabarmati River' },
      industry: { distance: 3.2, name: 'Chemical Complex' },
      transportation: { distance: 5.0, name: 'Ahmedabad Airport' }
    },
    estimatedCosts: {
      landAcquisition: 50,
      infrastructure: 120,
      connectivity: 30
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
      greenEnergy: { distance: 1.5, name: 'Wind Farm Surat' },
      waterBody: { distance: 3.0, name: 'Tapi River' },
      industry: { distance: 2.8, name: 'Textile Hub' },
      transportation: { distance: 4.5, name: 'Surat Port' }
    },
    estimatedCosts: {
      landAcquisition: 45,
      infrastructure: 110,
      connectivity: 25
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
      greenEnergy: { distance: 3.2, name: 'Hybrid Energy Park' },
      waterBody: { distance: 2.1, name: 'Vishwamitri River' },
      industry: { distance: 1.8, name: 'Petrochemical Complex' },
      transportation: { distance: 6.2, name: 'Vadodara Railway Junction' }
    },
    estimatedCosts: {
      landAcquisition: 42,
      infrastructure: 105,
      connectivity: 28
    },
    isGoldenLocation: false,
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
      console.log(`${index + 1}. ${site.district} - Score: ${site.overallScore}/10 ${site.isGoldenLocation ? '⭐' : ''} (ID: ${site._id})`);
    });

    // Store the IDs for frontend use
    console.log('\n📋 Use these IDs in your frontend:');
    console.log('Ahmedabad ID:', insertedSites[0]._id);
    console.log('Surat ID:', insertedSites[1]._id);
    console.log('Vadodara ID:', insertedSites[2]._id);

  } catch (error) {
    console.error('Error seeding optimal sites:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

seedOptimalSites();
