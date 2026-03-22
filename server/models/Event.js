const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Initial submission
    eventType: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
    },

    // Admin added details
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
    },

    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],

    venueDetails: {
      name: String,
      address: String,
    },

    additionalNotes: String,

    status: {
      type: String,
      enum: ['Pending', 'In Planning', 'Confirmed', 'Completed'],
      default: 'Pending',
      index: true,
    },

    isPortfolioAdded: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false, // soft delete
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Event', eventSchema);
