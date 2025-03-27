const User = require("../models/UserModel");

// Register a new user
const registerUser = async (req, res) => {
    console.log(req.body);

    if (!req.body.email || !req.body.name) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const newUser = new User(req.body);
        await newUser.save();
        return res.status(201).json({ message: "User Created!" });
    } catch (error) {
        console.error("Error saving user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Export controller functions
module.exports = { registerUser };
