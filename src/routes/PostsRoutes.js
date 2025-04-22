const express = require("express");
const {
    createPost,
    getAllPosts,
    getPostById,
    likePost,
    dislikePost,
    deletePost,
} = require("../controllers/PostsController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Routes for Posts
router.post("/", authenticateToken, createPost); // Create a post
router.get("/", authenticateToken, getAllPosts); // Get all posts
router.get("/:id", authenticateToken, getPostById); // Get a specific post by ID
router.post("/:id/like", authenticateToken, likePost); // Like a post
router.post("/:id/dislike", authenticateToken, dislikePost); // Dislike a post
router.delete("/:id", authenticateToken, deletePost); // Delete a post

module.exports = router;