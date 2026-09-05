const File = require("../models/File");
const Repository = require("../models/Repository");

// CREATE FILE
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

// GET ALL FILES OF A REPOSITORY
const getFilesByRepository = async (req, res) => {
  try {
    const files = await File.find({
      repository: req.params.repositoryId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      files,
    });
  } catch (error) {
    console.error("Get files error:", error);

    res.status(500).json({
      message: "Failed to fetch files",
      error: error.message,
    });
  }
};

// GET ONE FILE
const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    res.status(200).json({
      file,
    });
  } catch (error) {
    console.error("Get file error:", error);

    res.status(500).json({
      message: "Failed to fetch file",
      error: error.message,
    });
  }
};

module.exports = {
  createFile,
  getFilesByRepository,
  getFile,
};

// UPDATE FILE
const updateFile = async (req, res) => {
  try {
    const { name, path, content } = req.body;

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    if (name !== undefined) {
      file.name = name;
    }

    if (path !== undefined) {
      file.path = path;
    }

    if (content !== undefined) {
      file.content = content;
    }

    await file.save();

    res.status(200).json({
      message: "File updated successfully",
      file,
    });
  } catch (error) {
    console.error("Update file error:", error);

    res.status(500).json({
      message: "Failed to update file",
      error: error.message,
    });
  }
};

// DELETE FILE
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete file error:", error);

    res.status(500).json({
      message: "Failed to delete file",
      error: error.message,
    });
  }
};

module.exports = {
  createFile,
  getFilesByRepository,
  getFile,
  updateFile,
  deleteFile,
};