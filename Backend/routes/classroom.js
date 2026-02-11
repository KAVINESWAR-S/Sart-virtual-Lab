const express = require('express');
const router = express.Router();
const { protect, teacherOnly } = require('../middleware/authMiddleware.js');
const Classroom = require('../models/Classroom.js');
const User = require('../models/User.js');

// @desc    Create a new classroom (Experiment)
// @route   POST /api/classrooms
// @access  Teacher only
router.post('/', protect, teacherOnly, async (req, res) => {
    const { name, aim, procedure, components, quiz, simulationEnabled } = req.body;
    // Generate a unique 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
        const classroom = await Classroom.create({
            name,
            teacher: req.user._id,
            code,
            aim,
            procedure,
            components,
            quiz,
            simulationEnabled
        });
        res.status(201).json(classroom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all classrooms for the logged in user
// @route   GET /api/classrooms
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let classrooms;
        if (req.user.role === 'teacher') {
            classrooms = await Classroom.find({ teacher: req.user._id });
        } else {
            classrooms = await Classroom.find({ students: req.user._id });
        }
        res.json(classrooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Join a classroom
// @route   POST /api/classrooms/join
// @access  Student only
router.post('/join', protect, async (req, res) => {
    const { code } = req.body;

    try {
        const classroom = await Classroom.findOne({ code });

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Check if already joined
        if (classroom.students.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already joined this classroom' });
        }

        classroom.students.push(req.user._id);
        await classroom.save();

        // Add to user's joined classrooms
        req.user.classroomsJoined.push(classroom._id);
        await req.user.save();

        res.json({ message: 'Classroom joined successfully', classroom });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get classroom details (with students for teacher)
// @route   GET /api/classrooms/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id)
            .populate('students', 'name email')
            .populate('teacher', 'name email');

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Verify access
        if (req.user.role === 'student' && !classroom.students.some(s => s._id.equals(req.user._id))) {
            return res.status(403).json({ message: 'Not authorized to view this classroom' });
        }
        if (req.user.role === 'teacher' && !classroom.teacher._id.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to view this classroom' });
        }

        res.json(classroom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
