const Expense = require('../models/Expense');
const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  const categories = await Category.find({ userId: req.session.userId }).sort({ name: 1 });
  res.render('categories', { categories });
};

exports.addCategory = async (req, res) => {
  const name = (req.body.name || '').trim();
  const monthlyLimit = Number(req.body.monthlyLimit || 0);

  if (!name) return res.redirect('/categories');

  const exists = await Category.findOne({ userId: req.session.userId, name });
  if (!exists) {
    await Category.create({ userId: req.session.userId, name, monthlyLimit });
  }

  res.redirect('/categories');
};

exports.updateCategory = async (req, res) => {
  const monthlyLimit = Number(req.body.monthlyLimit || 0);

  await Category.findOneAndUpdate(
    { _id: req.params.id, userId: req.session.userId },
    { monthlyLimit }
  );

  res.redirect('/categories');
};

exports.deleteCategory = async (req, res) => {
  await Category.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
  res.redirect('/categories');
};

exports.getCategoriesSummary = async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || (now.getMonth() + 1);
  const year = Number(req.query.year) || now.getFullYear();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const expenses = await Expense.find({
    userID: req.session.userId,
    date: { $gte: start, $lte: end }
  });

  const userCategories = await Category.find({ userId: req.session.userId });

  const totalsMap = {};
  expenses.forEach(e => {
    const cat = e.category || 'Other';
    const amt = Number(e.amount) || 0;
    totalsMap[cat] = (totalsMap[cat] || 0) + amt;
  });

  const categories = Object.keys(totalsMap)
    .map(name => {
      const match = userCategories.find(c => c.name === name);
      const total = totalsMap[name];
      const monthlyLimit = match ? Number(match.monthlyLimit || 0) : 0;

      return {
        name,
        total,
        monthlyLimit,
        status: (monthlyLimit && total > monthlyLimit) ? 'Over limit' : 'Within limit'
      };
    })
    .sort((a, b) => b.total - a.total);

  const grandTotal = categories.reduce((s, c) => s + c.total, 0);

  res.render('categories-summary', { categories, grandTotal, month, year });
};
