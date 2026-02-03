const Expense = require('../models/Expense');

exports.getReports = async (req, res) => {
  const month = parseInt(req.query.month, 10) || (new Date().getMonth() + 1);
  const year = parseInt(req.query.year, 10) || (new Date().getFullYear());
  const dayRaw = req.query.day;
  const day = dayRaw ? parseInt(dayRaw, 10) : null;

  const expenses = await Expense.find({ userID: req.session.userId }).sort({ date: -1 });

  const filtered = expenses.filter(e => {
    const d = new Date(e.date);
    const okYear = d.getFullYear() === year;
    const okMonth = (d.getMonth() + 1) === month;
    const okDay = day ? d.getDate() === day : true;
    return okYear && okMonth && okDay;
  });

  const total = filtered.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  res.render('reports', { expenses: filtered, total, month, year, day });
};
