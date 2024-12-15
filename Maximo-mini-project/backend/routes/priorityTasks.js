const express = require('express');
const PriorityTask = require('../models/PriorityTask');
const router = express.Router();

// Get tasks for a specific date
router.get('/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const tasks = await PriorityTask.find({ date });
    res.status(200).json({ data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Add new tasks
router.post('/', async (req, res) => {
  const { date, tasks, completed } = req.body;

  try {
    const newTask = new PriorityTask({ date, tasks, completed });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save tasks' });
  }
});

// Mark tasks as completed
router.put('/complete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTask = await PriorityTask.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});
router.patch('/toggle/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await PriorityTask.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.completed = !task.completed; // Toggle the completed field
        await task.save();

        res.status(200).json({ completed: task.completed });
    } catch (err) {
        console.error('Error toggling task completion:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
