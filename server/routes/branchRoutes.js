const express = require("express");

const {
  createBranch,
  getRepositoryBranches,
  getBranch,
  deleteBranch,
} = require("../controllers/branchController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE BRANCH
router.post("/", protect, createBranch);

// GET ALL BRANCHES OF REPOSITORY
router.get(
  "/repository/:repositoryId",
  protect,
  getRepositoryBranches
);

// GET ONE BRANCH
router.get("/:id", protect, getBranch);

// DELETE BRANCH
router.delete("/:id", protect, deleteBranch);

module.exports = router;