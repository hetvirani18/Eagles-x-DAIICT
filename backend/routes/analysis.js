const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// GET /api/analysis/stats - Get analysis statistics
router.get('/stats', analysisController.getAnalysisStats);

// POST /api/analysis/compare - Compare multiple sites
router.post('/compare', analysisController.compareSites);

// GET /api/analysis/trends - Get regional analysis trends
router.get('/trends', analysisController.getRegionalTrends);

module.exports = router;
