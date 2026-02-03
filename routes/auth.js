const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const requireLogin = require("../middleware/requireLogin");

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/dashboard", requireLogin, authController.getDashboard);
router.post("/dashboard/rate", requireLogin, authController.postRate);
router.post("/dashboard/best-speaker", requireLogin, authController.postBestSpeaker);
router.get("/results/best-speaker", requireLogin, authController.getBestSpeakerResults);


module.exports = router;
