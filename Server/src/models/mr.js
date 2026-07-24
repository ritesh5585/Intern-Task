const mongoose = require("mongoose");
const { Schema } = mongoose;

const mrSchema = new Schema(
  {
    MrId: {
      type: String,
      required: true,
      index: true,
    },
    MrName: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    four: {
      type: Number,
      default: 0,
    },
    six: {
      type: Number,
      default: 0,
    },
    run: {
      type: Number,
      default: 0,
    },
    HQ: {
      type: String,
    },
    Region: {
      type: String,
    },
    flm: {
      type: Schema.Types.ObjectId,
      ref: "FLM",
    }, // parent back-reference
  },
  { timestamps: true },
);

module.exports = mongoose.model("MR", mrSchema);
