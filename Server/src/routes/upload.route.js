const express = require("express");
const upload = require("../middleware/upload")
const { uploadProfilePicture, getProfilePicture } = require("../controllers/profile.controller");

const router = express.Router();

// POST /api/images/uploads/:id to upload profile image of user
router.post("/uploads/:id", upload.single("file"), uploadProfilePicture);

router.get('getMe/:id', getProfilePicture)

module.exports = router;
