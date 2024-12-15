const mongoose = require("mongoose");

// Task Schema
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true }
});

// Create a model for the Task
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
