const siteAnalysisService = require('../services/siteAnalysisService');

class AnalysisController {
  /**
   * Get analysis statistics for the application
   */
  async getAnalysisStats(req, res) {
    try {
      const { region } = req.query;
      
      // This would be implemented based on your specific analytics needs
      const stats = {
        totalRegionsAnalyzed: 5, // Mock data
        totalSitesEvaluated: 1500,
        averageScore: 67.5,
        goldenLocationsFound: 125,
        lastAnalysisDate: new Date().toISOString()
      };

      if (region) {
        // Add region-specific stats
        stats.regionStats = {
          region,
          sitesEvaluated: 300,
          averageScore: 72.1,
          goldenLocations: 25
        };
      }

      res.status(200).json({
        message: 'Analysis statistics retrieved successfully',
        stats
      });
    } catch (error) {
      console.error('Error in getAnalysisStats:', error);
      res.status(500).json({ 
        message: 'Failed to retrieve analysis statistics', 
        error: error.message 
      });
    }
  }

  /**
   * Compare multiple sites
   */
  async compareSites(req, res) {
    try {
      const { siteIds } = req.body;

      if (!siteIds || !Array.isArray(siteIds) || siteIds.length < 2) {
        return res.status(400).json({ 
          message: 'At least 2 site IDs are required for comparison' 
        });
      }

      if (siteIds.length > 5) {
        return res.status(400).json({ 
          message: 'Maximum 5 sites can be compared at once' 
        });
      }

      const siteAnalyses = await Promise.all(
        siteIds.map(id => siteAnalysisService.getSiteAnalysis(id))
      );

      const comparison = {
        sites: siteAnalyses,
        insights: this.generateComparisonInsights(siteAnalyses)
      };

      res.status(200).json({
        message: 'Site comparison completed successfully',
        comparison
      });
    } catch (error) {
      console.error('Error in compareSites:', error);
      res.status(500).json({ 
        message: 'Failed to compare sites', 
        error: error.message 
      });
    }
  }

  /**
   * Generate insights for site comparison
   */
  generateComparisonInsights(siteAnalyses) {
    const sites = siteAnalyses.map(analysis => analysis.site);
    
    // Find best and worst performing sites in each category
    const insights = {
      bestOverall: sites.reduce((best, current) => 
        current.overallScore > best.overallScore ? current : best
      ),
      bestGreenEnergy: sites.reduce((best, current) => 
        current.scores.greenEnergyScore > best.scores.greenEnergyScore ? current : best
      ),
      bestWaterAccess: sites.reduce((best, current) => 
        current.scores.waterAccessScore > best.scores.waterAccessScore ? current : best
      ),
      bestIndustryProximity: sites.reduce((best, current) => 
        current.scores.industryProximityScore > best.scores.industryProximityScore ? current : best
      ),
      bestTransportation: sites.reduce((best, current) => 
        current.scores.transportationScore > best.scores.transportationScore ? current : best
      ),
      lowestCost: sites.reduce((lowest, current) => {
        const currentTotal = current.estimatedCosts.landAcquisition + 
                           current.estimatedCosts.infrastructure + 
                           current.estimatedCosts.connectivity;
        const lowestTotal = lowest.estimatedCosts.landAcquisition + 
                          lowest.estimatedCosts.infrastructure + 
                          lowest.estimatedCosts.connectivity;
        return currentTotal < lowestTotal ? current : lowest;
      })
    };

    return insights;
  }

  /**
   * Get regional analysis trends
   */
  async getRegionalTrends(req, res) {
    try {
      // This would typically involve aggregating data from the database
      const trends = {
        topRegions: [
          { region: 'Ahmedabad', averageScore: 74.2, sitesAnalyzed: 450 },
          { region: 'Surat', averageScore: 71.8, sitesAnalyzed: 380 },
          { region: 'Vadodara', averageScore: 69.5, sitesAnalyzed: 320 },
          { region: 'Rajkot', averageScore: 66.3, sitesAnalyzed: 280 },
          { region: 'Gandhinagar', averageScore: 72.1, sitesAnalyzed: 200 }
        ],
        trends: {
          greenEnergyAvailability: 'Increasing',
          waterResourceStress: 'Moderate',
          industrialDemand: 'High',
          infrastructureDevelopment: 'Rapid'
        }
      };

      res.status(200).json({
        message: 'Regional trends retrieved successfully',
        trends
      });
    } catch (error) {
      console.error('Error in getRegionalTrends:', error);
      res.status(500).json({ 
        message: 'Failed to retrieve regional trends', 
        error: error.message 
      });
    }
  }
}

module.exports = new AnalysisController();
