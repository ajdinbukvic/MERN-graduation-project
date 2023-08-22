const express = require('express');
const projectController = require('./../controllers/projectController');
const { protect, restrictTo } = require('./../middlewares/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(restrictTo('admin', 'profesor'), projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(restrictTo('admin', 'profesor'), projectController.updateProject)
  .delete(restrictTo('admin', 'profesor'), projectController.deleteProject);

module.exports = router;
