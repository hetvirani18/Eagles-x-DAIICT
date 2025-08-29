const turf = require('@turf/turf');
const geolib = require('geolib');
const GreenEnergy = require('../models/GreenEnergy');
const WaterBody = require('../models/WaterBody');
const Industry = require('../models/Industry');
const Transportation = require('../models/Transportation');
const OptimalSite = require('../models/OptimalSite');

class SiteAnalysisService {
  constructor() {
    // Weighting factors for the multi-criteria decision analysis
    this.weights = {
      greenEnergy: 0.30,
      waterAccess: 0.25,
      industryProximity: 0.25,
      transportation: 0.20
    };
    
    // Maximum distance thresholds (in km)
    this.maxDistances = {
      greenEnergy: 50,
      waterAccess: 20,
      industryProximity: 100,
      transportation: 10
    };
  }

  /**
   * Main algorithm to find optimal hydrogen plant locations
   * Uses Multi-Criteria Decision Analysis (MCDA) with weighted scoring
   */
  async findOptimalSites(searchRegion, gridResolution = 0.01) {
    try {
      console.log(`Analyzing optimal sites for region: ${searchRegion}`);
      
      // Step 1: Get all relevant resources in the region
      const resources = await this.getResourcesInRegion(searchRegion);
      
      if (!resources.greenEnergy.length || !resources.waterBodies.length || !resources.industries.length) {
        throw new Error('Insufficient resources found in the specified region');
      }

      // Step 2: Generate candidate sites using grid-based approach
      const candidateSites = await this.generateCandidateSites(searchRegion, gridResolution);
      
      // Step 3: Score each candidate site
      const scoredSites = await this.scoreAllSites(candidateSites, resources);
      
      // Step 4: Select top sites and mark golden locations
      const optimalSites = this.selectOptimalSites(scoredSites);
      
      // Step 5: Save to database
      await this.saveOptimalSites(optimalSites, searchRegion);
      
      return optimalSites;
    } catch (error) {
      console.error('Error in findOptimalSites:', error);
      throw error;
    }
  }

  /**
   * Get all resources within the specified region
   */
  async getResourcesInRegion(region) {
    const regionQuery = { district: { $regex: region, $options: 'i' } };
    
    const [greenEnergy, waterBodies, industries, transportation] = await Promise.all([
      GreenEnergy.find(regionQuery),
      WaterBody.find(regionQuery),
      Industry.find(regionQuery),
      Transportation.find(regionQuery)
    ]);

    return {
      greenEnergy,
      waterBodies,
      industries,
      transportation
    };
  }

  /**
   * Generate candidate sites using grid-based approach
   */
  async generateCandidateSites(region, resolution) {
    // For Gujarat's major districts, define approximate bounding boxes
    const districtBounds = {
      'ahmedabad': [72.4, 22.9, 73.0, 23.5],
      'surat': [72.6, 20.8, 73.2, 21.4],
      'vadodara': [73.0, 22.2, 73.6, 22.8],
      'rajkot': [70.6, 22.1, 71.2, 22.7],
      'gandhinagar': [72.5, 23.1, 72.9, 23.5]
    };

    const bounds = districtBounds[region.toLowerCase()] || [68.0, 20.0, 75.0, 25.0]; // Default Gujarat bounds
    const [minLng, minLat, maxLng, maxLat] = bounds;

    const candidateSites = [];
    
    for (let lng = minLng; lng <= maxLng; lng += resolution) {
      for (let lat = minLat; lat <= maxLat; lat += resolution) {
        candidateSites.push({
          coordinates: [lng, lat],
          location: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        });
      }
    }

    return candidateSites;
  }

  /**
   * Score all candidate sites using the MCDA algorithm
   */
  async scoreAllSites(candidateSites, resources) {
    const scoredSites = [];

    for (const site of candidateSites) {
      const siteScore = await this.calculateSiteScore(site, resources);
      if (siteScore.overallScore > 20) { // Only keep sites with reasonable scores
        scoredSites.push(siteScore);
      }
    }

    return scoredSites.sort((a, b) => b.overallScore - a.overallScore);
  }

