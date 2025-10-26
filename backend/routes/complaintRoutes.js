const express = require("express");
const complaintRoutes = express.Router();
const {
  postComplaints,
  putComplaintsByid,
  getAllComplaintsByUser,
  getUserType,
  getUserDetails,
  deleteComplaints
} = require("../controller/complaintController");

// Import your new middleware
const { auth, authorizeWarden } = require("../middleware/auth");

// Apply the middleware to protect your routes
complaintRoutes.post("/complaints", auth, postComplaints);
complaintRoutes.get("/complaints", auth, getAllComplaintsByUser);
complaintRoutes.post("/complaints/:id", auth, authorizeWarden, putComplaintsByid);
complaintRoutes.delete("/complaints/:id", auth, authorizeWarden, deleteComplaints);

complaintRoutes.get("/userType", auth, getUserType);
// This route no longer needs an :id, it gets the user from the token
complaintRoutes.get("/userDetails", auth, getUserDetails);

module.exports = complaintRoutes;