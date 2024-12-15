const express = require("express");
const Task = require("../models/taskModel");  // Import the task model
const router = express.Router();

// GET route to fetch all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();  // Fetch all tasks from MongoDB
    res.json(tasks);  // Send the tasks as a JSON response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST route to add a new task
router.post("/", async (req, res) => {
  const task = new Task({
    text: req.body.text  // Getting task text from request body
  });

  try {
    const newTask = await task.save();  // Save the task to MongoDB
    res.status(201).json(newTask);  // Return the newly created task
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE route to delete a task by ID
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);  // Find and delete task by ID
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted" });  // Send success message
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
