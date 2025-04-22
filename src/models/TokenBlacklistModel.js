const { client } = require("../config/database");

const dbName = "oamkhub";
const collectionName = "token_blacklist";

const getTokenBlacklistCollection = () => {
    const db = client.db(dbName);
    return db.collection(collectionName);
};

// Add a token to the blacklist
const addTokenToBlacklist = async (token) => {
    const collection = getTokenBlacklistCollection();
    const expiration = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hours
    await collection.insertOne({ token, expiration });
};

// Check if a token is blacklisted
const isTokenBlacklisted = async (token) => {
    const collection = getTokenBlacklistCollection();
    const blacklistedToken = await collection.findOne({ token });
    return !!blacklistedToken;
};

// Remove expired tokens from the blacklist
const removeExpiredTokens = async () => {
    const collection = getTokenBlacklistCollection();
    await collection.deleteMany({ expiration: { $lt: Date.now() } });
};

module.exports = {
    addTokenToBlacklist,
    isTokenBlacklisted,
    removeExpiredTokens,
};