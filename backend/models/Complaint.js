const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to the user who created it
    required: true,
  },
  block_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block', // Links to the block it's for
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  is_completed: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  assigned_at: {
    type: Date,
  },
});

module.exports = mongoose.model('Complaint', ComplaintSchema);