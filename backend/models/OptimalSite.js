const mongoose = require('mongoose');

const OptimalSiteSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  district: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  scores: {
    greenEnergyScore: { type: Number, required: true },
    waterAccessScore: { type: Number, required: true },
    industryProximityScore: { type: Number, required: true },
    transportationScore: { type: Number, required: true }
  },
  nearestResources: {
    greenEnergy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'GreenEnergy' },
      distance: { type: Number }, // in km
      name: { type: String }
    },
    waterBody: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'WaterBody' },
      distance: { type: Number }, // in km
      name: { type: String }
    },
    industry: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry' },
      distance: { type: Number }, // in km
      name: { type: String }
    },
    transportation: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transportation' },
      distance: { type: Number }, // in km
      name: { type: String }
    }
  },
  estimatedCosts: {
    landAcquisition: { type: Number }, // in crores INR
    infrastructure: { type: Number }, // in crores INR
    connectivity: { type: Number } // in crores INR
  },
  isGoldenLocation: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

OptimalSiteSchema.index({ location: '2dsphere' });
OptimalSiteSchema.index({ overallScore: -1 });
OptimalSiteSchema.index({ district: 1 });

module.exports = mongoose.model('OptimalSite', OptimalSiteSchema);
