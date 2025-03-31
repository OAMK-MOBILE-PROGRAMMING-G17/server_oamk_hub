const mongoose = require("mongoose");
const { client } = require("../config/database"); // Import the connected MongoDB client

const dbName = "oamkhub"; // Replace with your database name
const collectionName = "users"; // Replace with your collection name

const getUserCollection = () => {
  const db = client.db(dbName); // Access the database
  return db.collection(collectionName); // Access the collection
};

// Create a new user
const createUser = async (userData) => {
  const collection = getUserCollection();
  const result = await collection.insertOne(userData);
  return result;
};

// Find a user by email
const findUserByEmail = async (email) => {
  const collection = getUserCollection();
  const user = await collection.findOne({ email });
  return user;
};

module.exports = {
  createUser,
  findUserByEmail,
};