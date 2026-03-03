const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String, required: true
    },
    desc: {
        type: String
    },
    category: {
        type: String,
        enum: ['Banana', 'Graps', 'Papaya', 'Watermelon'],
        default: 'Banana'
    },
    imageUrl: {
        type: String
    },
    dueDate: {
        type: String
    },
    time: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'pending'],
        default: 'active'
    },
    createdAt: {
        type: Date, default: Date.now
    }
});

module.exports = mongoose.model('Task', TaskSchema);