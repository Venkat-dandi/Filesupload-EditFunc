const express = require("express");
const {createProject, getProjects, getProjectLeaders} = require("../controllers/projectController");
const {authMiddleware} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createProject", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.get("/leaders", authMiddleware, getProjectLeaders);

module.exports = router;