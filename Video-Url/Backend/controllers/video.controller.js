import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import slugify from "slugify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

export const uploadVideo = (req, res) => {
  try {
    const { companyName, productName } = req.body;

    if (!companyName || !productName || !req.file) {
      return res.status(400).json({
        message: "Company name, product name and video are required.",
      });
    }

    const companySlug = slugify(companyName, {
      lower: true,
      strict: true,
    });

    const productSlug = slugify(productName, {
      lower: true,
      strict: true,
    });

    const downloadUrl = `http://localhost:5173/${companySlug}/${productSlug}`;

    const metadata = {
      companyName,
      productName,
      companySlug,
      productSlug,
      fileName: req.file.filename,
      originalName: req.file.originalname,
    };

    const metadataFile = path.join(
      uploadDir,
      `${companySlug}_${productSlug}.json`,
    );

    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

    return res.status(201).json({
      success: true,
      url: downloadUrl,
    });
  } catch (error) {
    console.error("Upload video error:", error);

    return res.status(500).json({
      message: "Upload failed.",
    });
  }
};

export const getDownloadUrl = (req, res) => {
  try {
    const { company, product } = req.params;

    const metadataFile = path.join(uploadDir, `${company}_${product}.json`);

    if (!fs.existsSync(metadataFile)) {
      return res.status(404).send("Video not found.");
    }

    const metadata = JSON.parse(fs.readFileSync(metadataFile, "utf8"));

    const videoPath = path.join(uploadDir, metadata.fileName);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).send("Video file not found.");
    }

    return res.download(videoPath, metadata.originalName);
  } catch (error) {
    console.error("Download video error:", error);

    return res.status(500).send("Download failed.");
  }
};
