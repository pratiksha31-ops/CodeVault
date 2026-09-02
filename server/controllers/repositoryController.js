const Repository = require("../models/Repository");

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
      description,
      visibility,
      owner: req.userId,
    });

    res.status(201).json({
      message: "Repository created successfully",
      repository,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create repository",
      error: error.message,
    });
  }
};

const getRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find({
      owner: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.json(repositories);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch repositories",
    });
  }
};

const getRepository = async (req, res) => {
  try {
    const repository = await Repository.findById(
      req.params.id
    ).populate(
      "owner",
      "name username avatar"
    );

    if (!repository) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    res.json(repository);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch repository",
    });
  }
};

module.exports = {
  createRepository,
  getRepositories,
  getRepository,
};