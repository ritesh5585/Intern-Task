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
    cb(null, `${req.params.id || "upload"}-${Date.now()}${ext}`);
  },
});

const uploadIMG = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  
fileFilter: (req, file, cb) => {
  console.log("Actual mimetype received:", file.mimetype);

  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/pjpeg"];
  const allowedExts = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();

  const mimeOk = allowedMimes.includes(file.mimetype);
  const extOk = allowedExts.includes(ext);

  // agar dono me se ek bhi match kare, to accept karo —
  // kyunki mimetype ya extension, koi bhi galat/missing ho sakta hai client ki taraf se
  if (!mimeOk && !extOk) {
    return cb(new Error("Only jpeg, jpg, png, or webp images are allowed"), false);
  }
  cb(null, true);
},
});

module.exports = uploadIMG;
