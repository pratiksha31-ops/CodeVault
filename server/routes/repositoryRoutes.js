const express = require("express");

const {
  createRepository,
  getRepositories,
  getRepository,
  getRepositoryStats,
} = require("../controllers/repositoryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createRepository);

router.get("/", protect, getRepositories);

router.get("/:id", protect, getRepository);

router.get(
  "/:repositoryId/stats",
  protect,
  getRepositoryStats
);

router.get("/:id", protect, getRepository);

module.exports = router;

router.get(
  "/:repositoryId/stats",
  protect,
  getRepositoryStats
);
