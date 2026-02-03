module.exports = (req, res, next) => {
  if (!req.session || !req.session.attendeeId) {
    return res.redirect("/login");
  }
  next();
};
