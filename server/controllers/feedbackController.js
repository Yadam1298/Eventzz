const Feedback = require('../models/Feedback');
const Event = require('../models/Event');

// USER: Give Feedback
exports.createFeedback = async (req, res) => {
  const { eventId, rating, comment } = req.body;

  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Must be event owner
  if (event.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: 'You are not allowed to give feedback for this event',
    });
  }

  // Event must be completed
  if (event.status !== 'Completed') {
    return res.status(400).json({
      message: 'Feedback allowed only after event completion',
    });
  }

  // Prevent duplicate feedback
  const existing = await Feedback.findOne({ event: eventId });
  if (existing) {
    return res.status(400).json({
      message: 'Feedback already submitted',
    });
  }

  const feedback = await Feedback.create({
    event: eventId,
    user: req.user._id,
    rating,
    comment,
  });

  res.status(201).json({
    success: true,
    message: 'Feedback submitted',
    feedback,
  });
};
