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
const lostProductsRouter = require("./src/routes/LostProductsRoutes");
const foundProductsRouter = require("./src/routes/FoundProductsRoutes");

app.use("/auth", authenticationRouter);
app.use("/lost-products", lostProductsRouter);
app.use("/found-products", foundProductsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
