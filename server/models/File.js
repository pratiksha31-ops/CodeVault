const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    path: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "text",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("File", fileSchema);