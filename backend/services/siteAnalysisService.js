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
    try {
      // Validate site coordinates
      if (!Array.isArray(site.coordinates) || site.coordinates.length !== 2) {
        throw new Error('Invalid site coordinates');
      }
      
      const [lng, lat] = site.coordinates;
      if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
        throw new Error('Site coordinates must be valid numbers');
      }

      const point = turf.point([lng, lat]);
      
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
    } catch (error) {
      console.error('Error calculating site score:', error);
      throw error;
    }
  }

  /**
   * Find the nearest resource to a given point
   */
  findNearestResource(point, resources) {
    let nearest = { distance: Infinity, resource: null };
    
    for (const resource of resources) {
      try {
        // Validate resource coordinates
        if (!resource.location || !resource.location.coordinates || 
            !Array.isArray(resource.location.coordinates) || 
            resource.location.coordinates.length !== 2) {
          console.warn(`Invalid coordinates for resource ${resource._id}:`, resource.location);
          continue;
        }

        const [lng, lat] = resource.location.coordinates;
        if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
          console.warn(`Invalid coordinate values for resource ${resource._id}:`, [lng, lat]);
          continue;
        }

        const resourcePoint = turf.point([lng, lat]);
        const distance = turf.distance(point, resourcePoint, { units: 'kilometers' });
        
        if (distance < nearest.distance) {
          nearest = {
            distance: Math.round(distance * 100) / 100,
            resource: resource,
            id: resource._id,
            name: resource.name
          };
        }
      } catch (error) {
        console.warn(`Error processing resource ${resource._id}:`, error.message);
        continue;
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
    let topSites = scoredSites.slice(0, topSitesCount);
    
    // Filter sites to ensure minimum distance between them (avoid clustering)
    const minDistance = 2; // km minimum distance between sites
    const filteredSites = [];
    
    for (const site of topSites) {
      const isTooClose = filteredSites.some(existingSite => {
        const distance = this.calculateDistance(
          site.coordinates,
          existingSite.coordinates
        );
        return distance < minDistance;
      });
      
      if (!isTooClose) {
        filteredSites.push(site);
      }
      
      // Limit to maximum 15 sites to avoid overcrowding
      if (filteredSites.length >= 15) break;
    }
    
    // Mark top 50% as golden locations
    const goldenLocationCount = Math.max(3, Math.floor(filteredSites.length * 0.5));
    
    return filteredSites.map((site, index) => ({
      ...site,
      isGoldenLocation: index < goldenLocationCount,
      estimatedCosts: this.calculateEstimatedCosts(site)
    }));
  }

  /**
   * Calculate distance between two coordinate points
   */
  calculateDistance(coord1, coord2) {
    const [lng1, lat1] = coord1;
    const [lng2, lat2] = coord2;
    
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
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
    try {
      // Clear existing sites for this region
      await OptimalSite.deleteMany({ region: region });
      
      // Validate and prepare sites for database insertion
      const sitesToSave = optimalSites
        .filter(site => {
          // Validate site data
          return site && 
                 site.location && 
                 site.location.coordinates && 
                 Array.isArray(site.location.coordinates) && 
                 site.location.coordinates.length === 2 &&
                 typeof site.location.coordinates[0] === 'number' &&
                 typeof site.location.coordinates[1] === 'number' &&
                 !isNaN(site.location.coordinates[0]) &&
                 !isNaN(site.location.coordinates[1]) &&
                 site.overallScore &&
                 typeof site.overallScore === 'number' &&
                 !isNaN(site.overallScore);
        })
        .map((site, index) => {
          const district = this.getDistrictFromCoordinates(site.coordinates || site.location.coordinates, region);
          
          return {
            location: site.location,
            district: district,
            region: region,
            overallScore: site.overallScore,
            scores: site.scores || {
              greenEnergyScore: 0,
              waterAccessScore: 0,
              industryProximityScore: 0,
              transportationScore: 0
            },
            nearestResources: site.nearestResources || {},
            estimatedCosts: site.estimatedCosts || {
              landAcquisition: 50,
              infrastructure: 120,
              connectivity: 30
            },
            isGoldenLocation: site.isGoldenLocation || false
          };
        });
      
      if (sitesToSave.length > 0) {
        await OptimalSite.insertMany(sitesToSave);
        console.log(`✅ Saved ${sitesToSave.length} valid optimal sites for ${region}`);
      } else {
        console.warn(`⚠️  No valid sites to save for region: ${region}`);
      }
      
      return sitesToSave.length;
    } catch (error) {
      console.error('Error saving optimal sites:', error);
      throw error;
    }
  }

  /**
   * Get district name based on coordinates
   */
  getDistrictFromCoordinates(coordinates, fallbackRegion) {
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return fallbackRegion || 'Unknown District';
    }
    
    const [lng, lat] = coordinates;
    
    // Validate coordinates
    if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
      return fallbackRegion || 'Unknown District';
    }
    
    // Define district boundaries for Gujarat (approximate)
    const districtBounds = {
      'Ahmedabad': { minLat: 22.9, maxLat: 23.5, minLng: 72.4, maxLng: 73.0 },
      'Surat': { minLat: 20.8, maxLat: 21.4, minLng: 72.6, maxLng: 73.2 },
      'Vadodara': { minLat: 22.2, maxLat: 22.8, minLng: 73.0, maxLng: 73.6 },
      'Rajkot': { minLat: 22.1, maxLat: 22.7, minLng: 70.6, maxLng: 71.2 },
      'Gandhinagar': { minLat: 23.1, maxLat: 23.5, minLng: 72.5, maxLng: 72.9 }
    };

    for (const [district, bounds] of Object.entries(districtBounds)) {
      if (lat >= bounds.minLat && lat <= bounds.maxLat && 
          lng >= bounds.minLng && lng <= bounds.maxLng) {
        return district;
      }
    }
    
    // Better fallback based on general Gujarat geography
    if (lat >= 20.0 && lat <= 25.0 && lng >= 68.0 && lng <= 75.0) {
      // Determine closest major district
      const distances = {
        'Ahmedabad': Math.sqrt((lat - 23.0225) ** 2 + (lng - 72.5714) ** 2),
        'Surat': Math.sqrt((lat - 21.1702) ** 2 + (lng - 72.8311) ** 2),
        'Vadodara': Math.sqrt((lat - 22.3072) ** 2 + (lng - 73.2080) ** 2),
        'Rajkot': Math.sqrt((lat - 22.3039) ** 2 + (lng - 70.8022) ** 2),
        'Gandhinagar': Math.sqrt((lat - 23.2156) ** 2 + (lng - 72.6369) ** 2)
      };
      
      const closestDistrict = Object.keys(distances).reduce((a, b) => 
        distances[a] < distances[b] ? a : b
      );
      
      return `${closestDistrict} Region`;
    }
    
    // Final fallback for coordinates outside Gujarat
    return fallbackRegion ? `${fallbackRegion} District` : 'Gujarat Region';
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
