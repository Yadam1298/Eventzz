// ADMIN: Get All Events
exports.getAllEvents = async (req, res) => {
  const events = await Event.find({ isDeleted: false })
    .populate('user', '-password')
    .populate('package')
    .populate('services')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: events.length,
    events,
  });
};

// ADMIN: Update Event Details
exports.updateEvent = async (req, res) => {
  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updatedEvent) {
    return res.status(404).json({ message: 'Event not found' });
  }

  res.json({
    success: true,
    message: 'Event updated successfully',
    event: updatedEvent,
  });
};

// ADMIN: Update Status Only
exports.updateEventStatus = async (req, res) => {
  const { status } = req.body;

  const allowedStatus = ['Pending', 'In Planning', 'Confirmed', 'Completed'];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );

  res.json({
    success: true,
    message: 'Status updated',
    event,
  });
};
