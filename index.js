const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // For environment variables
const { connectDB } = require("./src/config/database"); // Import the database connection

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB();

// Routes
const authenticationRouter = require("./src/routes/AuthRoutes");
const lostProductsRouter = require("./src/routes/LostProductsRoutes");
const foundProductsRouter = require("./src/routes/FoundProductsRoutes");
const marketplaceRouter = require("./src/routes/MarketplaceRoutes");
const marketplaceChatsRouter = require("./src/routes/MarketplaceChatsRoutes");
const postsRouter = require("./src/routes/PostsRoutes");
const commentsRouter = require("./src/routes/CommentsRoutes");

app.use("/auth", authenticationRouter);
app.use("/lost-products", lostProductsRouter);
app.use("/found-products", foundProductsRouter);
app.use("/marketplace", marketplaceRouter);
app.use("/marketplace-chats", marketplaceChatsRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
