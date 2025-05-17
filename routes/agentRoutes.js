// routes/agentRoutes.js
const express = require("express");
const router = express.Router();
const {
    createAgent,
    getAgents,
    updateAgent,
    deleteAgent
} = require("../controllers/agentController");
const { protect } = require("../middleware/auth");

// Protect all routes
router.use(protect);

// Agent routes
router.post("/", createAgent);
router.get("/", getAgents);
router.put("/:id", updateAgent);
router.delete("/:id", deleteAgent);

module.exports = router;
