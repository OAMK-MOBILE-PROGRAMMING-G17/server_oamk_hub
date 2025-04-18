const { client } = require("../config/database");

const dbName = "oamkhub";
const collectionName = "posts";

const getPostsCollection = () => client.db(dbName).collection(collectionName);

const createPostInDB = async (post) => {
    const collection = getPostsCollection();
    return await collection.insertOne(post);
};

const getAllPostsFromDB = async () => {
    const collection = getPostsCollection();
    return await collection.find().toArray();
};

const getPostByIdFromDB = async (id) => {
    const collection = getPostsCollection();
    return await collection.findOne({ id });
};

const updatePostLikesDislikes = async (id, update) => {
    const collection = getPostsCollection();
    return await collection.findOneAndUpdate(
        { id },
        { $inc: update },
        { returnDocument: "after" }
    );
};

const deletePostFromDB = async (id) => {
    const collection = getPostsCollection();
    return await collection.deleteOne({ id });
};

module.exports = {
    createPostInDB,
    getAllPostsFromDB,
    getPostByIdFromDB,
    updatePostLikesDislikes,
    deletePostFromDB,
};