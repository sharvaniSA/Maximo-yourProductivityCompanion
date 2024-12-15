const mongoose = require('mongoose');

const EisenhowerSchema = new mongoose.Schema({
  quadrant: { type: String, required: true }, // e.g., quadrant1, quadrant2
  text: { type: String, required: true },     // Task description
  completed: { type: Boolean, default: false }, // Task status
  date: { type: String },                     // Optional date
});

module.exports = mongoose.model('Eisenhower', EisenhowerSchema);
