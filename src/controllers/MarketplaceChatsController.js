const {
  createChatMessageInDB,
  getChatMessagesByMarketplaceIdFromDB,
} = require("../models/MarketplaceChatsModel");

// Create a chat message
const createChatMessage = async (req, res) => {
  const { marketplace_id, messages } = req.body;
  const userId = req.user.id; // Extract user ID from JWT token

  if (!marketplace_id || !messages) {
    return res.status(400).json({ error: "Marketplace ID and messages are required" });
  }

  try {
    const newMessage = await createChatMessageInDB({
      marketplace_id,
      user_id: userId,
      messages,
      seen: false,
      created_at: new Date(),
    });
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error creating chat message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all chat messages for a marketplace item
const getChatMessagesByMarketplaceId = async (req, res) => {
  const { marketplaceId } = req.params;

  try {
    const messages = await getChatMessagesByMarketplaceIdFromDB(marketplaceId);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createChatMessage,
  getChatMessagesByMarketplaceId,
};