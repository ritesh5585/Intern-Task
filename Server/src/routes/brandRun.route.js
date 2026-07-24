const express = require("express");
const { updateScore } = require("../controllers/profile.controller");
const upload = require("../middleware/upload");

const router = express.Router();

// POST /api/runs/brans/:id
router.post("/brands/:id", upload.single("image"), updateScore);

module.exports = router;
