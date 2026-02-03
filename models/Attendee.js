const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: String,
  organization: String,

  bestSpeaker: { type: String, default: null },

  ratings: {
    organization: { type: Number, default: null },
    speakers: { type: Number, default: null },
    relevance: { type: Number, default: null },
    timing: { type: Number, default: null },
    overall: { type: Number, default: null },
  },
bestPoster: { type: String, default: null }, // "P1" .. "P30"

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attendee", attendeeSchema);
