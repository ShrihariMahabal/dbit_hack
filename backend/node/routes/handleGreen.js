const express = require("express");
const router = express.Router();
const { updateSteps } = require("../controllers/handleGreen");
router.route("/updateSteps").post(updateSteps);
module.exports = router;
