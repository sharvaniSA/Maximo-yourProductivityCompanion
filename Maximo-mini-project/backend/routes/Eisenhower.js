const express = require('express');
const Eisenhower = require('../models/Eisenhower');
const router = express.Router();

// Get tasks for a specific quadrant
router.get('/:quadrant', async (req, res) => {
  try {
    const tasks = await Eisenhower.find({ quadrant: req.params.quadrant });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Add a new task
router.post('/', async (req, res) => {
  const { quadrant, text, completed, date } = req.body;
  try {
    const newTask = new Eisenhower({ quadrant, text, completed, date });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: 'Error adding task', error: err.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Eisenhower.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: 'Error updating task', error: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Eisenhower.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting task', error: err.message });
  }
});

module.exports = router;
