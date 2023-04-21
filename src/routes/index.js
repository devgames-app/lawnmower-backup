const express = require("express");
const router = express.Router();

const { getBackup, showBackup } = require("../controllers/backup");
const { restoreBackup } = require("../controllers/restore");

router.get("/", showBackup);
router.get("/backup/:username", getBackup);
router.post("/restore/:newusername", restoreBackup);

module.exports = router;
