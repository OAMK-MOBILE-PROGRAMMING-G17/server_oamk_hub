const express = require("express");
const cors = require("cors");
require("dotenv").config(); // For environment variables
const { connectDB } = require("./src/config/database"); // Import the database connection

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
const authenticationRouter = require("./src/routes/AuthRoutes");
app.use("/auth", authenticationRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
