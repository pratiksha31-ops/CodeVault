const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
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

    branch: {
      type: String,
      default: "main",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("File", fileSchema);