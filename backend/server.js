const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/sites', require('./routes/sites'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/analysis', require('./routes/analysis'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

// Seed endpoint for development
app.post('/api/seed', async (req, res) => {
  try {
    const OptimalSite = require('./models/OptimalSite');
    
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

    // Clear existing data
    await OptimalSite.deleteMany({});
    
    // Insert sample data
    const insertedSites = await OptimalSite.insertMany(sampleOptimalSites);
    
    res.json({ 
      success: true, 
      message: `Successfully seeded ${insertedSites.length} optimal sites`,
      sites: insertedSites 
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
