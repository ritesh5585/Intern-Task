import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { uploadVideo, getDownloadUrl } from "./controllers/video.controller.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("video"), uploadVideo);
app.get("/api/download/:company/:product", getDownloadUrl);

app.listen(3000, () => {
  console.log(`API running on http://localhost:3000`);
});
