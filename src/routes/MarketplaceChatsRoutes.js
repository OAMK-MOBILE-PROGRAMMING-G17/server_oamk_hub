const express = require("express");
const {
  getChatMessagesByListingAndBuyer,
  getThreads
} = require("../controllers/MarketplaceChatsController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:marketplaceId/:buyerId", authenticateToken, getChatMessagesByListingAndBuyer);
router.get( "/chatthread", authenticateToken, getThreads );

module.exports = router;