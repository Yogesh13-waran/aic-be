const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  role: Number,
  created_id: Number,
});

module.exports = mongoose.model("User", userSchema);
