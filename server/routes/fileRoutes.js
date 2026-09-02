const express = require("express");
const { createFile } = require("../controllers/fileController");

const router = express.Router();

router.post("/", createFile);

module.exports = router;