const { client } = require("../config/database");

const dbName = "oamkhub";
const collectionName = "Marketplace";

const getMarketplaceCollection = () => client.db(dbName).collection(collectionName);

const createMarketplaceItemInDB = async (item) => {
  const collection = getMarketplaceCollection();
  return await collection.insertOne(item);
};

const getAllMarketplaceItemsFromDB = async () => {
  const collection = getMarketplaceCollection();
  return await collection.find().toArray();
};

const getMarketplaceItemByIdFromDB = async (id) => {
  const collection = getMarketplaceCollection();
  return await collection.findOne({ id });
};

const updateMarketplaceItemInDB = async (id, updates) => {
  const collection = getMarketplaceCollection();
  return await collection.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: "after" });
};

const deleteMarketplaceItemFromDB = async (id) => {
  const collection = getMarketplaceCollection();
  return await collection.deleteOne({ id });
};

module.exports = {
  createMarketplaceItemInDB,
  getAllMarketplaceItemsFromDB,
  getMarketplaceItemByIdFromDB,
  updateMarketplaceItemInDB,
  deleteMarketplaceItemFromDB,
};