const Commit = require("../models/Commit");
const File = require("../models/File");
const Repository = require("../models/Repository");

// CREATE COMMIT
const createCommit = async (req, res) => {
  try {
    const { repository, file, message } = req.body;

    if (!repository || !file || !message || !message.trim()) {
      return res.status(400).json({
        message: "Repository, file and commit message are required",
      });
    }

    const repo = await Repository.findById(repository);

    if (!repo) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    const existingFile = await File.findById(file);

    if (!existingFile) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const commit = await Commit.create({
      repository,
      file,
      author: req.user._id,
      message,
      content: existingFile.content,
    });

    res.status(201).json({
      message: "Commit created successfully",
      commit,
    });
  } catch (error) {
    console.error("Create commit error:", error);

    res.status(500).json({
      message: "Failed to create commit",
      error: error.message,
    });
  }
};

// GET COMMITS OF A REPOSITORY
const getRepositoryCommits = async (req, res) => {
  try {
    const commits = await Commit.find({
      repository: req.params.repositoryId,
    })
      .populate("author", "name username")
      .populate("file", "name path")
      .sort({ createdAt: -1 });

    res.status(200).json({
      commits,
    });
  } catch (error) {
    console.error("Get commits error:", error);

    res.status(500).json({
      message: "Failed to fetch commits",
      error: error.message,
    });
  }
};

// GET ONE COMMIT
const getCommit = async (req, res) => {
  try {
    const commit = await Commit.findById(req.params.id)
      .populate("author", "name username")
      .populate("file", "name path");

    if (!commit) {
      return res.status(404).json({
        message: "Commit not found",
      });
    }

    res.status(200).json({
      commit,
    });
  } catch (error) {
    console.error("Get commit error:", error);

    res.status(500).json({
      message: "Failed to fetch commit",
      error: error.message,
    });
  }
};

// GET FILE VERSION HISTORY
const getFileHistory = async (req, res) => {
  try {
    const commits = await Commit.find({
      file: req.params.fileId,
    })
      .populate("author", "name username")
      .populate("file", "name path")
      .sort({ createdAt: -1 });

    res.status(200).json({
      fileHistory: commits,
    });
  } catch (error) {
    console.error("Get file history error:", error);

    res.status(500).json({
      message: "Failed to fetch file history",
      error: error.message,
    });
  }
};

module.exports = {
  createCommit,
};

module.exports = {
  createCommit,
  getRepositoryCommits,
};

module.exports = {
  createCommit,
  getRepositoryCommits,
  getCommit,
};

module.exports = {
  createCommit,
  getRepositoryCommits,
  getCommit,
  getFileHistory,
};