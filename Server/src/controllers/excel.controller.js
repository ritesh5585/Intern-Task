const { saveExcelData } = require("../services/excel.service");
const { getHierarchyById } = require("../services/hierarchy.service");
const fs = require("fs");

/**
 * POST /api/import/excel
 * Expects a file uploaded via multipart/form-data under field name "file"
 * (using multer or similar upstream in the route).
 */
async function importExcel(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    const stats = await saveExcelData(filePath);

    // clean up the uploaded temp file now that we're done with it
    fs.unlink(filePath, () => {});

    console.log(stats);
    return res.status(200).json({
      success: true,
      message: "Excel data imported successfully",
      stats: {
        totalRows: stats.totalRows,
        processed: stats.processed,
        skippedCount: stats.skipped.length,
        skipped: stats.skipped,
      },
    });
  } catch (err) {
    console.error("Import failed:", err);
    return res.status(500).json({
      success: false,
      message: "Import failed",
      error: err.message,
    });
  }
}

async function getHierarchy(req, res) {
  try {
    // fetch id from params
    const { id } = req.params;
    console.log("ID", id);
    // usme ek check lagao
    if (!id) {
      return res.status(400).json({
        message: "id is required",
      });
    }

    const data = await getHierarchyById(id);

    if (!data) {
      return res.status(404).json({
        message: `No TLM/SLM/FLM/MR found with id: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      level: data.level,
      data: data.data,
    });
  } catch (err) {
    console.error("Hierarchy fetch failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
}

module.exports = { importExcel, getHierarchy };
