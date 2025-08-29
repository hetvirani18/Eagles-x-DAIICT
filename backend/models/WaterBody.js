const mongoose = require('mongoose');

const WaterBodySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['river', 'reservoir', 'lake', 'groundwater', 'canal'],
    required: true
  },
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
  waterQuality: {
    type: String,
    enum: ['excellent', 'good', 'moderate', 'poor'],
    default: 'good'
  },
  availabilityPercentage: {
    type: Number, // percentage of year water is available
    min: 0,
    max: 100,
    default: 100
  },
  district: {
    type: String,
    required: true
  },
  capacity: {
    type: Number, // in million liters
    required: true
  },
  accessibilityRating: {
    type: Number, // 1-10 scale
    min: 1,
    max: 10,
    default: 5
  }
}, {
  timestamps: true
});

WaterBodySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('WaterBody', WaterBodySchema);
