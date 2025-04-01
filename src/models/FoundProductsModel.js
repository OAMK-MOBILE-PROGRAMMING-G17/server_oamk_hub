const { client } = require("../config/database");

const dbName = "oamkhub";
const collectionName = "FoundProducts";

const getFoundProductsCollection = () => client.db(dbName).collection(collectionName);

const createFoundProductInDB = async (comment) => {
  const collection = getFoundProductsCollection();
  return await collection.insertOne(comment);
};

const getCommentsByLostProductIdFromDB = async (lostProductId) => {
  const collection = getFoundProductsCollection();
  return await collection.find({ lostproducts_id: lostProductId }).toArray();
};

module.exports = {
  createFoundProductInDB,
  getCommentsByLostProductIdFromDB,
};