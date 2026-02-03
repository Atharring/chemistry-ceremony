const express = require('express');
const router = express.Router();

const requireLogin = require('../middleware/requireLogin');
const profileController = require('../controllers/profileController');

router.get('/profile', requireLogin, profileController.getProfile);

router.get('/profile/salary', requireLogin, profileController.getSalary);
router.post('/profile/salary', requireLogin, profileController.postSalary);

router.post('/profile/change-password', requireLogin, profileController.postChangePassword);

module.exports = router;

