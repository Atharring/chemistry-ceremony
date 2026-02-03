const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const requireLogin = require("../middleware/requireLogin");

router.get("/login", auth.getLogin);
router.post("/login", auth.postLogin);

router.get("/welcome", requireLogin, auth.getWelcome);

router.post("/best-speaker", requireLogin, auth.postBestSpeaker);
router.post("/rate", requireLogin, auth.postRate);

router.get("/results/best-speaker", requireLogin, auth.getBestSpeakerResults);


module.exports = router;
