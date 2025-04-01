const express = require("express");
const {
  createFoundProduct,
  getCommentsByLostProductId,
} = require("../controllers/FoundProductsController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Routes for FoundProducts
router.post("/", authenticateToken, createFoundProduct); // Add a comment for a found product
router.get("/:lostProductId", authenticateToken, getCommentsByLostProductId); // Get all comments for a lost product

module.exports = router;