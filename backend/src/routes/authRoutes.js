const express = require("express");
const { register, login, getProfile, logout } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authMiddleware, getProfile);

// ✅ Fetch logged-in user details
router.get("/me", authMiddleware, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Fetch all users (Required for chat)
router.get("/users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("name _id role");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

module.exports = router;