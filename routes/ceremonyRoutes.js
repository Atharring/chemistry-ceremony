const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const ceremonyController = require("../controllers/ceremonyController");

// pages
router.get("/welcome", requireLogin, ceremonyController.getWelcome);

// poster vote
router.get("/vote/poster", requireLogin, ceremonyController.getPosterVote);
router.post("/vote/poster", requireLogin, ceremonyController.postPosterVote);

// poster results
router.get("/results/poster", requireLogin, ceremonyController.getPosterResults);

module.exports = router;
