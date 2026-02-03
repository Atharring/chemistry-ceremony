module.exports = (req, res, next) => {
  console.log("requireLogin session user:", req.session.user);
  if (!req.session.user) return res.redirect("/login");
  next();
};
