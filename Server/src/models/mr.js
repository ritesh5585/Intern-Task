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
