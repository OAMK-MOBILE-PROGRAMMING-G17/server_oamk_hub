const express = require("express");
const {
  registerUser,
  loginUser,
  requestPasswordResetOtp,
  verifyOtp,
  resetPassword,
  logoutUser,
} = require("../controllers/AuthController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to parse x-www-form-urlencoded data
router.use(express.urlencoded({ extended: true }));

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password/request-otp", requestPasswordResetOtp); // Request OTP for password reset
router.post("/reset-password/verify-otp", verifyOtp); // Verify OTP
router.post("/reset-password", resetPassword); // Reset password after OTP verification

// Protected routes
router.post("/logout", authenticateToken, logoutUser); // Logout route
router.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Welcome to your profile!", user: req.user });
});

module.exports = router;