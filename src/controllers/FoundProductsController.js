const { createFoundProductInDB, getCommentsByLostProductIdFromDB } = require("../models/FoundProductsModel");

// Add a comment for a found product
const createFoundProduct = async (req, res) => {
  const { lostproducts_id, comments } = req.body;
  const userId = req.user.id; // Extract user ID from JWT token

  if (!lostproducts_id || !comments) {
    return res.status(400).json({ error: "Lost product ID and comments are required" });
  }

  try {
    const newFoundProduct = await createFoundProductInDB({
      user_id: userId,
      lostproducts_id,
      comments,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json(newFoundProduct);
  } catch (error) {
    console.error("Error creating found product comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all comments for a lost product
const getCommentsByLostProductId = async (req, res) => {
  const { lostProductId } = req.params;

  try {
    const comments = await getCommentsByLostProductIdFromDB(lostProductId);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createFoundProduct,
  getCommentsByLostProductId,
};