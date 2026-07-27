const {
  saveProfilePic,
  getProfilePic,
} = require("../services/profile.service");
const MR = require("../models/mr")

/**
 * POST /api/images/uploads/:id
 * multer (upload.single("image")) must run before this — it puts the
 * file on req.file as { buffer, mimetype, originalname, ... }
 */
async function uploadProfilePicture(req, res) {
  try {
    const { id } = req.params;
    const file = req.file || (req.files && req.files[0]);

    console.log("req.file:", req.file);
    console.log("req.params.id:", req.params.id);

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    const updated = await saveProfilePic(id, file);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `No user found with id: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture saved",
      userId: updated._id,
      profilePicUrl: updated.profilePic,
    });
  } catch (err) {
    console.error("Profile upload failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
}

/**
 * GET /api/images/getMe/:id/picture
 * Returns the stored path/URL as JSON. The actual image bytes are
 * served separately by express.static (see app.js wiring below) —
 * this endpoint just tells you where to find it.
 */
async function getProfilePicture(req, res) {
  try {
    const { id } = req.params;

    const profilePicUrl = await getProfilePic(id);

    if (!profilePicUrl) {
      return res
        .status(404)
        .json({ success: false, message: "No profile picture found" });
    }

    return res.status(200).json({ success: true, profilePicUrl });
  } catch (err) {
    console.error("Profile fetch failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
}

/**
 * POST /api/runs/brans/:id
 */
async function updateScore(req, res) {
  try {
    const { id } = req.params;
    const { brand } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file uploaded" });
    }
    
    if (!["A", "B"].includes(brand)) {
      return res
        .status(400)
        .json({ success: false, message: "brand must be A or B" });
    }

    const mrDoc = await MR.findById(id); 

    if (!mrDoc) {
      return res
        .status(404)
        .json({ success: false, message: `No MR found with id: ${id}` });
    }

    const points = brand === "A" ? { four: 1, run: 4 } : { six: 1, run: 6 };
      const relativePath = `/uploads/images/${req.file.filename}`;
    
      const updated = await MR.findByIdAndUpdate(
        id,
        {
          profilePic: relativePath, // image bhi save
          $inc: points, // stats bhi update — same query me dono
        },
        { new: true },
      );
    
      return res.status(200).json({
        success: true,
        profilePicUrl: updated.profilePic,
        four: updated.four,
        six: updated.six,
        run: updated.run,
      });

  } catch (err) {
    console.error("Score update failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
}

module.exports = { uploadProfilePicture, getProfilePicture, updateScore };
