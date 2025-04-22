const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const {
  createChatMessageInDB,
  getChatMessagesByListingAndBuyerFromDB,
} = require("../models/MarketplaceChatsModel");
const { client } = require("../config/database");
const { JWT_SECRET } = process.env;

const dbName          = "oamkhub";
const itemsCollection = client.db(dbName).collection("Marketplace");

async function getSellerForListing(listingId) {
  const item = await itemsCollection.findOne({ id: listingId });
  if (!item) throw new Error(`Listing not found: ${listingId}`);
  return item.userId || item.user_id; 
}

module.exports = (server) => {
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET","POST"] },
  });

  // 1) Authenticate every socket connection via your JWT
  io.use((socket, next) => {
    try {
      let token = socket.handshake.auth.token;
      if (!token) throw new Error("No token provided");
      if (token.startsWith("Bearer ")) token = token.slice(7);
      const payload = jwt.verify(token, JWT_SECRET);
      socket.user = { id: payload.id };
      return next();
    } catch (err) {
      console.error("🔒 Socket auth failed:", err.message);
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`⚡️ Socket connected: id=${socket.id} user=${socket.user.id}`);

    // 2) Everyone joins their own seller room for notifications
    const sellerRoom = `seller_${socket.user.id}`;
    socket.join(sellerRoom);

    // 3) Handler for loading history
    socket.on("joinRoom", async (data) => {
      console.log("⬆️  joinRoom payload:", data);
      const { marketplace_id, buyer_id } = data;
      if (!marketplace_id || !buyer_id) return;
      const room = `${marketplace_id}_${buyer_id}`;
      socket.join(room);
      try {
        const history = await getChatMessagesByListingAndBuyerFromDB(
          marketplace_id, buyer_id
        );
        socket.emit("history", history);
      } catch (err) {
        console.error("❌ Error fetching history:", err);
        socket.emit("errorMessage", "Could not load history");
      }
    });

    // 4) Handler for new chat messages
    socket.on("chatMessage", async (data) => {
      console.log("⬆️  chatMessage payload:", data);
      const { marketplace_id, buyer_id, messages } = data;
      const user_id = socket.user.id;
      
      if (!marketplace_id || !buyer_id || !messages || !user_id) return;

      try {
        const chatroom_id = `${marketplace_id}_${buyer_id}`;
        const seller_id   = await getSellerForListing(marketplace_id);
        const participants = [buyer_id, seller_id];

        if (!seller_id || !buyer_id || !user_id) {
          return console.error("❌ Incomplete user info, skipping insert.");
        }        

        const newMessage = {
          chatroom_id,
          participants: [buyer_id, seller_id],
          marketplace_id,
          buyer_id,
          seller_id,
          user_id,
          messages,
          seen: false,
          created_at: new Date()
        };

        const res = await createChatMessageInDB(newMessage);

// Include full data for real-time emit
const savedMessage = {
  _id: res.insertedId.toString(),
  ...newMessage
};

io.to(chatroom_id).emit("newMessage", savedMessage);

        // Broadcast to buyer/seller room
        const privateRoom = `${marketplace_id}_${buyer_id}`;
        io.to(privateRoom).emit("newMessage", savedMessage);

        // Notify the seller in real time
        io.to(`seller_${seller_id}`).emit("notifySeller", {
          marketplace_id,
          buyer_id,
        });

        // Log inside try so variables exist
        console.log("→ newMessage →", savedMessage);
        console.log("→ notifySeller →", {
          marketplace_id,
          buyer_id,
          seller_id,
        });
      } catch (err) {
        console.error("❌ Error in chatMessage handler:", err);
        socket.emit("errorMessage", "Could not send chat message.");
      }
    });
  });

  return io;
};