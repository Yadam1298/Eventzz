const express = require('express');
const router = express.Router();

const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const { createFeedback } = require('../controllers/feedbackController');

// USER ONLY
router.post('/', protect, authorize('user'), createFeedback);

module.exports = router;
