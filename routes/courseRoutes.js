const express = require('express');
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  addReview
} = require('../controllers/courseController');

const router = express.Router();

// Get all courses and create new course
router.route('/')
  .get(getCourses)
  .post(
    protect,
    authorize('admin', 'instructor'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('level', 'Level is required').isIn(['beginner', 'intermediate', 'advanced']),
      check('category', 'Category is required').not().isEmpty()
    ],
    createCourse
  );

// Get, update and delete single course
router.route('/:id')
  .get(getCourse)
  .put(protect, authorize('admin', 'instructor'), updateCourse)
  .delete(protect, authorize('admin', 'instructor'), deleteCourse);

// Enroll in course
router.post('/:id/enroll', protect, enrollCourse);

// Add review to course
router.post(
  '/:id/reviews',
  protect,
  [
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    check('comment', 'Comment is required').not().isEmpty()
  ],
  addReview
);

module.exports = router; 