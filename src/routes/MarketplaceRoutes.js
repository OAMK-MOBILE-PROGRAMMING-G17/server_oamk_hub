const express = require("express");
const {
  createMarketplaceItem,
  getAllMarketplaceItems,
  getMarketplaceItemById,
  updateMarketplaceItem,
  deleteMarketplaceItem,
} = require("../controllers/MarketplaceController");
const authenticateToken = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig"); // Import multer configuration

const router = express.Router();

// Routes for Marketplace
router.post("/", authenticateToken, upload.array("images", 5), createMarketplaceItem); // Create a marketplace item
router.get("/", authenticateToken, getAllMarketplaceItems); // Get all marketplace items
router.get("/:id", authenticateToken, getMarketplaceItemById); // Get a specific marketplace item by ID
router.put("/:id", authenticateToken, updateMarketplaceItem); // Update a marketplace item
router.delete("/:id", authenticateToken, deleteMarketplaceItem); // Delete a marketplace item

module.exports = router;