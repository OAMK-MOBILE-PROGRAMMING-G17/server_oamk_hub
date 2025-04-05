const express = require("express");
const {
  createChatMessage,
  getChatMessagesByMarketplaceId,
} = require("../controllers/MarketplaceChatsController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Routes for Marketplace Chats
router.post("/", authenticateToken, createChatMessage); // Create a chat message
router.get("/:marketplaceId", authenticateToken, getChatMessagesByMarketplaceId); // Get all chat messages for a marketplace item

module.exports = router;