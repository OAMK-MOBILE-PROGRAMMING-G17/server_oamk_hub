const express = require("express");
const cors = require("cors");
const path  = require("path");
require("dotenv").config();
const { connectDB } = require("./src/config/database");

const app = express();                

const http = require("http");
const server = http.createServer(app); 

const initSocket = require("./src/socket/MarketplaceChatSocket");
initSocket(server);                    

// ─────────────────── middleware ───────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─────────────────── database ──────────────────────
connectDB();

// ─────────────────── routes ────────────────────────
app.use("/auth",            require("./src/routes/AuthRoutes"));
app.use("/lost-products",   require("./src/routes/LostProductsRoutes"));
app.use("/found-products",  require("./src/routes/FoundProductsRoutes"));
app.use("/marketplace",     require("./src/routes/MarketplaceRoutes"));
app.use("/marketplace-chats", require("./src/routes/MarketplaceChatsRoutes"));

// ─────────────────── start server ──────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});