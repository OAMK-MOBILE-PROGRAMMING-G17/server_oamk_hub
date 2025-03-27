const express = require('express');
const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/oamkhub";

const authRouter = express.Router();

// Ensure MongoDB connection
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected!"))
.catch(err => console.error("MongoDB connection error:", err));

// Define User schema and model
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const User = mongoose.model("users", UserSchema);

// Middleware to parse JSON payloads
authRouter.use(express.json());

authRouter.post("/register", async (req, res) => {
    console.log(req.body);

    if (!req.body.email || !req.body.name) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    try {
        const newUser = new User(req.body);
        await newUser.save();
        return res.status(201).json({ message: "User Created!" });
    } catch (error) {
        console.error("Error saving user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = authRouter;