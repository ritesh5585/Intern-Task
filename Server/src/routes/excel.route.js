const express = require("express");
const multer = require("multer");
const path = require("path");
const { importExcel, getHierarchy } = require("../controllers/excel.controller");

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

// POST /api/excel  (form-data, field name: "file")
router.post("/excel", upload.single("file"), importExcel);
router.get("/data/:id", getHierarchy);

module.exports = router;
