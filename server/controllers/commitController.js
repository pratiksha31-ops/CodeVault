const Commit = require("../models/Commit");
const File = require("../models/File");
const Repository = require("../models/Repository");
const Branch = require("../models/Branch");

// CREATE COMMIT
const createCommit = async (req, res) => {
  try {
    const { repository, file, branch, message } = req.body;

    if (!repository || !file || !branch || !message || !message.trim()) {
      return res.status(400).json({
        message:
          "Repository, file, branch and commit message are required",
      });
    }

    // Check repository
    const repo = await Repository.findById(repository);

    if (!repo) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    // Check branch
    const branchData = await Branch.findById(branch);

    if (!branchData) {
      return res.status(404).json({
        message: "Branch not found",
      });
    }

    // Make sure branch belongs to repository
    if (branchData.repository.toString() !== repository.toString()) {
      return res.status(400).json({
        message: "Branch does not belong to this repository",
      });
    }

    // Check file
    const existingFile = await File.findById(file);

    if (!existingFile) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    // Make sure file belongs to repository
    if (
      existingFile.repository.toString() !==
      repository.toString()
    ) {
      return res.status(400).json({
        message: "File does not belong to this repository",
      });
    }

    // Make sure file belongs to selected branch
    if (
      existingFile.branch.toString() !==
      branch.toString()
    ) {
      return res.status(400).json({
        message: "File does not belong to this branch",
      });
    }

    // Create commit
    const commit = await Commit.create({
      repository,
      branch,
      file,
      author: req.user._id,
      message: message.trim(),
      content: existingFile.content,
    });

    const populatedCommit = await Commit.findById(commit._id)
      .populate("author", "name username")
      .populate("file", "name path")
      .populate("branch", "name isDefault");

    res.status(201).json({
      message: "Commit created successfully",
      commit: populatedCommit,
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
    const { repositoryId } = req.params;
    const { branch } = req.query;

    const filter = {
      repository: repositoryId,
    };

    // If branch is provided, filter commits by branch
    if (branch) {
      filter.branch = branch;
    }

    const commits = await Commit.find(filter)
      .populate("author", "name username")
      .populate("file", "name path")
      .populate("branch", "name isDefault")
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
      .populate("file", "name path")
      .populate("branch", "name isDefault");

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
      .populate("branch", "name isDefault")
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
  getRepositoryCommits,
  getCommit,
  getFileHistory,
};