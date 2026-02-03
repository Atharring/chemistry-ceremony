const express = require('express');
const router = express.Router();

const requireLogin = require('../middleware/requireLogin');
const reportsController = require('../controllers/reportsController');

router.get('/reports', requireLogin, reportsController.getReports);

module.exports = router;
