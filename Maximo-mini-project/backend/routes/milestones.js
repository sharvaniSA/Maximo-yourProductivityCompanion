const express = require('express');
const router = express.Router();
const Milestone = require('../models/Milestone');

// Create a new milestone
router.post('/add', async (req, res) => {
    try {
        const { title, date, description } = req.body;

        // Validate that the date is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to 00:00 for accurate comparison

        if (new Date(date) < today) {
            return res.status(400).json({ message: 'Cannot add milestones for past dates.' });
        }

        const newMilestone = new Milestone({ title, date, description });
        await newMilestone.save();
        res.status(201).json(newMilestone);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get all milestones
router.get('/', async (req, res) => {
    try {
        const milestones = await Milestone.find();
        res.status(200).json(milestones);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
