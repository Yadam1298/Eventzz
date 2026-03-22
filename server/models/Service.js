const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Food',
        'Decoration',
        'Photography',
        'Transportation',
        'Entertainment',
        'Security',
        'Venue',
        'Invitation',
      ],
      required: true,
    },
    description: String,
    priceRange: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Service', serviceSchema);
