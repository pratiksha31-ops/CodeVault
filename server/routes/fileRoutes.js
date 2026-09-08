const express = require("express");

const {
  createFile,
  getFilesByRepository,
  getFile,
  updateFile,
  deleteFile,
  restoreFileVersion,
} = require("../controllers/fileController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE FILE
router.post("/", protect, createFile);

// GET ALL FILES OF REPOSITORY
router.get(
  "/repository/:repositoryId",
  protect,
  getFilesByRepository
);

// RESTORE FILE VERSION
router.post(
  "/:id/restore",
  protect,
  restoreFileVersion
);

// GET ONE FILE
router.get("/:id", protect, getFile);

// UPDATE FILE
router.put("/:id", protect, updateFile);

// DELETE FILE
router.delete("/:id", protect, deleteFile);

module.exports = router;