const express = require("express");

const {
  createFile,
  getFilesByRepository,
  getFile,
  updateFile,
  deleteFile,
} = require("../controllers/fileController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a file
router.post("/", protect, createFile);

// Get all files of a repository
router.get("/repository/:repositoryId", protect, getFilesByRepository);

// Get one file
router.get("/:id", protect, getFile);

// Update a file
router.put("/:id", protect, updateFile);

// Delete a file
router.delete("/:id", protect, deleteFile);

module.exports = router;