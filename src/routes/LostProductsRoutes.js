const express = require("express");
const {
  createLostProduct,
  getAllLostProducts,
  getLostProductById,
  updateLostProduct,
  deleteLostProduct,
} = require("../controllers/LostProductsController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Routes for LostProducts
router.post("/", authenticateToken, createLostProduct); // Create a lost product
router.get("/", authenticateToken, getAllLostProducts); // Get all lost products
router.get("/:id", authenticateToken, getLostProductById); // Get a specific lost product by ID
router.put("/:id", authenticateToken, updateLostProduct); // Update a lost product
router.delete("/:id", authenticateToken, deleteLostProduct); // Delete a lost product

module.exports = router;