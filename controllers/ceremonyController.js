const Attendee = require("../models/Attendee");

function makePosterCodes() {
  // P1 ... P30
  return Array.from({ length: 30 }, (_, i) => `P${i + 1}`);
}

exports.getWelcome = (req, res) => {
  res.render("welcome");
};

exports.getPosterVote = async (req, res) => {
  const attendeeId = req.session.attendeeId;
  const attendee = await Attendee.findById(attendeeId).lean();

  res.render("posters", {
    posters: makePosterCodes(),
    myVote: attendee?.bestPoster || null,
    message: null
  });
};

exports.postPosterVote = async (req, res) => {
  const attendeeId = req.session.attendeeId;
  const { posterCode } = req.body;

  const allowed = new Set(makePosterCodes());
  if (!allowed.has(posterCode)) {
    return res.render("posters", {
      posters: makePosterCodes(),
      myVote: null,
      message: "Invalid poster code."
    });
  }

  const attendee = await Attendee.findById(attendeeId);
  if (!attendee) return res.redirect("/login");

  if (attendee.bestPoster) {
    return res.render("posters", {
      posters: makePosterCodes(),
      myVote: attendee.bestPoster,
      message: "You already voted. One time means one time."
    });
  }

  attendee.bestPoster = posterCode;
  await attendee.save();

  return res.render("posters", {
    posters: makePosterCodes(),
    myVote: attendee.bestPoster,
    message: "Vote submitted."
  });
};

exports.getPosterResults = async (req, res) => {
  const agg = await Attendee.aggregate([
    { $match: { bestPoster: { $ne: null } } },
    { $group: { _id: "$bestPoster", votes: { $sum: 1 } } },
    { $sort: { votes: -1, _id: 1 } }
  ]);

  const results = agg.map(x => ({ poster: x._id, votes: x.votes }));

  res.render("poster-results", { results });
};
