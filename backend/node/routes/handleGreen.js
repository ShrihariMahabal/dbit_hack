const express = require("express");
const router = express.Router();
const {
  updateSteps,
  updateCarbonFootprint,
  getSteps,
} = require("../controllers/handleGreen");
router.route("/updateSteps").post(updateSteps);
router.route("/updateCarbonFootprint").post(updateCarbonFootprint);
router.route("/getSteps").get(getSteps);
module.exports = router;
