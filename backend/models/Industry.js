const mongoose = require('mongoose');

const IndustrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['chemical', 'steel', 'refinery', 'fertilizer', 'glass', 'cement', 'automotive', 'textile'],
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
  hydrogenDemand: {
    type: Number, // in tons per day
    required: true
  },
  currentHydrogenSource: {
    type: String,
    enum: ['steam-reforming', 'electrolysis', 'none', 'mixed'],
    default: 'steam-reforming'
  },
  district: {
    type: String,
    required: true
  },
  employeeCount: {
    type: Number,
    required: true
  },
  annualRevenue: {
    type: Number, // in crores INR
    required: true
  },
  sustainabilityRating: {
    type: Number, // 1-10 scale for environmental compliance
    min: 1,
    max: 10,
    default: 5
  }
}, {
  timestamps: true
});

IndustrySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Industry', IndustrySchema);
