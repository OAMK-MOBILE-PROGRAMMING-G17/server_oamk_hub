const { client } = require("../config/database");

const dbName = "oamkhub";
const collectionName = "Marketplace_Chats";

const getMarketplaceChatsCollection = () => client.db(dbName).collection(collectionName);

const createChatMessageInDB = async (message) => {
  const collection = getMarketplaceChatsCollection();
  return await collection.insertOne(message);
};

const getChatMessagesByMarketplaceIdFromDB = async (marketplaceId) => {
  const collection = getMarketplaceChatsCollection();
  return await collection.find({ marketplace_id: marketplaceId }).toArray();
};

module.exports = {
  createChatMessageInDB,
  getChatMessagesByMarketplaceIdFromDB,
};