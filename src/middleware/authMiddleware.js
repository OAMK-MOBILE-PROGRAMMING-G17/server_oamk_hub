const jwt = require("jsonwebtoken");
const { isTokenBlacklisted, removeExpiredTokens } = require("../models/TokenBlacklistModel");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Remove expired tokens from the blacklist
    await removeExpiredTokens();

    // Check if the token is blacklisted
    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      return res.status(403).json({ error: "Token is invalid or expired" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

module.exports = authenticateToken;