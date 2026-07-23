const express = require("express");
const upload = require("../middleware/upload");
const { uploadProfilePicture, getProfilePicture } = require("../controllers/profile.controller");

const router = express.Router();

// Middleware wrapper to handle upload errors and accept any field name (file, image, profilePic, etc.)
const handleUpload = (req, res, next) => {
    upload.any()(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || "File upload error"
            });
        }
        next();
    });
};

// POST /api/images/uploads/:id to upload profile image of user
router.post("/uploads/:id", handleUpload, uploadProfilePicture);

router.get("/getMe/:id", getProfilePicture);

module.exports = router;
