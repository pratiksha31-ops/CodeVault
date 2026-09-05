const express = require("express");

const {
  createBranch,
  getRepositoryBranches,
  getBranch,
  deleteBranch,
} = require("../controllers/branchController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create branch
router.post("/", protect, createBranch);

// Get all branches of repository
router.get(
  "/repository/:repositoryId",
  protect,
  getRepositoryBranches
);

// Get one branch
router.get("/:id", protect, getBranch);

// Delete branch
router.delete("/:id", protect, deleteBranch);

module.exports = router;