  /**
   * Calculate comprehensive score for a single site
   */
  async calculateSiteScore(site, resources) {
    const point = turf.point(site.coordinates);
    
    // Find nearest resources and calculate individual scores
    const nearestGreenEnergy = this.findNearestResource(point, resources.greenEnergy);
    const nearestWaterBody = this.findNearestResource(point, resources.waterBodies);
    const nearestIndustry = this.findNearestResource(point, resources.industries);
    const nearestTransportation = this.findNearestResource(point, resources.transportation);

    // Calculate individual scores (0-100 scale)
    const greenEnergyScore = this.calculateProximityScore(
      nearestGreenEnergy.distance, 
      this.maxDistances.greenEnergy,
      nearestGreenEnergy.resource?.capacity || 0
    );
    
    const waterAccessScore = this.calculateProximityScore(
      nearestWaterBody.distance,
      this.maxDistances.waterAccess,
      nearestWaterBody.resource?.capacity || 0
    );
    
    const industryProximityScore = this.calculateProximityScore(
      nearestIndustry.distance,
      this.maxDistances.industryProximity,
      nearestIndustry.resource?.hydrogenDemand || 0
    );
    
    const transportationScore = this.calculateProximityScore(
      nearestTransportation.distance,
      this.maxDistances.transportation,
      10 // Base score for transportation
    );

    // Calculate weighted overall score
    const overallScore = (
      greenEnergyScore * this.weights.greenEnergy +
      waterAccessScore * this.weights.waterAccess +
      industryProximityScore * this.weights.industryProximity +
      transportationScore * this.weights.transportation
    );

    return {
      location: site.location,
      coordinates: site.coordinates,
      overallScore: Math.round(overallScore * 100) / 100,
      scores: {
        greenEnergyScore: Math.round(greenEnergyScore * 100) / 100,
        waterAccessScore: Math.round(waterAccessScore * 100) / 100,
        industryProximityScore: Math.round(industryProximityScore * 100) / 100,
        transportationScore: Math.round(transportationScore * 100) / 100
      },
      nearestResources: {
        greenEnergy: nearestGreenEnergy,
        waterBody: nearestWaterBody,
        industry: nearestIndustry,
        transportation: nearestTransportation
      }
    };
  }

  /**
   * Find the nearest resource to a given point
   */
  findNearestResource(point, resources) {
    let nearest = { distance: Infinity, resource: null };
    
    for (const resource of resources) {
      const resourcePoint = turf.point(resource.location.coordinates);
      const distance = turf.distance(point, resourcePoint, { units: 'kilometers' });
      
      if (distance < nearest.distance) {
        nearest = {
          distance: Math.round(distance * 100) / 100,
          resource: resource,
          id: resource._id,
          name: resource.name
        };
      }
    }
    
    return nearest;
  }

  /**
   * Calculate proximity score based on distance and resource capacity
   */
  calculateProximityScore(distance, maxDistance, capacity = 1) {
    if (distance > maxDistance) return 0;
    
    // Base proximity score (inverse of normalized distance)
    const proximityScore = (1 - (distance / maxDistance)) * 100;
    
    // Capacity bonus (logarithmic scaling to prevent extreme values)
    const capacityBonus = Math.log10(capacity + 1) * 5;
    
    return Math.min(100, proximityScore + capacityBonus);
  }

  /**
   * Select optimal sites and mark golden locations
   */
  selectOptimalSites(scoredSites) {
    // Take top 20% of sites
    const topSitesCount = Math.max(10, Math.floor(scoredSites.length * 0.2));
    const topSites = scoredSites.slice(0, topSitesCount);
    
    // Mark top 10% as golden locations
    const goldenLocationCount = Math.max(3, Math.floor(topSites.length * 0.5));
    
    return topSites.map((site, index) => ({
      ...site,
      isGoldenLocation: index < goldenLocationCount,
      estimatedCosts: this.calculateEstimatedCosts(site)
    }));
  }

