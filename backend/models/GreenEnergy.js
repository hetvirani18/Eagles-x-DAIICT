const mongoose = require('mongoose');

const GreenEnergySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['solar', 'wind', 'hybrid'],
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
  capacity: {
    type: Number, // in MW
    required: true
  },
  operationalStatus: {
    type: String,
    enum: ['operational', 'under-construction', 'planned'],
    default: 'operational'
  },
  district: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  operator: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
GreenEnergySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('GreenEnergy', GreenEnergySchema);
