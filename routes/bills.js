const express = require('express');
const router = express.Router();

const requireLogin = require('../middleware/requireLogin');
const billsController = require('../controllers/billsController');

router.get('/bills', requireLogin, billsController.getBills);

router.post('/bills', requireLogin, billsController.addBill);

module.exports = router;
