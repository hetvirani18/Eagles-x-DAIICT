const siteAnalysisService = require('../services/siteAnalysisService');
const OptimalSite = require('../models/OptimalSite');
const Joi = require('joi');

class SitesController {
  /**
   * Analyze and find optimal sites for a given region
   */
  async analyzeRegion(req, res) {
    try {
      const { error } = Joi.object({
        region: Joi.string().required().min(2).max(50),
        gridResolution: Joi.number().min(0.001).max(0.1).default(0.01)
      }).validate(req.body);

      if (error) {
        return res.status(400).json({ 
          message: 'Validation error', 
          details: error.details[0].message 
        });
      }

      const { region, gridResolution } = req.body;

      console.log(`Starting analysis for region: ${region}`);
      
      const optimalSites = await siteAnalysisService.findOptimalSites(region, gridResolution);
      
      res.status(200).json({
        message: 'Analysis completed successfully',
        region,
        totalSites: optimalSites.length,
        goldenLocations: optimalSites.filter(site => site.isGoldenLocation).length,
        sites: optimalSites
      });
    } catch (error) {
      console.error('Error in analyzeRegion:', error);
      res.status(500).json({ 
        message: 'Failed to analyze region', 
        error: error.message 
      });
    }
  }

  /**
   * Get optimal sites for a region (from database)
   */
  async getOptimalSites(req, res) {
    try {
      const { region } = req.params;
      const { limit = 50, goldenOnly = false } = req.query;

      console.log(`Getting optimal sites for region: ${region}`);

      let query = {};
      
      // If region is not 'all', filter by region
      if (region && region !== 'all') {
        query.region = { $regex: region, $options: 'i' };
      }
      
      if (goldenOnly === 'true') {
        query.isGoldenLocation = true;
      }

      console.log('Query:', JSON.stringify(query));

      const sites = await OptimalSite.find(query)
        .sort({ overallScore: -1 })
        .limit(parseInt(limit));

      console.log(`Found ${sites.length} sites`);

      res.status(200).json({
        message: 'Sites retrieved successfully',
        region,
        count: sites.length,
        data: sites // Change 'sites' to 'data' to match frontend expectations
      });
    } catch (error) {
      console.error('Error in getOptimalSites:', error);
      res.status(500).json({ 
        message: 'Failed to retrieve sites', 
        error: error.message 
      });
    }
  }

  /**
   * Get detailed analysis for a specific site
   */
  async getSiteDetails(req, res) {
    try {
      const { siteId } = req.params;

      if (!siteId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid site ID format' });
      }

      const siteAnalysis = await siteAnalysisService.getSiteAnalysis(siteId);
      
      res.status(200).json({
        message: 'Site analysis retrieved successfully',
        ...siteAnalysis
      });
    } catch (error) {
      console.error('Error in getSiteDetails:', error);
      if (error.message === 'Site not found') {
        return res.status(404).json({ message: 'Site not found' });
      }
      res.status(500).json({ 
        message: 'Failed to retrieve site details', 
        error: error.message 
      });
    }
  }

  /**
   * Get sites within a specific radius of coordinates
   */
  async getSitesNearby(req, res) {
    try {
      const { error } = Joi.object({
        longitude: Joi.number().required().min(-180).max(180),
        latitude: Joi.number().required().min(-90).max(90),
        radius: Joi.number().min(1).max(100).default(10) // km
      }).validate(req.query);

      if (error) {
        return res.status(400).json({ 
          message: 'Validation error', 
          details: error.details[0].message 
        });
      }

      const { longitude, latitude, radius } = req.query;

      const sites = await OptimalSite.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
          }
        }
      }).sort({ overallScore: -1 });

      res.status(200).json({
        message: 'Nearby sites retrieved successfully',
        center: { longitude: parseFloat(longitude), latitude: parseFloat(latitude) },
        radius: parseFloat(radius),
        count: sites.length,
        sites
      });
    } catch (error) {
      console.error('Error in getSitesNearby:', error);
      res.status(500).json({ 
        message: 'Failed to retrieve nearby sites', 
        error: error.message 
      });
    }
  }

  /**
   * Export site data in various formats
   */
  async exportSites(req, res) {
    try {
      const { region, format = 'json' } = req.query;

      if (!region) {
        return res.status(400).json({ message: 'Region parameter is required' });
      }

      const sites = await OptimalSite.find({ 
        region: { $regex: region, $options: 'i' } 
      }).sort({ overallScore: -1 });

      if (format === 'csv') {
        const csvData = this.convertToCSV(sites);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${region}_hydrogen_sites.csv"`);
        return res.send(csvData);
      }

      if (format === 'geojson') {
        const geoJson = this.convertToGeoJSON(sites);
        res.setHeader('Content-Type', 'application/geo+json');
        res.setHeader('Content-Disposition', `attachment; filename="${region}_hydrogen_sites.geojson"`);
        return res.json(geoJson);
      }

      // Default JSON format
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${region}_hydrogen_sites.json"`);
      res.json({
        exportDate: new Date().toISOString(),
        region,
        totalSites: sites.length,
        sites
      });
    } catch (error) {
      console.error('Error in exportSites:', error);
      res.status(500).json({ 
        message: 'Failed to export sites', 
        error: error.message 
      });
    }
  }

  /**
   * Convert sites data to CSV format
   */
  convertToCSV(sites) {
    const headers = [
      'Site ID', 'Longitude', 'Latitude', 'District', 'Overall Score',
      'Green Energy Score', 'Water Access Score', 'Industry Proximity Score', 'Transportation Score',
      'Is Golden Location', 'Nearest Green Energy', 'Nearest Water Body', 'Nearest Industry',
      'Land Cost (Cr)', 'Infrastructure Cost (Cr)', 'Connectivity Cost (Cr)'
    ];

    const rows = sites.map(site => [
      site._id,
      site.location.coordinates[0],
      site.location.coordinates[1],
      site.district,
      site.overallScore,
      site.scores.greenEnergyScore,
      site.scores.waterAccessScore,
      site.scores.industryProximityScore,
      site.scores.transportationScore,
      site.isGoldenLocation,
      `${site.nearestResources.greenEnergy.name} (${site.nearestResources.greenEnergy.distance}km)`,
      `${site.nearestResources.waterBody.name} (${site.nearestResources.waterBody.distance}km)`,
      `${site.nearestResources.industry.name} (${site.nearestResources.industry.distance}km)`,
      site.estimatedCosts.landAcquisition,
      site.estimatedCosts.infrastructure,
      site.estimatedCosts.connectivity
    ]);

    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }

  /**
   * Convert sites data to GeoJSON format
   */
  convertToGeoJSON(sites) {
    return {
      type: 'FeatureCollection',
      features: sites.map(site => ({
        type: 'Feature',
        geometry: site.location,
        properties: {
          id: site._id,
          district: site.district,
          overallScore: site.overallScore,
          scores: site.scores,
          isGoldenLocation: site.isGoldenLocation,
          nearestResources: site.nearestResources,
          estimatedCosts: site.estimatedCosts,
          createdAt: site.createdAt
        }
      }))
    };
  }
}

module.exports = new SitesController();
