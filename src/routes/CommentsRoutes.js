const express = require("express");
const {
    addComment,
    getCommentsByPostId,
} = require("../controllers/CommentsController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Routes for Comments
router.post("/:postId", authenticateToken, addComment); // Add a comment to a post
router.get("/:postId", authenticateToken, getCommentsByPostId); // Get all comments for a post

module.exports = router;