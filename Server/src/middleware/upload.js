const multer = require("multer");
const path = require("path");
const fs = require("fs");

// diskStorage saves the actual file onto the server's filesystem
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads/images");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.params.id || 'upload'}-${Date.now()}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/pjpeg"];
        // if (!allowed.includes(file.mimetype)) {
        //     return cb(new Error("Only jpeg, jpg, png, or webp images are allowed"), false);
        // }
        cb(null, true);
    },
});

module.exports = upload;