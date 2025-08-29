const GreenEnergy = require('../models/GreenEnergy');
const WaterBody = require('../models/WaterBody');
const Industry = require('../models/Industry');
const Transportation = require('../models/Transportation');

class ResourcesController {
  /**
   * Get all green energy sources in a region
   */
  async getGreenEnergy(req, res) {
    try {
      const { region, type, limit = 100 } = req.query;
      
      let query = {};
      if (region) {
        query.district = { $regex: region, $options: 'i' };
      }
      if (type) {
        query.type = type;
      }

      const greenEnergy = await GreenEnergy.find(query)
        .limit(parseInt(limit))
        .sort({ capacity: -1 });

      res.status(200).json({
        message: 'Green energy sources retrieved successfully',
        count: greenEnergy.length,
        data: greenEnergy
      });
    } catch (error) {
      console.error('Error in getGreenEnergy:', error);
      res.status(500).json({ 
        message: 'Failed to retrieve green energy sources', 
        error: error.message 
      });
    }
  }

  /**
   * Get all water bodies in a region
   */
  async getWaterBodies(req, res) {
    try {
      const { region, type, limit = 100 } = req.query;
      
      let query = {};
      if (region) {
        query.district = { $regex: region, $options: 'i' };
      }
      if (type) {
        query.type = type;
      }

      const waterBodies = await WaterBody.find(query)
        .limit(parseInt(limit))
        .sort({ capacity: -1 });

      res.status(200).json({
        message: 'Water bodies retrieved successfully',
        count: waterBodies.length,
        data: waterBodies
      });
    } catch (error) {
      console.error('Error in getWaterBodies:', error);
      res.status(500).json({ 
        message: 'Failed to retrieve water bodies', 
        error: error.message 
      });
    }
  }

  /**
   * Get all industries in a region
   */
  async getIndustries(req, res) {
    try {
      const { region, type, limit = 100 } = req.query;
      
      let query = {};
      if (region) {
        query.district = { $regex: region, $options: 'i' };
      }
      if (type) {
        query.type = type;
      }

      const industries = await Industry.find(query)
        .limit(parseInt(limit))
        .sort({ hydrogenDemand: -1 });

      res.status(200).json({
        message: 'Industries retrieved successfully',
        count: industries.length,
        data: industries
      });
    } catch (error) {
      console.error('Error in getIndustries:', error);
      res.status(500).json({ 
        message: 'Failed to retrieve industries', 
        error: error.message 
      });
    }
  }

  /**
   * Get all transportation infrastructure in a region
   */
  async getTransportation(req, res) {
    try {
      const { region, type, limit = 100 } = req.query;
      
      let query = {};
      if (region) {
        query.district = { $regex: region, $options: 'i' };
      }
      if (type) {
        query.type = type;
      }

      const transportation = await Transportation.find(query)
        .limit(parseInt(limit))
        .sort({ connectivity: 1 });

      res.status(200).json({
        message: 'Transportation infrastructure retrieved successfully',
        count: transportation.length,
        data: transportation
      });
    } catch (error) {
      console.error('Error in getTransportation:', error);
      res.status(500).json({ 
        message: 'Failed to retrieve transportation infrastructure', 
        error: error.message 
      });
    }
  }

  /**
   * Get resources summary for a region
   */
  async getResourcesSummary(req, res) {
    try {
      const { region } = req.params;
      
      if (!region) {
        return res.status(400).json({ message: 'Region parameter is required' });
      }

      const regionQuery = { district: { $regex: region, $options: 'i' } };

      const [
        greenEnergyCount,
        totalGreenCapacity,
        waterBodiesCount,
        industriesCount,
        totalHydrogenDemand,
        transportationCount
      ] = await Promise.all([
        GreenEnergy.countDocuments(regionQuery),
        GreenEnergy.aggregate([
          { $match: regionQuery },
          { $group: { _id: null, total: { $sum: '$capacity' } } }
        ]),
        WaterBody.countDocuments(regionQuery),
        Industry.countDocuments(regionQuery),
        Industry.aggregate([
          { $match: regionQuery },
          { $group: { _id: null, total: { $sum: '$hydrogenDemand' } } }
        ]),
        Transportation.countDocuments(regionQuery)
      ]);

      res.status(200).json({
        message: 'Resources summary retrieved successfully',
        region,
        summary: {
          greenEnergy: {
            count: greenEnergyCount,
            totalCapacity: totalGreenCapacity[0]?.total || 0,
            unit: 'MW'
          },
          waterBodies: {
            count: waterBodiesCount
          },
          industries: {
            count: industriesCount,
            totalHydrogenDemand: totalHydrogenDemand[0]?.total || 0,
            unit: 'tons/day'
          },
          transportation: {
            count: transportationCount
          }
        }
      });
    } catch (error) {
      console.error('Error in getResourcesSummary:', error);
      res.status(500).json({ 
        message: 'Failed to retrieve resources summary', 
        error: error.message 
      });
    }
  }

  /**
   * Get resources within a radius of coordinates
   */
  async getResourcesNearby(req, res) {
    try {
      const { longitude, latitude, radius = 10, resourceType } = req.query;

      if (!longitude || !latitude) {
        return res.status(400).json({ 
          message: 'Longitude and latitude parameters are required' 
        });
      }

      const geoQuery = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
          }
        }
      };

      let resources = {};

      if (!resourceType || resourceType === 'green-energy') {
        resources.greenEnergy = await GreenEnergy.find(geoQuery);
      }
      
      if (!resourceType || resourceType === 'water-bodies') {
        resources.waterBodies = await WaterBody.find(geoQuery);
      }
      
      if (!resourceType || resourceType === 'industries') {
        resources.industries = await Industry.find(geoQuery);
      }
      
      if (!resourceType || resourceType === 'transportation') {
        resources.transportation = await Transportation.find(geoQuery);
      }

      res.status(200).json({
        message: 'Nearby resources retrieved successfully',
        center: { longitude: parseFloat(longitude), latitude: parseFloat(latitude) },
        radius: parseFloat(radius),
        resources
      });
    } catch (error) {
      console.error('Error in getResourcesNearby:', error);
      res.status(500).json({ 
        message: 'Failed to retrieve nearby resources', 
        error: error.message 
      });
    }
  }
}

module.exports = new ResourcesController();
