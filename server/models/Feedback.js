const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    comment: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model('Feedback', feedbackSchema);
