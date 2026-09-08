const Branch = require("../models/Branch");
const Repository = require("../models/Repository");

// CREATE BRANCH
const createBranch = async (req, res) => {
  try {
    const { name, repository } = req.body;

    if (!name || !repository) {
      return res.status(400).json({
        message: "Branch name and repository are required",
      });
    }

    const repo = await Repository.findById(repository);

    if (!repo) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    const existingBranch = await Branch.findOne({
      name,
      repository,
    });

    if (existingBranch) {
      return res.status(400).json({
        message: "Branch already exists",
      });
    }

    const branch = await Branch.create({
      name,
      repository,
      createdBy: req.user._id,
      isDefault: false,
    });

    res.status(201).json({
      message: "Branch created successfully",
      branch,
    });
  } catch (error) {
    console.error("Create branch error:", error);

    res.status(500).json({
      message: "Failed to create branch",
      error: error.message,
    });
  }
};

// GET ALL BRANCHES OF REPOSITORY
const getRepositoryBranches = async (req, res) => {
  try {
    const branches = await Branch.find({
      repository: req.params.repositoryId,
    })
      .populate("createdBy", "name username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      branches,
    });
  } catch (error) {
    console.error("Get branches error:", error);

    res.status(500).json({
      message: "Failed to fetch branches",
      error: error.message,
    });
  }
};

// GET ONE BRANCH
const getBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id)
      .populate("createdBy", "name username")
      .populate("repository", "name");

    if (!branch) {
      return res.status(404).json({
        message: "Branch not found",
      });
    }

    res.status(200).json({
      branch,
    });
  } catch (error) {
    console.error("Get branch error:", error);

    res.status(500).json({
      message: "Failed to fetch branch",
      error: error.message,
    });
  }
};

// DELETE BRANCH
const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({
        message: "Branch not found",
      });
    }

    if (branch.isDefault) {
      return res.status(400).json({
        message: "Default branch cannot be deleted",
      });
    }

    await Branch.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Branch deleted successfully",
    });
  } catch (error) {
    console.error("Delete branch error:", error);

    res.status(500).json({
      message: "Failed to delete branch",
      error: error.message,
    });
  }
};

module.exports = {
  createBranch,
  getRepositoryBranches,
  getBranch,
  deleteBranch,
};