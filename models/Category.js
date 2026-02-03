const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  monthlyLimit: { type: Number, default: 0 } 
});

module.exports = mongoose.model('Category', CategorySchema);
