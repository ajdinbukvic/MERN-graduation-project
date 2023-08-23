const express = require('express');
const taskController = require('./../controllers/taskController');
const { protect, restrictTo } = require('./../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

// Protect all routes after this middleware
router.use(protect);

router.use(taskController.checkStatus);

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(taskController.setProjectUserIds, taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(restrictTo('admin'), taskController.deleteTask);

module.exports = router;
