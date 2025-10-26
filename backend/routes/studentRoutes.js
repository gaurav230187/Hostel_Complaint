const express = require('express');
const studentRoutes = express.Router()
const { getStudentByid } = require('../controller/studentController');
const { auth } = require("../middleware/auth"); // Import auth

// Protect this route so only logged-in users can see other student profiles
studentRoutes.get("/student/:student_id", auth, getStudentByid);

module.exports = studentRoutes