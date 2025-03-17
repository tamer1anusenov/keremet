const { validationResult } = require('express-validator');
const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('enrolledCourses', 'title description level category');

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, username, email } = req.body;

    // Check if email or username is already taken
    if (email || username) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: req.user._id } },
          { $or: [
            { email: email || '' },
            { username: username || '' }
          ]}
        ]
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email or username already taken' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { firstName, lastName, username, email } },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's enrolled courses
// @route   GET /api/users/courses
// @access  Private
exports.getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'enrolledCourses',
        select: 'title description level category instructor',
        populate: {
          path: 'instructor',
          select: 'username firstName lastName'
        }
      });

    res.json(user.enrolledCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update course progress
// @route   POST /api/users/courses/:courseId/progress
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const courseId = req.params.courseId;

    // Check if user is enrolled in the course
    const user = await User.findById(req.user._id);
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(401).json({ message: 'Not enrolled in this course' });
    }

    // Find the progress record for this course
    let progressIndex = user.progress.findIndex(
      p => p.course.toString() === courseId
    );

    if (progressIndex === -1) {
      // Create new progress record if it doesn't exist
      user.progress.push({
        course: courseId,
        completedLessons: [lessonId]
      });
    } else {
      // Add lesson to completed lessons if not already completed
      if (!user.progress[progressIndex].completedLessons.includes(lessonId)) {
        user.progress[progressIndex].completedLessons.push(lessonId);
      }
    }

    user.progress[progressIndex || user.progress.length - 1].lastAccessed = Date.now();
    await user.save();

    res.json(user.progress[progressIndex || user.progress.length - 1]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get course progress
// @route   GET /api/users/courses/:courseId/progress
// @access  Private
exports.getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const progress = user.progress.find(
      p => p.course.toString() === req.params.courseId
    );

    if (!progress) {
      return res.json({ completedLessons: [], lastAccessed: null });
    }

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 