const express = require('express');
const authController = require('./../controllers/authController');
const { verifyEmail } = require('./../middlewares/emailMiddleware');
const { refresh, protect } = require('./../middlewares/authMiddleware');
const {
  googleLogin,
  facebookLogin,
} = require('./../middlewares/socialAuthMiddleware');
const {
  generateOTP,
  verifyOTP,
  validateOTP,
  disableOTP,
} = require('./../middlewares/twoFactorAuthMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.patch('/verifyEmail/:token', verifyEmail);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.post('/googleLogin', googleLogin);
router.post('/facebookLogin', facebookLogin);

// Protect all routes after this middleware
router.use(protect);

router.get('/logout', authController.logout);
router.post('/refresh', refresh);
router.patch('/changePassword', authController.changePassword);

router.post('/generateOTP', generateOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/validateOTP', validateOTP);
router.post('/disableOTP', disableOTP);

module.exports = router;
