const { client } = require("../config/database");

const dbName = "oamkhub";
const collectionName = "comments";

const getCommentsCollection = () => client.db(dbName).collection(collectionName);

const addCommentToDB = async (comment) => {
    const collection = getCommentsCollection();
    return await collection.insertOne(comment);
};

const getCommentsByPostIdFromDB = async (postId) => {
    const collection = getCommentsCollection();
    return await collection.find({ post_id: postId }).toArray();
};

module.exports = {
    addCommentToDB,
    getCommentsByPostIdFromDB,
};