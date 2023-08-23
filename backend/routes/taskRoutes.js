const express = require('express');
const taskController = require('./../controllers/taskController');
const { protect, restrictTo } = require('./../middlewares/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(restrictTo('admin', 'profesor'), taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTask)
  .patch(restrictTo('admin', 'profesor'), taskController.updateTask)
  .delete(restrictTo('admin', 'profesor'), taskController.deleteTask);

module.exports = router;
