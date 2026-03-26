const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  url: String,
  priority: Number,
  clicks: { type: Number, default: 0 },
  active: { type: Boolean, default: true },

device: {
    type: String, // "mobile" | "desktop" | "all"
    default: "all"
  },
  time: {
    type: String, // "day" | "night" | "all"
    default: "all"
  }
});

module.exports = mongoose.model("Link", LinkSchema);
