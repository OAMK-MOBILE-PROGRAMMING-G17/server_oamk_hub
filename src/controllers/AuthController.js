const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser, updateUserPassword, storeOtpForUser } = require("../models/UserModel");

// Generate a random OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configure nodemailer for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// Request password reset (send OTP)
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate OTP and store it temporarily
    const otp = generateOtp();
    await storeOtpForUser(email, otp);

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Verify OTP and reset password
const verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: "Email, OTP, and new password are required" });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify OTP
    if (user.otp !== otp || user.otp_expiration < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await updateUserPassword(email, hashedPassword);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


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

module.exports = { registerUser, loginUser, requestPasswordReset, verifyOtpAndResetPassword };
