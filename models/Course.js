const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: String,
  duration: String,
  fee: Number
});

module.exports = mongoose.model('Course', courseSchema);
