const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    defaultBranch: {
      type: String,
      default: "main",
    },

    stars: {
      type: Number,
      default: 0,
    },

    forks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Repository",
  repositorySchema
);