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
  category: {
    type: String,
    enum: ['Electric', 'Water', 'Carpentry', 'Other'],
    required: true,
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This will link to the Worker
    default: null,
  },
  // --- NEW STATUS LOGIC ---
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Work_Completed', 'Verified'],
    default: 'Pending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  assigned_at: { // When the worker was assigned
    type: Date,
  },
  worker_completed_at: { // When the worker ticked 'complete'
    type: Date,
  },
  verified_at: { // When the warden verified the completion
    type: Date,
  },
  // --- `is_completed` and `completed_at` are removed ---
});

module.exports = mongoose.model('Complaint', ComplaintSchema);