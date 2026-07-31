import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {uploadVideo, getDownloadUrl} from "./controllers/video.controller.js";

const app = express();

app.use(express.json());

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("video"), uploadVideo);
app.get("/api/download/:company/:product", getDownloadUrl);
function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/*
--------------------------------------------------
SERVER
--------------------------------------------------
*/

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
