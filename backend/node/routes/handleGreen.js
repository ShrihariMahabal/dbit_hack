const express = require("express");
const router = express.Router();
const {
  updateSteps,
  updateCarbonFootprint,
} = require("../controllers/handleGreen");
router.route("/updateSteps").post(updateSteps);
router.route("/updateCarbonFootprint").post(updateCarbonFootprint);
module.exports = router;
