const express = require('express');
const userController = require('./../controllers/userController');
const { protect, restrictTo } = require('./../middlewares/authMiddleware');
const { uploadUserPhoto, resizeUserPhoto } = require('./../utils/photo');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  uploadUserPhoto,
  resizeUserPhoto,
  userController.updateMe,
);

router.use(restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUserRole)
  .delete(userController.deleteUser);

module.exports = router;
