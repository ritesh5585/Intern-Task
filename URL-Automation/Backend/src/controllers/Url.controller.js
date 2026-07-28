import { generateNginxUrl } from "../services/nginx.service.js";

export async function generateUrl(req, res) {
  try {
    const { name, company, video, dryRun } = req.body;
    
    const result = await generateNginxUrl({
      name,
      company,
      video,
      dryRun: Boolean(dryRun), // testing phase: send dryRun: true in Postman body
    });

    return res.status(200).json({
      success: true,
      ...result, // dryRun mode adds templateBlock/newBlock so you can eyeball it before trusting it
    });
  } catch (err) {
    console.error("generateUrl failed:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message || "Something went wrong while generating the URL",
    });
  }
}
