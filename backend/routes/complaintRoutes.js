const express = require("express");
const complaintRoutes = express.Router();
const {
  postComplaints,
  putComplaintsByid,
  getAllComplaintsByUser,
  getUserType,
  getUserDetails,
  deleteComplaints,
  assignWorkerToComplaint,
  workerMarkComplete, // Import new function
} = require("../controller/complaintController");

// Import your new middleware
const { auth, authorizeWarden, authorizeWorker } = require("../middleware/auth");

// Apply the middleware to protect your routes
complaintRoutes.post("/complaints", auth, postComplaints);
complaintRoutes.get("/complaints", auth, getAllComplaintsByUser);

// Warden "Verify" route
complaintRoutes.put("/complaints/:id", auth, authorizeWarden, putComplaintsByid);

complaintRoutes.delete("/complaints/:id", auth, authorizeWarden, deleteComplaints);

// Warden "Assign" route
complaintRoutes.put("/complaints/assign/:id", auth, authorizeWarden, assignWorkerToComplaint);

// --- NEW WORKER ROUTE ---
complaintRoutes.put("/complaints/worker-complete/:id", auth, authorizeWorker, workerMarkComplete);
// --- END NEW ROUTE ---

complaintRoutes.get("/userType", auth, getUserType);
complaintRoutes.get("/userDetails", auth, getUserDetails);

module.exports = complaintRoutes;