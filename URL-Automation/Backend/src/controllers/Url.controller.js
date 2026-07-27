import {generateNginxUrl} from "../services/nginx.service.js"

export async function generateUrl(req, res) {
  try {
    const { name, company, video } = req.body;

    const result = await generateNginxUrl({ name, company, video });

    return res.status(200).json({
      success: true,
      url: result.url,
    });
  } catch (error) {
    console.error("generateUrl failed:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message || "Something went wrong while generating the URL",
    });
  }
}