  /**
   * Calculate estimated costs for site development
   */
  calculateEstimatedCosts(site) {
    // Base costs in crores INR
    const baseLandCost = 50;
    const baseInfraCost = 200;
    const baseConnectivityCost = 100;
    
    // Cost modifiers based on proximity to resources
    const avgDistance = (
      site.nearestResources.greenEnergy.distance +
      site.nearestResources.waterBody.distance +
      site.nearestResources.industry.distance +
      site.nearestResources.transportation.distance
    ) / 4;
    
    const distanceMultiplier = 1 + (avgDistance / 50); // Increase costs with distance
    
    return {
      landAcquisition: Math.round(baseLandCost * distanceMultiplier),
      infrastructure: Math.round(baseInfraCost * distanceMultiplier),
      connectivity: Math.round(baseConnectivityCost * distanceMultiplier)
    };
  }

  /**
   * Save optimal sites to database
   */
  async saveOptimalSites(optimalSites, region) {
    // Clear existing sites for this region
    await OptimalSite.deleteMany({ region: region });
    
    // Prepare sites for database insertion
    const sitesToSave = optimalSites.map(site => ({
      location: site.location,
      district: region,
      region: region,
      overallScore: site.overallScore,
      scores: site.scores,
      nearestResources: site.nearestResources,
      estimatedCosts: site.estimatedCosts,
      isGoldenLocation: site.isGoldenLocation
    }));
    
    await OptimalSite.insertMany(sitesToSave);
    console.log(`Saved ${sitesToSave.length} optimal sites for ${region}`);
  }

  /**
   * Get detailed analysis for a specific site
   */
  async getSiteAnalysis(siteId) {
    const site = await OptimalSite.findById(siteId)
      .populate('nearestResources.greenEnergy.id')
      .populate('nearestResources.waterBody.id')
      .populate('nearestResources.industry.id')
      .populate('nearestResources.transportation.id');
    
    if (!site) {
      throw new Error('Site not found');
    }
    
    return {
      site,
      detailedAnalysis: {
        strengths: this.identifyStrengths(site),
        challenges: this.identifyChallenges(site),
        recommendations: this.generateRecommendations(site)
      }
    };
  }

  /**
   * Identify site strengths based on scores
   */
  identifyStrengths(site) {
    const strengths = [];
    
    if (site.scores.greenEnergyScore > 70) {
      strengths.push('Excellent proximity to renewable energy sources');
    }
    if (site.scores.waterAccessScore > 70) {
      strengths.push('Strong water resource availability');
    }
    if (site.scores.industryProximityScore > 70) {
      strengths.push('Close to major hydrogen consumers');
    }
    if (site.scores.transportationScore > 70) {
      strengths.push('Excellent transportation connectivity');
    }
    
    return strengths;
  }

  /**
   * Identify potential challenges
   */
  identifyChallenges(site) {
    const challenges = [];
    
    if (site.scores.greenEnergyScore < 40) {
      challenges.push('Limited renewable energy access - may require grid connection');
    }
    if (site.scores.waterAccessScore < 40) {
      challenges.push('Water scarcity concerns - alternative sources needed');
    }
    if (site.scores.industryProximityScore < 40) {
      challenges.push('Distant from major consumers - higher distribution costs');
    }
    if (site.scores.transportationScore < 40) {
      challenges.push('Poor road connectivity - infrastructure development needed');
    }
    
    return challenges;
  }

  /**
   * Generate recommendations for site development
   */
  generateRecommendations(site) {
    const recommendations = [];
    
    if (site.isGoldenLocation) {
      recommendations.push('Priority site for development - all key factors favorable');
    }
    
    recommendations.push('Conduct detailed environmental impact assessment');
    recommendations.push('Negotiate long-term power purchase agreements');
    recommendations.push('Secure water usage permissions from local authorities');
    
    if (site.scores.transportationScore < 60) {
      recommendations.push('Consider road infrastructure improvements');
    }
    
    return recommendations;
  }
}

module.exports = new SiteAnalysisService();
