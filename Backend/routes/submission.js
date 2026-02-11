const express = require('express');
const router = express.Router();
const { protect, teacherOnly, adminOrTeacher } = require('../middleware/authMiddleware.js');
const Submission = require('../models/Submission.js');

// ... (previous routes)

// @desc    Submit an experiment (Circuit or Quiz)
// @route   POST /api/submissions
// @access  Student only
router.post('/', protect, async (req, res) => {
    const { experimentTitle, circuitData, quizScore } = req.body;

    try {
        let submission = await Submission.findOne({
            student: req.user._id,
            experimentTitle
        });

        if (submission) {
            // Update existing
            if (circuitData) submission.circuitData = circuitData;
            if (quizScore !== undefined) submission.quizScore = quizScore;
            await submission.save();
            return res.json(submission);
        }

        // Create new
        submission = await Submission.create({
            student: req.user._id,
            experimentTitle,
            circuitData: circuitData || {},
            quizScore: quizScore !== undefined ? quizScore : null
        });

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get My Submissions
// @route   GET /api/submissions/my
// @access  Student only
router.get('/my', protect, async (req, res) => {
    try {
        const submissions = await Submission.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Submissions for a student (Teacher view)
// @route   GET /api/submissions/student/:studentId
// @access  Teacher only
router.get('/student/:studentId', protect, teacherOnly, async (req, res) => {
    try {
        const submissions = await Submission.find({ student: req.params.studentId }).sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get All Submissions (Optional filter by experimentTitle)
// @route   GET /api/submissions
// @access  Teacher or Admin
router.get('/', protect, adminOrTeacher, async (req, res) => {
    const { experimentTitle } = req.query;
    try {
        let query = {};
        if (experimentTitle) {
            query.experimentTitle = experimentTitle;
        }
        const submissions = await Submission.find(query).populate('student', 'name email').sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Single Submission
// @route   GET /api/submissions/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id).populate('student', 'name email');

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Access check
        if (req.user.role === 'student' && !submission.student._id.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// @desc    Grade a submission
// @route   PUT /api/submissions/:id/grade
// @access  Teacher only
router.put('/:id/grade', protect, teacherOnly, async (req, res) => {
    const { grade, feedback } = req.body;

    try {
        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        submission.grade = grade;
        submission.feedback = feedback;
        await submission.save();

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
