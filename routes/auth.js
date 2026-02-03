const express = require("express");
const router = express.Router();

const auth = require("../controllers/authController"); // ✅ THIS WAS MISSING
const requireLogin = require("../middleware/requireLogin");

// Login
router.get("/login", auth.getLogin);
router.post("/login", auth.postLogin);

// Welcome (main page)
router.get("/welcome", requireLogin, auth.getWelcome);

// Best speaker
router.post("/best-speaker", requireLogin, auth.postBestSpeaker);
router.get("/results/best-speaker", requireLogin, auth.getBestSpeakerResults);

// Ratings
router.post("/rate", requireLogin, auth.postRate);

module.exports = router;
