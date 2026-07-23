const TLM = require("../models/tlm");
const SLM = require("../models/slm");
const FLM = require("../models/flm");
const MR = require("../models/mr");
const readExcelFile = require("../utils/readExcel");

/**
 * Generic find-or-create for any of the 4 levels.
 * - Looks up by the unique id field (TlmId / SlmId / FlmId / MrId).
 * - Creates a new document if not found.
 * - Returns the document (existing or newly created).
 */
async function findOrCreate(Model, idField, idValue, buildData) {
  if (!idValue) return null; // skip rows with a blank id at this level

  let doc = await Model.findOne({ [idField]: idValue });
  if (!doc) {
    doc = await Model.create(buildData());
  }
  return doc;
}

/**
 * Adds a childId into parentDoc[arrayField] only if it isn't already there.
 * Equivalent to $addToSet but done in application code so we can skip a
 * redundant DB round trip when nothing actually changed.
 */
async function linkChild(ParentModel, parentDoc, arrayField, childId) {
  const alreadyLinked = parentDoc[arrayField].some(
    (id) => id.toString() === childId.toString(),
  );
  if (!alreadyLinked) {
    await ParentModel.updateOne(
      { _id: parentDoc._id },
      { $addToSet: { [arrayField]: childId } },
    );
  }
}

/**
 * Processes one Excel row: find-or-create TLM -> SLM -> FLM -> MR,
 * and wire up the parent/child references in both directions.
 */
async function processRow(row, stats) {
  // --- 1. TLM ---
  const tlm = await findOrCreate(TLM, "TlmId", row.TLMID, () => ({
    TlmId: row.TLMID,
    TlmName: row.TLMNAME,
    Password: row.TLMID, // matches the pattern seen in your data (Password === Id)
    HQ: row.TLMID || row.HQ || "",
  }));
  console.log(tlm);
  if (!tlm) {
    stats.skipped.push({ row, reason: "Missing TlmId" });
    return;
  }

  // --- 2. SLM ---
  const slm = await findOrCreate(SLM, "SlmId", row.SLMID, () => ({
    SlmId: row.SLMID,
    SlmName: row.SLMNAME,
    Password: row.SLMID,
    HQ: row.SlmHQ || row.HQ || "",
    Region: row.SlmRegion || row.Region || "",
    tlm: tlm._id,
  }));
  if (slm) {
    await linkChild(TLM, tlm, "slms", slm._id);
  }

  // --- 3. FLM ---
  let flm = null;
  if (slm) {
    flm = await findOrCreate(FLM, "FlmId", row.FLMID, () => ({
      FlmId: row.FLMID,
      FlmName: row.FLMNAME,
      Password: row.FLMID,
      HQ: row.FlmHQ || row.HQ || "",
      Region: row.FlmRegion || row.Region || "",
      slm: slm._id,
    }));
    if (flm) {
      await linkChild(SLM, slm, "flms", flm._id);
    }
  }

  // --- 4. MR ---
  if (flm) {
    const mr = await findOrCreate(MR, "MrId", row.MRID, () => ({
      MrId: row.MRID,
      MrName: row.MRNAME,
      Password: row.MRID,
      HQ: row.MrHQ || row.HQ || "",
      Region: row.MrRegion || row.Region || "",
      flm: flm._id,
    }));
    if (mr) {
      await linkChild(FLM, flm, "mrs", mr._id);
      stats.processed++;
    }
  }
}

/**
 * Entry point called by the controller.
 * Reads the Excel file, loops through every row, and imports it.
 * Rows are processed sequentially (not Promise.all) to avoid duplicate
 * find-or-create races on the same TLM/SLM/FLM appearing across many rows.
 */
async function saveExcelData(filePath) {
  const rows = readExcelFile(filePath);

  const stats = {
    totalRows: rows.length,
    processed: 0,
    skipped: [],
  };

  for (const row of rows) {
    try {
      await processRow(row, stats);
    } catch (err) {
      console.error("Error importing row:");
      console.error(row);
      console.error(err);

      stats.skipped.push({
        row,
        reason: err.message,
      });
    }
  }

  return stats;
}

module.exports = { saveExcelData };
