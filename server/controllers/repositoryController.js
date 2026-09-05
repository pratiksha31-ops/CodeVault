const Repository = require("../models/Repository");

// CREATE REPOSITORY
const createRepository = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Repository name is required",
      });
    }

    const repository = await Repository.create({
      name,
      description: description || "",
      visibility: visibility || "public",
      owner: req.user._id,
    });

    res.status(201).json({
      message: "Repository created successfully",
      repository,
    });
  } catch (error) {
    console.error("Create repository error:", error);

    res.status(500).json({
      message: "Failed to create repository",
      error: error.message,
    });
  }
};

// GET ALL REPOSITORIES
const getRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      repositories,
    });
  } catch (error) {
    console.error("Get repositories error:", error);

    res.status(500).json({
      message: "Failed to fetch repositories",
      error: error.message,
    });
  }
};

// GET ONE REPOSITORY
const getRepository = async (req, res) => {
  try {
    const repository = await Repository.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!repository) {
      return res.status(404).json({
        message: "Repository not found or access denied",
      });
    }

    res.status(200).json({
      repository,
    });
  } catch (error) {
    console.error("Get repository error:", error);

    res.status(500).json({
      message: "Failed to fetch repository",
      error: error.message,
    });
  }
};

module.exports = {
  createRepository,
  getRepositories,
  getRepository,
};