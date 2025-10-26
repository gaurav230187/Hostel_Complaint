const Complaint = require('../models/Complaint');
// We no longer need the 'decodeUser' function, middleware handles it

exports.postComplaints = async (req, res) => {
  try {
    // req.user is provided by the 'auth' middleware
    const { _id, block_id } = req.user; 
    const { name, description, room } = req.body;

    const newComplaint = new Complaint({
      name,
      description,
      room,
      user_id: _id,         // User's Mongoose _id
      block_id: block_id._id, // The _id of the user's populated block
    });

    await newComplaint.save();
    res.json(newComplaint);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.putComplaintsByid = async (req, res) => {
  // This controller is protected by 'auth' and 'authorizeWarden'
  try {
    const { id } = req.params;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { is_completed: true, assigned_at: Date.now() },
      { new: true } // This option returns the updated document
    );

    if (!updatedComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    
    res.json(updatedComplaint);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllComplaintsByUser = async (req, res) => {
  // 'auth' middleware provides req.user
  const { _id, type, block_id } = req.user;

  try {
    let complaints;
    if (type === "warden") {
      // Find all complaints for the warden's block_id
      complaints = await Complaint.find({ block_id: block_id._id })
        .populate('user_id', 'full_name usn room') // Show who made the complaint
        .sort({ created_at: -1 });
    } else if (type === "student") {
      // Find only this student's complaints
      complaints = await Complaint.find({ user_id: _id })
        .sort({ created_at: -1 });
    }

    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserType = async (req, res) => {
  // 'auth' middleware provides req.user
  try {
    res.json({ userType: req.user.type });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserDetails = async (req, res) => {
  // 'auth' middleware already fetched the user and populated the block
  try {
    // Format the req.user data to match what the frontend expects
    if (req.user.type === "student") {
        res.json([{
            full_name: req.user.full_name,
            email: req.user.email,
            phone: req.user.phone,
            usn: req.user.usn,
            block_id: req.user.block_id.block_name, // Send the name, not the _id
            block_name: req.user.block_id.block_name,
            room: req.user.room
        }]);
    } else if (req.user.type === "warden") {
        res.json([{
            full_name: req.user.full_name,
            email: req.user.email,
            phone: req.user.phone
        }]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteComplaints = async (req, res) => {
  // This controller is protected by 'auth' and 'authorizeWarden'
  try {
    const { id } = req.params;

    const deletedComplaint = await Complaint.findByIdAndDelete(id);

    if (!deletedComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json("complaint deleted");
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};