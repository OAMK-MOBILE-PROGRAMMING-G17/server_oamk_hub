const {
  getChatMessagesByListingAndBuyerFromDB,
  getThreadsForUserFromDB
} = require("../models/MarketplaceChatsModel");

const { getMarketplaceItemByIdFromDB } = require("../models/MarketplaceModel")

const getChatMessagesByListingAndBuyer = async (req, res) => {
  const { marketplaceId, buyerId } = req.params;

  try {
    const messages = await getChatMessagesByListingAndBuyerFromDB(
      marketplaceId,
      buyerId
    );
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getThreads = async (req, res) => {
  const userId = req.user.id;

  try {
    let threads = await getThreadsForUserFromDB(userId);

    threads = await Promise.all(
      threads.map(async (t) => {
        const item = await getMarketplaceItemByIdFromDB(t.marketplace_id);
    
        return {
          ...t,
          itemTitle: item?.title || "Unknown Item",
        };
      })
    );

    res.status(200).json(threads);
  } catch (err) {
    console.error("Error in getThreads:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getChatMessagesByListingAndBuyer,
  getThreads
};