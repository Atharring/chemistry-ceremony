const Attendee = require("../models/Attendee");

exports.getLogin = (req, res) => {
  res.render("login");
};

exports.postLogin = async (req, res) => {
  const { name, email, phone, organization } = req.body;

  // Save attendee to MongoDB
  await Attendee.create({ name, email, phone, organization });

  const attendee = await Attendee.create({ name, email, phone, organization });

req.session.user = { name, email, phone, organization };
req.session.attendeeId = attendee._id; // ✅ important
return res.redirect("/dashboard");


 
};

exports.getWelcome = (req, res) => {
  res.render("welcome", {
    user: req.session.user,
  });
};

exports.getDashboard = (req, res) => {
  const speakers = ["Dr. Ahmad", "Dr. Lina", "Eng. Sara", "Mr. Omar"];

  res.render("dashboard", {
    user: req.session.user,
    speakers,
    ratings: req.session.ratings || null,
    bestSpeaker: req.session.bestSpeaker || null,
  });
};

exports.postRate = (req, res) => {
  const { rating } = req.body;
  req.session.rating = rating;
  return res.redirect("/dashboard");
};

exports.getBestSpeakerResults = async (req, res) => {
  const results = await Attendee.aggregate([
    { $match: { bestSpeaker: { $ne: null } } },
    { $group: { _id: "$bestSpeaker", votes: { $sum: 1 } } },
    { $sort: { votes: -1 } },
  ]);

  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
  const winner = results.length ? results[0] : null;

  res.render("best-speaker-results", {
    results,
    totalVotes,
    winner,
  });
};



exports.postBestSpeaker = async (req, res) => {
  const { bestSpeaker } = req.body;

  await Attendee.findByIdAndUpdate(
    req.session.attendeeId,
    { bestSpeaker },
    { new: true }
  );

  req.session.bestSpeaker = bestSpeaker;
  return res.redirect("/dashboard");
};

exports.postRate = async (req, res) => {
  const ratings = {
    organization: req.body.q1,
    speakers: req.body.q2,
    relevance: req.body.q3,
    timing: req.body.q4,
    overall: req.body.q5,
  };

  // Save in session for now
  req.session.ratings = ratings;

  // Later you can save this to MongoDB
  console.log("Ceremony ratings:", ratings);

  return res.redirect("/dashboard");
};
