const Event = require('../models/Event');

// USER: Create Event
exports.createEvent = async (req, res) => {
  const { eventType, eventDate, guestCount } = req.body;

  const event = await Event.create({
    user: req.user._id,
    eventType,
    eventDate,
    guestCount,
  });

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    event,
  });
};

// USER: Get My Events
exports.getMyEvents = async (req, res) => {
  const events = await Event.find({
    user: req.user._id,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: events.length,
    events,
  });
};

// USER: Get Single Event (Tracking)
exports.getSingleEvent = async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('package')
    .populate('services')
    .populate('user', '-password');

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  res.json({
    success: true,
    event,
  });
};

// ADMIN: Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isDeleted: false })
      .populate('user', 'name email phone')
      .populate('package')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Update Event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const event = await Event.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true },
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Update Event Status
exports.updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'in-planning', 'confirmed', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check valid transitions
    const validTransitions = {
      pending: ['in-planning'],
      'in-planning': ['confirmed', 'pending'],
      confirmed: ['completed', 'in-planning'],
      completed: [],
    };

    if (!validTransitions[event.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from ${event.status} to ${status}`,
      });
    }

    event.status = status;
    event.updatedAt = Date.now();
    await event.save();

    res.json({
      success: true,
      message: `Event status updated to ${status}`,
      event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
