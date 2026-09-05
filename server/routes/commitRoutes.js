const express = require("express");

const {
  createCommit,
  getRepositoryCommits,
  getCommit,
  getFileHistory,
} = require("../controllers/commitController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createCommit);

router.get(
  "/repository/:repositoryId",
  protect,
  getRepositoryCommits
);

router.get("/file/:fileId", protect, getFileHistory);

router.get("/:id", protect, getCommit);

module.exports = router;