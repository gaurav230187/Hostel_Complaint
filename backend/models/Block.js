const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema({
  block_name: {
    type: String,
    required: true,
    unique: true,
  },
  // You can add other block details here, like number of rooms
});

module.exports = mongoose.model('Block', BlockSchema);