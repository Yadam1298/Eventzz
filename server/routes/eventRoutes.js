const express = require('express');
const router = express.Router();

// ✅ Fix: Import middleware correctly
const protect = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

// Import controllers
const {
  createEvent,
  getMyEvents,
  getSingleEvent,
  getAllEvents,
  updateEvent,
  updateEventStatus,
} = require('../controllers/eventController');

// Debug line - remove after confirming it works
console.log('Middleware loaded:', {
  protect: typeof protect,
  authorize: typeof authorize,
});

// USER ROUTES
router.post('/', protect, authorize('user'), createEvent);
router.get('/my-events', protect, authorize('user'), getMyEvents);
router.get('/:id', protect, getSingleEvent); // Both user and admin can access

// ADMIN ROUTES
router.get('/', protect, authorize('admin'), getAllEvents);
router.put('/:id', protect, authorize('admin'), updateEvent);
router.patch('/:id/status', protect, authorize('admin'), updateEventStatus);

module.exports = router;
