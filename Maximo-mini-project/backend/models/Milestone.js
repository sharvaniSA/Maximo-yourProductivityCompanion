const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model('Milestone', MilestoneSchema);
