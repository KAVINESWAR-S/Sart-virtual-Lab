const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    experimentTitle: {
        type: String,
        required: true
    },
    circuitData: {
        type: Object, // Store JSON representation of the circuit
        required: false // Not required if just submitting quiz
    },
    grade: {
        type: Number,
        default: null
    },
    quizScore: {
        type: Number,
        default: null
    },
    feedback: {
        type: String,
        default: ''
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
