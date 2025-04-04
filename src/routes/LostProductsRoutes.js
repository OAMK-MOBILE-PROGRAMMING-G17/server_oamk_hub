const express = require("express");
const {
  createLostProduct,
  getAllLostProducts,
  getLostProductById,
  updateLostProduct,
  deleteLostProduct,
} = require("../controllers/LostProductsController");
const authenticateToken = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig"); // Import multer configuration

const router = express.Router();

// Middleware to parse x-www-form-urlencoded data
router.use(express.urlencoded({ extended: true }));

// Routes for LostProducts
router.post("/", authenticateToken, upload.array("images", 5), createLostProduct); // Allow up to 5 images
router.get("/", authenticateToken, getAllLostProducts); // Get all lost products
router.get("/:id", authenticateToken, getLostProductById); // Get a specific lost product by ID
router.put("/:id", authenticateToken, updateLostProduct); // Update a lost product
router.delete("/:id", authenticateToken, deleteLostProduct); // Delete a lost product

module.exports = router;