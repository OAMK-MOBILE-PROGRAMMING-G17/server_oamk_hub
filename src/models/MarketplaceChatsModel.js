const { client } = require("../config/database");
const dbName = "oamkhub";
const collectionName = "Marketplace_Chats";

const coll = () => client.db(dbName).collection("Marketplace_Chats");

async function createChatMessageInDB(message) {
  return await coll().insertOne(message);
}

/** Fetch history for one listing + one buyer */
async function getChatMessagesByListingAndBuyerFromDB(marketplaceId, buyerId) {
  return await coll()
    .find({ marketplace_id: marketplaceId, buyer_id: buyerId })
    .toArray();
}

async function getThreadsForUserFromDB(userId) {
  const pipeline = [
    {
      $match: {
        participants: userId 
      }
    },
    {
      $group: {
        _id: "$chatroom_id",
        marketplace_id: { $first: "$marketplace_id" },
        buyer_id: { $first: "$buyer_id" },
        seller_id: { $first: "$seller_id" },
        participants: { $first: "$participants" }
      }
    },
    {
      $lookup: {
        from: "Marketplace",
        localField: "marketplace_id",
        foreignField: "id",
        as: "item"
      }
    },
    {
      $unwind: {
        path: "$item",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 0,
        chatroom_id: "$_id",
        marketplace_id: 1,
        buyer_id: 1,
        seller_id: 1,
        participants: 1,
        item_title: "$item.title"
      }
    }
  ];

  return client
    .db(dbName)
    .collection(collectionName)
    .aggregate(pipeline)
    .toArray();
}

module.exports = {
  createChatMessageInDB,
  getChatMessagesByListingAndBuyerFromDB,
  getThreadsForUserFromDB
};