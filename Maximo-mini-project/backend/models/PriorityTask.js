const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true, // Stored as "YYYY-MM-DD"
    },
    tasks: {
        big: {
            type: String,
            required: true,
        },
        medium: {
            type: [String],
            default: ['', '', ''], // Array of 3 strings
        },
        small: {
            type: [String],
            default: ['', '', '', '', ''], // Array of 5 strings
        },
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('PriorityTask', taskSchema);
