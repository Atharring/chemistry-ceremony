const Attendee = require("../models/Attendee");

// GET /login
exports.getLogin = (req, res) => {
  res.render("login");
};

// POST /login
exports.postLogin = async (req, res) => {
  const { name, email, phone, organization } = req.body;

  // Create ONE attendee record فقط
  const attendee = await Attendee.create({ name, email, phone, organization });

  // Save session
  req.session.user = { name, email, phone, organization };
  req.session.attendeeId = attendee._id;

  return res.redirect("/welcome");
};

// GET /welcome
exports.getWelcome = async (req, res) => {
  const speakers = ["Dr. Ahmad", "Dr. Lina", "Eng. Sara", "Mr. Omar"];

  const attendee = await Attendee.findById(req.session.attendeeId).lean();

  res.render("welcome", {
    user: req.session.user,
    speakers,
    ratings: attendee?.ratings || null,
    bestSpeaker: attendee?.bestSpeaker || null,
  });
};

// POST /best-speaker  (vote once)
exports.postBestSpeaker = async (req, res) => {
  const { bestSpeaker } = req.body;

  const attendee = await Attendee.findById(req.session.attendeeId);
  if (!attendee) return res.redirect("/login");

  // vote once
  if (attendee.bestSpeaker) {
    return res.redirect("/welcome");
  }

  attendee.bestSpeaker = bestSpeaker;
  await attendee.save();

  return res.redirect("/welcome");
};

// POST /rate  (save ratings to MongoDB)
exports.postRate = async (req, res) => {
  const ratings = {
    organization: Number(req.body.q1),
    speakers: Number(req.body.q2),
    relevance: Number(req.body.q3),
    timing: Number(req.body.q4),
    overall: Number(req.body.q5),
  };

  await Attendee.findByIdAndUpdate(
    req.session.attendeeId,
    { ratings },
    { new: true }
  );

  return res.redirect("/welcome");
};

// GET /results/best-speaker
exports.getBestSpeakerResults = async (req, res) => {
  const results = await Attendee.aggregate([
    { $match: { bestSpeaker: { $ne: null } } },
    { $group: { _id: "$bestSpeaker", votes: { $sum: 1 } } },
    { $sort: { votes: -1, _id: 1 } },
  ]);

  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
  const winner = results.length ? results[0] : null;

  res.render("best-speaker-results", {
    results,
    totalVotes,
    winner,
  });
};

