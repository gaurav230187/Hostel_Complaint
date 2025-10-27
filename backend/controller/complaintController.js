const Complaint = require('../models/Complaint');
const User = require('../models/User'); // We need User model for worker check

exports.postComplaints = async (req, res) => {
  try {
    const { _id, block_id } = req.user; 
    const { name, description, room, category } = req.body; 

    const newComplaint = new Complaint({
      name,
      description,
      room,
      category, 
      user_id: _id,
      block_id: block_id._id,
      // status defaults to 'Pending'
    });

    await newComplaint.save();
    res.json(newComplaint);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// This is now "Verify as Complete" (Warden only)
exports.putComplaintsByid = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      // Set status to Verified and add the verification date
      { status: 'Verified', verified_at: Date.now() },
      { new: true }
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

// Assign a worker to a complaint (Warden only)
exports.assignWorkerToComplaint = async (req, res) => {
  try {
    const { id } = req.params; // Complaint ID
    const { worker_id } = req.body; // Worker's User ID

    if (!worker_id) {
      return res.status(400).json({ error: "Worker ID is required" });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      // Set status to Assigned and add worker/date
      { 
        assigned_to: worker_id, 
        assigned_at: Date.now(),
        status: 'Assigned' 
      },
      { new: true }
    )
    .populate('assigned_to', 'full_name phone specialization');

    if (!updatedComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    
    res.json(updatedComplaint);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- NEW FUNCTION ---
// Mark work as complete (Worker only)
exports.workerMarkComplete = async (req, res) => {
  try {
    const { id } = req.params; // Complaint ID
    const { _id } = req.user; // Worker's ID from token

    // Find the complaint
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // Security check: Is this worker assigned to this complaint?
    if (complaint.assigned_to.toString() !== _id.toString()) {
      return res.status(403).json({ error: "You are not assigned to this complaint." });
    }

    // Update the complaint
    complaint.status = 'Work_Completed';
    complaint.worker_completed_at = Date.now();
    await complaint.save();
    
    res.json(complaint);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// --- END NEW FUNCTION ---

exports.getAllComplaintsByUser = async (req, res) => {
  const { _id, type, block_id } = req.user;

  try {
    let complaints;
    if (type === "warden") {
      complaints = await Complaint.find({ block_id: block_id._id })
        .populate('user_id', 'full_name usn room')
        .populate('assigned_to', 'full_name phone specialization') 
        .sort({ created_at: -1 });
    } else if (type === "student") {
      complaints = await Complaint.find({ user_id: _id })
        .populate('assigned_to', 'full_name phone specialization') 
        .sort({ created_at: -1 });
    } else if (type === "worker") { 
      complaints = await Complaint.find({ assigned_to: _id })
        .populate('user_id', 'full_name usn room')
        .populate('block_id', 'block_name')
        .sort({ created_at: -1 });
    }

    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ... (getUserType, getUserDetails, deleteComplaints remain unchanged)
exports.getUserType = async (req, res) => {
  try {
    res.json({ userType: req.user.type });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getUserDetails = async (req, res) => {
  try {
    if (req.user.type === "student") {
        res.json([{
            full_name: req.user.full_name,
            email: req.user.email,
            phone: req.user.phone,
            usn: req.user.usn,
            block_id: req.user.block_id.block_name,
            block_name: req.user.block_id.block_name,
            room: req.user.room
        }]);
    } else if (req.user.type === "warden") {
        res.json([{
            full_name: req.user.full_name,
            email: req.user.email,
            phone: req.user.phone
        }]);
    } else if (req.user.type === "worker") { 
        res.json([{
            full_name: req.user.full_name,
            email: req.user.email,
            phone: req.user.phone,
            specialization: req.user.specialization
        }]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.deleteComplaints = async (req, res) => {
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