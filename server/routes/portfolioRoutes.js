const express = require('express');
const router = express.Router();

const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const { createPortfolio } = require('../controllers/portfolioController');

// ADMIN ONLY
router.post('/', protect, authorize('admin'), createPortfolio);

module.exports = router;
