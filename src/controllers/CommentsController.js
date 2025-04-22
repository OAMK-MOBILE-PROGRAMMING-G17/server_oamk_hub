const {
    addCommentToDB,
    getCommentsByPostIdFromDB,
} = require("../models/CommentsModel");

// Add a comment to a post
const addComment = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // Extract user ID from JWT token

    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }

    try {
        const newComment = await addCommentToDB({
            post_id: postId,
            user_id: userId,
            content,
            created_at: new Date(),
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all comments for a post
const getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await getCommentsByPostIdFromDB(postId);
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    addComment,
    getCommentsByPostId,
};