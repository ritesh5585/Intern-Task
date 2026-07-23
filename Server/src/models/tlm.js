const mongoose = require("mongoose");
const { Schema } = mongoose;

const tlmSchema = new Schema(
  {
    TlmId: {
      type: String,
      required: true,
      index: true,
    },
    TlmName: {
      type: String,
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
    slms: [
      {
        type: Schema.Types.ObjectId,
        ref: "SLM",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("TLM", tlmSchema);
