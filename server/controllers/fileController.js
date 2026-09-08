const File = require("../models/File");
const Repository = require("../models/Repository");
const Branch = require("../models/Branch");
const Commit = require("../models/Commit");

// CREATE FILE
const createFile = async (req, res) => {
  try {
    const {
      repository,
      branch,
      name,
      path,
      content,
      language,
    } = req.body;

    if (!repository || !branch || !name || !path) {
      return res.status(400).json({
        message:
          "Repository, branch, name and path are required",
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

    // Make sure branch belongs to this repository
    if (
      branchData.repository.toString() !==
      repository.toString()
    ) {
      return res.status(400).json({
        message:
          "Branch does not belong to this repository",
      });
    }

    // Check if file already exists in this branch
    const existingFile = await File.findOne({
      repository,
      branch,
      path,
    });

    if (existingFile) {
      return res.status(400).json({
        message:
          "File already exists in this branch",
      });
    }

    const file = await File.create({
      repository,
      branch,
      name,
      path,
      content: content || "",
      language: language || "text",
    });

    res.status(201).json({
      message: "File created successfully",
      file,
    });
  } catch (error) {
    console.error(
      "Create file error:",
      error
    );

    res.status(500).json({
      message: "Failed to create file",
      error: error.message,
    });
  }
};

// GET ALL FILES OF REPOSITORY
const getFilesByRepository = async (req, res) => {
  try {
    const { repositoryId } = req.params;
    const { branch } = req.query;

    const filter = {
      repository: repositoryId,
    };

    // If branch is provided, filter files by branch
    if (branch) {
      filter.branch = branch;
    }

    const files = await File.find(filter)
      .populate("branch", "name isDefault")
      .sort({ createdAt: -1 });

    res.status(200).json({
      files,
    });
  } catch (error) {
    console.error(
      "Get files error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch files",
      error: error.message,
    });
  }
};

// GET ONE FILE
const getFile = async (req, res) => {
  try {
    const file = await File.findById(
      req.params.id
    ).populate(
      "branch",
      "name isDefault"
    );

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    res.status(200).json({
      file,
    });
  } catch (error) {
    console.error(
      "Get file error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch file",
      error: error.message,
    });
  }
};

// UPDATE FILE
const updateFile = async (req, res) => {
  try {
    const {
      name,
      path,
      content,
      language,
    } = req.body;

    const file = await File.findById(
      req.params.id
    );

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

    if (language !== undefined) {
      file.language = language;
    }

    await file.save();

    const updatedFile = await File.findById(
      file._id
    ).populate(
      "branch",
      "name isDefault"
    );

    res.status(200).json({
      message: "File updated successfully",
      file: updatedFile,
    });
  } catch (error) {
    console.error(
      "Update file error:",
      error
    );

    res.status(500).json({
      message: "Failed to update file",
      error: error.message,
    });
  }
};

// DELETE FILE
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(
      req.params.id
    );

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    await File.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete file error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete file",
      error: error.message,
    });
  }
};

// RESTORE FILE VERSION
const restoreFileVersion = async (req, res) => {
  try {
    const { commitId } = req.body;

    // Check commit ID
    if (!commitId) {
      return res.status(400).json({
        message: "Commit ID is required",
      });
    }

    // Find file
    const file = await File.findById(
      req.params.id
    );

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    // Find old commit
    const commit = await Commit.findById(
      commitId
    );

    if (!commit) {
      return res.status(404).json({
        message: "Commit not found",
      });
    }

    // Make sure commit belongs to this file
    if (
      commit.file.toString() !==
      file._id.toString()
    ) {
      return res.status(400).json({
        message:
          "Commit does not belong to this file",
      });
    }

    // Make sure commit belongs to the same branch
    if (
      commit.branch &&
      file.branch &&
      commit.branch.toString() !==
        file.branch.toString()
    ) {
      return res.status(400).json({
        message:
          "Commit does not belong to the file branch",
      });
    }

    // Restore old content
    file.content = commit.content;

    await file.save();

    // Create a new commit for the restore action
    const restoreCommit = await Commit.create({
      repository: file.repository,
      branch: file.branch,
      file: file._id,
      author: req.user._id,
      message: `Restore version: ${
        commit.message || "Previous version"
      }`,
      content: file.content,
    });

    // Populate restore commit information
    const populatedRestoreCommit =
      await Commit.findById(
        restoreCommit._id
      )
        .populate(
          "author",
          "name username"
        )
        .populate(
          "file",
          "name path"
        )
        .populate(
          "branch",
          "name isDefault"
        );

    // Get restored file
    const restoredFile =
      await File.findById(
        file._id
      ).populate(
        "branch",
        "name isDefault"
      );

    res.status(200).json({
      message:
        "File version restored and new restore commit created successfully",
      file: restoredFile,
      commit: populatedRestoreCommit,
    });
  } catch (error) {
    console.error(
      "Restore version error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to restore file version",
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
  restoreFileVersion,
};