const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    req.user = decoded; // Attach decoded token payload to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

module.exports = authenticateToken;