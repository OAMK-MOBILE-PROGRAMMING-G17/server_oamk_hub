const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../models/UserModel");

// Register a new user
const registerUser = async (req, res) => {
  console.log(req.body);

  if (!req.body.email || !req.body.name || !req.body.password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await findUserByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user with the hashed password
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
    // Find the user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // If login is successful, return a success message
    return res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser };
