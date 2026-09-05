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

router.post("/", protect, createFile);

router.get(
  "/repository/:repositoryId",
  protect,
  getFilesByRepository
);

router.get("/:id", protect, getFile);

router.put("/:id", protect, updateFile);

router.delete("/:id", protect, deleteFile);

router.post(
  "/:id/restore",
  protect,
  restoreFileVersion
);

module.exports = router;