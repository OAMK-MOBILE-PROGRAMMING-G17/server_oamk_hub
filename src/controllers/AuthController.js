const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/UserModel");

// Register a new user
const registerUser = async (req, res) => {
  if (!req.body.email || !req.body.name || !req.body.password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  try {
    const existingUser = await findUserByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await createUser(newUser);
    return res.status(201).json({ message: "User Created!" });
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      process.env.JWT_SECRET || "your_jwt_secret", // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    return res.status(200).json({
      message: "Login successful",
      token, // Return the token
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser };
