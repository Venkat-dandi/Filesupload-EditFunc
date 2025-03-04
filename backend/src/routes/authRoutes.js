const express = require("express");
const {register, login, getProfile, logout} = require("../controllers/authController");
const {authMiddleware} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;