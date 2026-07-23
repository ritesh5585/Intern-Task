const mongoose = require("mongoose");
const { Schema } = mongoose;

const flmSchema = new Schema(
  {
    FlmId: { type: String, unique: true, index: true },
    FlmName: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    HQ: {
      type: String,
    },
    Region: {
      type: String,
    },
    slm: {
      type: Schema.Types.ObjectId,
      ref: "SLM",
    }, // parent back-reference
    mrs: [
      {
        type: Schema.Types.ObjectId,
        ref: "MR",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("FLM", flmSchema);
