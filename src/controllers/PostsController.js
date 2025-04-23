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
        // Insert the new post into the database
        const result = await createPostInDB({
            user_id: userId,
            content,
            likes: 0,
            dislikes: 0,
            comments: 0,
            created_at: new Date(),
            updated_at: new Date(),
        });

        // Fetch the newly created post with user info
        const newPost = await getPostByIdFromDB(result.insertedId);

        res.status(201).json(newPost); // Send the new post with user info as the response
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
    const userId = req.user.id; // Extract user ID from JWT token

    try {
        const post = await getPostByIdFromDB(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the user has already liked the post
        if (post.liked_by.includes(userId)) {
            // Remove like
            const updatedPost = await updatePostLikesDislikes(id, userId, "remove_like");
            return res.status(200).json({ message: "Like removed", post: updatedPost.value });
        } else {
            // Add like
            const updatedPost = await updatePostLikesDislikes(id, userId, "like");
            return res.status(200).json({ message: "Post liked", post: updatedPost.value });
        }
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Dislike a post
const dislikePost = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Extract user ID from JWT token

    try {
        const post = await getPostByIdFromDB(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the user has already disliked the post
        if (post.disliked_by.includes(userId)) {
            // Remove dislike
            const updatedPost = await updatePostLikesDislikes(id, userId, "remove_dislike");
            return res.status(200).json({ message: "Dislike removed", post: updatedPost.value });
        } else {
            // Add dislike
            const updatedPost = await updatePostLikesDislikes(id, userId, "dislike");
            return res.status(200).json({ message: "Post disliked", post: updatedPost.value });
        }
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