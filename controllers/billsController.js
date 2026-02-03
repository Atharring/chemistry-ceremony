const Bill = require('../models/Bill');

exports.getBills = async (req, res) => {
  const bills = await Bill.find({
    userId: req.session.userId
  }).sort({ createdAt: -1 });

  res.render('bills', { bills });
};

exports.addBill = async (req, res) => {
  const { title, amount, dueDate } = req.body;

  if (!title || !amount || !dueDate) {
    return res.redirect('/bills');
  }

  await Bill.create({
    title,
    amount: Number(amount),
    dueDate,
    userId: req.session.userId
  });

  res.redirect('/bills');
};
