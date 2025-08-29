const mongoose = require('mongoose');

const TransportationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['highway', 'state-highway', 'railway', 'port', 'airport'],
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point', 'LineString'],
      required: true
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed, // Point: [lng, lat], LineString: [[lng, lat], ...]
      required: true
    }
  },
  connectivity: {
    type: String,
    enum: ['national', 'state', 'district', 'local'],
    required: true
  },
  trafficDensity: {
    type: String,
    enum: ['low', 'medium', 'high', 'very-high'],
    default: 'medium'
  },
  district: {
    type: String,
    required: true
  },
  roadCondition: {
    type: String,
    enum: ['excellent', 'good', 'average', 'poor'],
    default: 'good'
  }
}, {
  timestamps: true
});

TransportationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Transportation', TransportationSchema);
