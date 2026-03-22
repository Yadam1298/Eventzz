const Portfolio = require('../models/Portfolio');
const Event = require('../models/Event');
const cloudinary = require('../config/cloudinary');

// ADMIN: Create Portfolio from Completed Event
exports.createPortfolio = async (req, res) => {
  const { eventId, title, description, images } = req.body;

  // 1. Check event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // 2. Ensure event is completed
  if (event.status !== 'Completed') {
    return res.status(400).json({
      message: 'Portfolio can only be created for completed events',
    });
  }

  // 3. Prevent duplicate portfolio
  const existing = await Portfolio.findOne({ event: eventId });
  if (existing) {
    return res.status(400).json({
      message: 'Portfolio already exists for this event',
    });
  }

  // 4. Upload Base64 Images to Cloudinary
  const uploadedImages = [];

  for (let base64 of images) {
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'event-management/portfolio',
    });

    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
  }

  // 5. Create portfolio
  const portfolio = await Portfolio.create({
    event: eventId,
    title,
    description,
    images: uploadedImages,
  });

  // 6. Update event
  event.isPortfolioAdded = true;
  await event.save();

  res.status(201).json({
    success: true,
    message: 'Portfolio created successfully',
    portfolio,
  });
};
