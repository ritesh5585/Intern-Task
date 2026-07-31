import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadVideo, getDownloadUrl } from "./controllers/video.controller.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");
const app = express();

app.use(express.json());
app.use(cors());

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

app.listen(3000, () => {
    console.log(`API running on http://localhost:3000`);
});
