const express = require("express");
const { registerUser, loginUser, requestPasswordReset, verifyOtpAndResetPassword, logoutUser } = require("../controllers/AuthController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();
// Middleware to parse x-www-form-urlencoded data
router.use(express.urlencoded({ extended: true }));

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", requestPasswordReset); // Request password reset (send OTP)
router.post("/verify-otp", verifyOtpAndResetPassword); // Verify OTP and reset password

// Protected route example
router.post("/logout", authenticateToken, logoutUser); // Logout route
router.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Welcome to your profile!", user: req.user });
});

module.exports = router;