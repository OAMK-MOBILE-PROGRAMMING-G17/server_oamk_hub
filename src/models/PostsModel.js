const { client } = require("../config/database");

const dbName = "oamkhub";
const collectionName = "posts";
const usersCollectionName = "users";

const getPostsCollection = () => client.db(dbName).collection(collectionName);

const createPostInDB = async (post) => {
    const collection = getPostsCollection();
    return await collection.insertOne(post);
};

// const getAllPostsFromDB = async () => {
//     const collection = getPostsCollection();
//     return await collection.find().toArray();
// };

/// Fetch all posts with user information
const getAllPostsFromDB = async () => {
    const collection = getPostsCollection();
    return await collection
        .aggregate([
            {
                $addFields: {
                    user_id_as_objectId: { $toObjectId: "$user_id" }, // Convert user_id string to ObjectId
                },
            },
            {
                $lookup: {
                    from: usersCollectionName, // Join with the users collection
                    localField: "user_id_as_objectId", // Use the converted ObjectId field
                    foreignField: "_id", // Field in users collection
                    as: "user_info", // Output array field
                },
            },
            {
                $unwind: "$user_info", // Flatten the user_info array
            },
            {
                $sort: { created_at: -1 }, // Sort by created_at in descending order
            },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    content: 1,
                    likes: 1,
                    dislikes: 1,
                    comments: 1,
                    created_at: 1,
                    updated_at: 1,
                    "user_info.name": 1,
                    "user_info.email": 1,
                    "user_info.profilePicture": 1,
                },
            },
        ])
        .toArray();
};

const getPostByIdFromDB = async (id) => {
    const collection = getPostsCollection();
    return await collection.findOne({ id });
};

const updatePostLikesDislikes = async (postId, userId, action) => {
    const collection = getPostsCollection();

    if (action === "like") {
        // Add user to liked_by array and remove from disliked_by array
        return await collection.findOneAndUpdate(
            { id: postId },
            {
                $addToSet: { liked_by: userId }, // Add userId to liked_by if not already present
                $pull: { disliked_by: userId }, // Remove userId from disliked_by
            },
            { returnDocument: "after" }
        );
    } else if (action === "dislike") {
        // Add user to disliked_by array and remove from liked_by array
        return await collection.findOneAndUpdate(
            { id: postId },
            {
                $addToSet: { disliked_by: userId }, // Add userId to disliked_by if not already present
                $pull: { liked_by: userId }, // Remove userId from liked_by
            },
            { returnDocument: "after" }
        );
    } else if (action === "remove_like") {
        // Remove user from liked_by array
        return await collection.findOneAndUpdate(
            { id: postId },
            { $pull: { liked_by: userId } }, // Remove userId from liked_by
            { returnDocument: "after" }
        );
    } else if (action === "remove_dislike") {
        // Remove user from disliked_by array
        return await collection.findOneAndUpdate(
            { id: postId },
            { $pull: { disliked_by: userId } }, // Remove userId from disliked_by
            { returnDocument: "after" }
        );
    }
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