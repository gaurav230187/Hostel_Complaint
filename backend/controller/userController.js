const User = require('../models/User');
const Block = require('../models/Block');
const { jwtGenerator } = require("../utils/jwtToken");

exports.userRegister = async (req, res) => {
  // Added specialization
  const { full_name, email, phone, password, type, block_id, usn, room, specialization } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(401).json("User already exist!");
    }

    // 2. Find the Mongoose _id for the block
    // We assume 'block_id' from the form is the block_name (e.g., "A" or "B")
    const userBlock = await Block.findOne({ block_name: block_id });
    if (!userBlock) {
      return res.status(400).json("Block not found. Please register a valid block first.");
    }

    // 3. Create new user (password is hashed by 'pre-save' hook in model)
    user = new User({
      full_name,
      email,
      phone,
      password,
      type,
      block_id: userBlock._id, // Store the Mongo _id
      usn: type === 'student' ? usn : undefined,
      room: type === 'student' ? room : undefined,
      specialization: type === 'worker' ? specialization : undefined, // Added this
    });

    // 4. Save user to DB
    await user.save();

    // 5. Generate and return token
    const jwtToken = jwtGenerator(user._id, user.type); // Use Mongoose _id
    return res.json({ jwtToken });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json("Invalid Credential");
    }

    // 2. Compare password using our schema method
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }

    // 3. Generate and return token
    const jwtToken = jwtGenerator(user._id, user.type); // Use Mongoose _id
    return res.json({ jwtToken });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// --- NEW FUNCTION ---
// Get all workers for a warden's block
exports.getAllWorkers = async (req, res) => {
  try {
    // req.user is from 'auth' middleware, block_id is populated
    const workers = await User.find({
      type: 'worker',
      block_id: req.user.block_id._id 
    }).select('full_name specialization'); // Only send necessary info

    res.json(workers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
// --- END NEW FUNCTION ---