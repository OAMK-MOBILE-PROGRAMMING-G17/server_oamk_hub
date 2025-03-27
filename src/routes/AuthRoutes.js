const express = require("express");
const { registerUser } = require("../controllers/AuthController");

const authRouter = express.Router();

authRouter.post("/register", registerUser);

module.exports = authRouter;
