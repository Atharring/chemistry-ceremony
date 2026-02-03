const express = require('express');
const router = express.Router();

const requireLogin = require('../middleware/requireLogin');
const categoriesController = require('../controllers/categoriesController');

router.get('/categories', requireLogin, categoriesController.getCategories);
router.post('/categories/add', requireLogin, categoriesController.addCategory);
router.post('/categories/update/:id', requireLogin, categoriesController.updateCategory);
router.get('/categories/delete/:id', requireLogin, categoriesController.deleteCategory);
router.get('/categories-summary', requireLogin, categoriesController.getCategoriesSummary);

module.exports = router;
