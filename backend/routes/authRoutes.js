const express = require('express');
const authController = require('./../controllers/authController');
const { verifyEmail } = require('./../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.patch('/verifyEmail/:token', verifyEmail);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.changePassword);

module.exports = router;
