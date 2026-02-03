const express = require('express');
const router = express.Router();

const requireLogin = require('../middleware/requireLogin');
const expensesController = require('../controllers/expensesController');

router.get('/expenses', requireLogin, expensesController.getExpenses);
router.post('/add-expense', requireLogin, expensesController.postAddExpense);
router.get('/delete-expense/:id', requireLogin, expensesController.getDeleteExpense);
router.post('/add-expense', requireLogin, expensesController.addExpense);


module.exports = router;
