const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan")
// ... other imports
const connectDB = require('./db'); // Adjust path if needed

// Connect to MongoDB


// ... rest of your app (app.use(cors()), app.use(express.json()), etc.)

const complaintRoutes = require("./routes/complaintRoutes");
const studentRoutes = require("./routes/studentRoutes");
const wardenRoutes = require("./routes/wardenRoutes");
const userRoutes = require("./routes/userRoutes");
connectDB();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use('/', complaintRoutes);
app.use('/', studentRoutes)
app.use('/', wardenRoutes)
app.use('/', userRoutes)

app.listen(3000, () => {
  console.log("Application is running on port 3000");
});
