const Expense = require('../models/Expense');
const Category = require('../models/Category');

exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find({ userID: req.session.userId }).sort({ date: -1 });
  const categories = await Category.find({ userId: req.session.userId }).sort({ name: 1 });

  const fallback = [{ name: "Food" }, { name: "Transport" }, { name: "Shopping" }];

  res.render('expenses', {
    expenses,
    categories: categories.length ? categories : fallback
  });
};

exports.postAddExpense = async (req, res) => {
  await Expense.create({
    ...req.body,
    amount: Number(req.body.amount || 0),
    userID: req.session.userId
  });

  res.redirect('/expenses');
};

exports.getDeleteExpense = async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.redirect('/expenses');
};

exports.addExpense = async (req, res) => {
  await Expense.create({
    userID: req.session.userId,
    description: (req.body.description || '').trim(),
    category: req.body.category,
    amount: Number(req.body.amount || 0),
    date: req.body.date ? new Date(req.body.date) : new Date()
  });

  res.redirect('/expenses');
};
