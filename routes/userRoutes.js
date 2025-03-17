const express = require('express');
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getEnrolledCourses,
  updateProgress,
  getProgress
} = require('../controllers/userController');

const router = express.Router();

// Profile routes
router.route('/profile')
  .get(protect, getProfile)
  .put(
    protect,
    [
      check('firstName', 'First name is required').optional().not().isEmpty(),
      check('lastName', 'Last name is required').optional().not().isEmpty(),
      check('username', 'Username is required').optional().not().isEmpty(),
      check('email', 'Please include a valid email').optional().isEmail()
    ],
    updateProfile
  );

// Course enrollment and progress routes
router.get('/courses', protect, getEnrolledCourses);
router.route('/courses/:courseId/progress')
  .get(protect, getProgress)
  .post(
    protect,
    [
      check('lessonId', 'Lesson ID is required').not().isEmpty()
    ],
    updateProgress
  );

module.exports = router; 