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

// Store OTP for a user
const storeOtpForUser = async (email, otp) => {
  const collection = getUserCollection();
  const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  await collection.updateOne(
    { email },
    { $set: { otp, otp_expiration: otpExpiration } }
  );
};

// Update user's password
const updateUserPassword = async (email, hashedPassword) => {
  const collection = getUserCollection();
  await collection.updateOne(
    { email },
    { $set: { password: hashedPassword, otp: null, otp_expiration: null } }
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  storeOtpForUser,
  updateUserPassword,
};