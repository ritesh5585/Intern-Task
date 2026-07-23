const TLM = require("../models/tlm");
const SLM = require("../models/slm");
const FLM = require("../models/flm");
const MR = require("../models/mr");

const MODELS = [TLM, SLM, FLM, MR];

async function findModelById(id) {
  const results = await Promise.all(
    MODELS.map((Model) => Model.findById(id).select("_id")),
  );

  const index = results.findIndex((doc) => doc !== null);
  if (index === -1) return null;

  return MODELS[index];
}

async function saveProfilePic(id, file) {
  const Model = await findModelById(id);
  if (!Model) return null;

  const relativePath = `/uploads/${file.filename}`;

  const updated = await Model.findByIdAndUpdate(
    id,
    { profilePic: relativePath },
    { new: true },
  ).select("_id profilePic");

  return updated;
}

async function getProfilePic(id) {
  const Model = await findModelById(id);
  if (!Model) return null;

  const doc = await Model.findById(id).select("profilePic");
  if (!doc || !doc.profilePic) return null;

  return doc.profilePic; // e.g. "/uploads/E00235-1721234567890.jpg"
}

module.exports = { saveProfilePic, getProfilePic };
