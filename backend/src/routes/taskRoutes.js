const express = require("express");
const {createTask, getTasks} = require("../controllers/taskController");
const {updateTask} = require("../controllers/teamMemberController");
const {authMiddleware} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createTask", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.put("/updateTask/:id", authMiddleware, updateTask);

module.exports = router;