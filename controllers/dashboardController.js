const Expense = require("../models/Expense");
const Category = require("../models/Category");
const User = require("../models/User");

exports.getDashboard = async (req, res) => {
  const userId = req.session.userId;

  const user = await User.findById(userId);


  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const expenses = await Expense.find({
    userID: userId,
    date: { $gte: start, $lt: end }
  });

  const categories = await Category.find({ userID: userId });

  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const salary = user?.monthlySalary || 0;
  const remaining = salary - totalSpent;
  const spendRate = salary > 0 ? (totalSpent / salary) * 100 : 0;


  const advice = [];
  if (salary === 0) advice.push("Set your monthly salary to track your budget.");
  if (spendRate > 100) advice.push("You are spending more than your salary. That’s dangerous.");
  else if (spendRate > 80) advice.push("You spent more than 80% of your salary. Slow down.");
  else if (spendRate < 50 && salary > 0) advice.push("Nice. You still have more than half your salary left.");

  advice.push("Basic guideline: 50% needs, 30% wants, 20% savings (50/30/20 rule).");

  if (salary > 0 && (remaining / salary) > 0.2) {
    advice.push("If possible, move some money to an emergency fund (often 3–6 months of essential expenses).");
  }


  const categoryTotals = {};
  for (const e of expenses) {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + (e.amount || 0);
  }

  const warnings = [];
  for (const c of categories) {
    if (c.monthlyLimit && categoryTotals[c.name] > c.monthlyLimit) {
      warnings.push(`You exceeded the limit for ${c.name}.`);
    }
  }

  return res.render("dashboard", {
    user,
    totalSpent,
    salary,
    remaining,
    spendRate: spendRate.toFixed(1),
    advice,
    warnings
  });
};
