const express = require("express");
const userRoutes = express.Router();
const { auth, authorizeWarden } = require("../middleware/auth"); // Import auth

const { 
  userRegister, 
  userLogin, 
  getAllWorkers // Import new function
} = require('../controller/userController');

userRoutes.post("/register", userRegister);

userRoutes.post("/login", userLogin);

// New route for wardens to get a list of workers
userRoutes.get("/users/workers", auth, authorizeWarden, getAllWorkers);

module.exports = userRoutes;