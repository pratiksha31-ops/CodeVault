const File = require("../models/File");
const Repository = require("../models/Repository");

const createFile = async (req, res) => {
  try {
    const { repository, name, path, content } = req.body;

    if (!repository || !name || !path) {
      return res.status(400).json({
        message: "Repository, name and path are required",
      });
    }

    const repo = await Repository.findById(repository);

    if (!repo) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    const file = await File.create({
      repository: repo._id,
      name,
      path,
      content: content || "",
    });

    res.status(201).json({
      message: "File created successfully",
      file,
    });
  } catch (error) {
    console.error("Create file error:", error);

    res.status(500).json({
      message: "Failed to create file",
      error: error.message,
    });
  }
};

module.exports = {
  createFile,
};