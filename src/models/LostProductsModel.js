const { client } = require("../config/database");

const dbName = "oamkhub";
const collectionName = "LostProducts";

const getLostProductsCollection = () => client.db(dbName).collection(collectionName);

const createLostProductInDB = async (product) => {
  const collection = getLostProductsCollection();
  return await collection.insertOne(product);
};

const getLostProductsFromDB = async () => {
  const collection = getLostProductsCollection();
  return await collection.find().toArray();
};

const getLostProductByIdFromDB = async (id) => {
  const collection = getLostProductsCollection();
  return await collection.findOne({ id });
};

const updateLostProductInDB = async (id, updates) => {
  const collection = getLostProductsCollection();
  return await collection.findOneAndUpdate({ id }, { $set: updates }, { returnDocument: "after" });
};

const deleteLostProductFromDB = async (id) => {
  const collection = getLostProductsCollection();
  return await collection.deleteOne({ id });
};

module.exports = {
  createLostProductInDB,
  getLostProductsFromDB,
  getLostProductByIdFromDB,
  updateLostProductInDB,
  deleteLostProductFromDB,
};