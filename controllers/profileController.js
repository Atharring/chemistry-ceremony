const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.session.userId).lean();

  res.render('profile', {
    username: req.session.username,
    monthlySalary: user?.monthlySalary ?? 0,
    msg: null,
    err: null
  });
};

exports.getSalary = async (req, res) => {
  const user = await User.findById(req.session.userId).lean();

  res.render('salary', {
    username: req.session.username,
    monthlySalary: user?.monthlySalary ?? 0,
    msg: null,
    err: null
  });
};

exports.postSalary = async (req, res) => {
  const monthlySalary = Number(req.body.monthlySalary);

  if (!Number.isFinite(monthlySalary) || monthlySalary < 0) {
    const user = await User.findById(req.session.userId).lean();
    return res.render('salary', {
      username: req.session.username,
      monthlySalary: user?.monthlySalary ?? 0,
      msg: null,
      err: 'Enter a valid salary (0 or more).'
    });
  }

  await User.findByIdAndUpdate(req.session.userId, { monthlySalary });

  res.render('salary', {
    username: req.session.username,
    monthlySalary,
    msg: 'Salary updated.',
    err: null
  });
};


exports.postChangePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.render('profile', {
      username: req.session.username,
      monthlySalary: 0,
      msg: null,
      err: 'Fill all fields'
    });
  }

  if (newPassword.length < 6) {
    return res.render('profile', {
      username: req.session.username,
      monthlySalary: 0,
      msg: null,
      err: 'Password must be at least 6 characters'
    });
  }

  if (newPassword !== confirmPassword) {
    return res.render('profile', {
      username: req.session.username,
      monthlySalary: 0,
      msg: null,
      err: 'Passwords do not match'
    });
  }

  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.render('profile', {
      username: req.session.username,
      monthlySalary: 0,
      msg: null,
      err: 'User not found'
    });
  }

  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.render('profile', {
      username: req.session.username,
      monthlySalary: user.monthlySalary ?? 0,
      msg: null,
      err: 'Old password is incorrect'
    });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.render('profile', {
    username: req.session.username,
    monthlySalary: user.monthlySalary ?? 0,
    msg: 'Password updated successfully',
    err: null
  });
};
