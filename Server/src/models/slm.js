const mongoose = require("mongoose");

const { Schema } = mongoose;

const slmSchema = new Schema(
  {
    SlmId: {
      type: String,
      required: true,
      index: true,
    },
    SlmName: {
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
    tlm: {
      type: Schema.Types.ObjectId,
      ref: "TLM",
    }, // parent back-reference (optional but handy)
    flms: [
      {
        type: Schema.Types.ObjectId,
        ref: "FLM",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("SLM", slmSchema);
