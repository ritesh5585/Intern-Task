const mongoose = require("mongoose");
const TLM = require("../models/tlm");
const SLM = require("../models/slm");
const FLM = require("../models/flm");
const MR = require("../models/mr");

async function getHierarchyById(id) {
  // ObjectId format valid hai ya nahi, pehle check karo
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const [tlm, slm, flm, mr] = await Promise.all([
    TLM.findById(id).lean(),
    SLM.findById(id).lean(),
    FLM.findById(id).lean(),
    MR.findById(id).lean(),
  ]);

  if (tlm) {
    return {
      level: "TLM",
      data: await TLM.findById(id)
        .populate({
          path: "slms",
          populate: {
            path: "flms",
            populate: { path: "mrs" },
          },
        })
        .lean(),
    };
  }

  if (slm) {
    return {
      level: "SLM",
      data: await SLM.findById(id)
        .populate({
          path: "flms",
          populate: { path: "mrs" },
        })
        .lean(),
    };
  }

  if (flm) {
    return {
      level: "FLM",
      data: await FLM.findById(id).populate("mrs").lean(),
    };
  }

  if (mr) {
    return { level: "MR", data: mr };
  }

  return null;
}

module.exports = { getHierarchyById };