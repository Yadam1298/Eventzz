const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      unique: true,
    },

    title: String,
    description: String,

    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
