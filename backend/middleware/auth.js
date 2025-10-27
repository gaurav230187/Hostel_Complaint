const User = require('../models/User');
const { jwtDecoder } = require('../utils/jwtToken'); // Using your JWT util

// This middleware verifies the token and adds the user to req.user
exports.auth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decodedToken = jwtDecoder(token); 
    const { user_id } = decodedToken.user;

    // Find user by ID and attach to req
    // We populate 'block_id' to get block info (like its name)
    req.user = await User.findById(user_id)
      .populate('block_id', 'block_name') // Fetches the block and only includes its name
      .select('-password'); // Never send the password back

    if (!req.user) {
      return res.status(401).json({ msg: 'User not found, token invalid' });
    }
    
    next();
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// This middleware checks if the user is a warden
exports.authorizeWarden = (req, res, next) => {
  if (req.user && req.user.type === 'warden') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Wardens only.' });
  }
};

// --- NEW MIDDLEWARE ---
// This middleware checks if the user is a worker
exports.authorizeWorker = (req, res, next) => {
  if (req.user && req.user.type === 'worker') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Workers only.' });
  }
};
// --- END NEW MIDDLEWARE ---