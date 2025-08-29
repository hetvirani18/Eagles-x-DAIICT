const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/sitesController');

// POST /api/sites/analyze - Analyze a region for optimal sites
router.post('/analyze', sitesController.analyzeRegion);

// GET /api/sites/:region - Get optimal sites for a region
router.get('/:region', sitesController.getOptimalSites);

// GET /api/sites/details/:siteId - Get detailed analysis for a specific site
router.get('/details/:siteId', sitesController.getSiteDetails);

// GET /api/sites/nearby - Get sites within radius of coordinates
router.get('/nearby', sitesController.getSitesNearby);

// GET /api/sites/export - Export site data
router.get('/export', sitesController.exportSites);

module.exports = router;
