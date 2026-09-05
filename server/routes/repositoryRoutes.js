const express = require("express");

const {
  createRepository,
  getRepositories,
  getRepository,
} = require("../controllers/repositoryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createRepository);

router.get("/", protect, getRepositories);

router.get("/:id", protect, getRepository);

module.exports = router;