const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resourcesController');

// GET /api/resources/green-energy - Get green energy sources
router.get('/green-energy', resourcesController.getGreenEnergy);

// GET /api/resources/water-bodies - Get water bodies
router.get('/water-bodies', resourcesController.getWaterBodies);

// GET /api/resources/industries - Get industries
router.get('/industries', resourcesController.getIndustries);

// GET /api/resources/transportation - Get transportation infrastructure
router.get('/transportation', resourcesController.getTransportation);

// GET /api/resources/summary/:region - Get resources summary for a region
router.get('/summary/:region', resourcesController.getResourcesSummary);

// GET /api/resources/nearby - Get resources within radius
router.get('/nearby', resourcesController.getResourcesNearby);

module.exports = router;
