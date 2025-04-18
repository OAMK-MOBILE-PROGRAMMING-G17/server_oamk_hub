const {
    createPostInDB,
    getAllPostsFromDB,
    getPostByIdFromDB,
    updatePostLikesDislikes,
    deletePostFromDB,
} = require("../models/PostsModel");

// Create a post
const createPost = async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id; // Extract user ID from JWT token

    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }

    try {
        const newPost = await createPostInDB({
            user_id: userId,
            content,
            likes: 0,
            dislikes: 0,
            comments: 0,
            created_at: new Date(),
            updated_at: new Date(),
        });
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await getAllPostsFromDB();
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get a specific post by ID
const getPostById = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await getPostByIdFromDB(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Like a post
const likePost = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedPost = await updatePostLikesDislikes(id, { likes: 1 });
        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Dislike a post
const dislikePost = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedPost = await updatePostLikesDislikes(id, { dislikes: 1 });
        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error disliking post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a post
const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await deletePostFromDB(id);
        if (!deleted) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    likePost,
    dislikePost,
    deletePost,
};