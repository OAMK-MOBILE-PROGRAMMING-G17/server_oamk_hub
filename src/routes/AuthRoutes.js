const express = require("express");
const { registerUser, loginUser } = require("../controllers/AuthController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();
// Middleware to parse x-www-form-urlencoded data
router.use(express.urlencoded({ extended: true }));

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route example
router.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Welcome to your profile!", user: req.user });
});

module.exports = router;