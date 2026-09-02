const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createRepository,
  getRepositories,
  getRepository,
} = require("../controllers/repositoryController");

const router = express.Router();

router.post("/", protect, createRepository);

router.get("/", protect, getRepositories);

router.get("/:id", protect, getRepository);

module.exports = router;