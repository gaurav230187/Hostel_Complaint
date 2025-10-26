const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 'hostelDB' will be the name of your new database
    await mongoose.connect('mongodb://localhost:27017/hostelDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;