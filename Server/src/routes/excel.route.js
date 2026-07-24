const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  importExcel,
  getHierarchy,
} = require("../controllers/excel.controller");
const uploadIMG = require("../middleware/upload");
const {
  uploadProfilePicture,
  getProfilePicture,
} = require("../controllers/profile.controller");

const router = express.Router();

// Store uploaded file temporarily on disk so xlsx can read it by path.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [".xlsx", ".xls"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Only .xlsx or .xls files are allowed"));
    }
    cb(null, true);
  },
});

// Middleware wrapper to handle upload errors and accept any field name (file, image, profilePic, etc.)
const handleUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File upload error",
      });
    }
    next();
  });
};

// POST /api/uploads/:id to upload profile image of user
router.post("/uploads/:id", handleUpload, uploadProfilePicture);

// router.get("/getMe/:id", getProfilePicture);

// POST /api/excel  (form-data, field name: "file")
router.post("/excel", upload.single("file"), importExcel);

// get /api/data/123 to get data according toh fetched data
router.get("/data/:id", getHierarchy);

module.exports = router;
