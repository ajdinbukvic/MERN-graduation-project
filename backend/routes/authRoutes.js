const express = require('express');
const authController = require('./../controllers/authController');
const { verifyEmail } = require('./../middlewares/emailMiddleware');
const { refresh } = require('./../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.patch('/verifyEmail/:token', verifyEmail);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/logout', authController.logout);
router.post('/refresh', refresh);
router.patch('/changePassword', authController.changePassword);

module.exports = router;
