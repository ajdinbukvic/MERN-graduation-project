const crypto = require('crypto');
const User = require('./../models/userModel');
const Token = require('./../models/tokenModel');
const asyncHandler = require('express-async-handler');
const CustomError = require('./../utils/customError');
const Email = require('./../utils/email');
const parser = require('ua-parser-js');
const { validationResult } = require('express-validator');
const { createSendToken, generateToken } = require('../utils/token');
const { createEmailToken } = require('../middlewares/emailMiddleware');
const {
  USER_INCORRECT_EMAIL_PASSWORD,
  USER_CURRENT_PASSWORD_WRONG,
  USER_PASSWORDS_NOT_MATCHING,
  USER_ALREADY_EXISTS,
} = require('../constants/userConstants');

exports.register = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new CustomError(errors.errors[0].msg, 400));
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return next(new CustomError(USER_PASSWORDS_NOT_MATCHING, 401));
  }

  const { email } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new CustomError(USER_ALREADY_EXISTS(email), 401));
  }

  const ua = parser(req.headers['user-agent']);
  const userAgent = [ua.ua];

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    userAgent,
  });

  createEmailToken(newUser, 201, req, res, next);
});

exports.login = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new CustomError(errors.errors[0].msg, 400));
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new CustomError(USER_INCORRECT_EMAIL_PASSWORD, 401));
  }

  if (!user.isVerified) {
    return next(new CustomError('Email is not verified.', 401));
  }

  const ua = parser(req.headers['user-agent']);
  const userAgent = ua.ua;
  const isAllowedUserAgent = user.userAgent.includes(userAgent);
  if (!isAllowedUserAgent) {
    await new Email(user, userAgent).sendLoginWithNewDevice();
    user.userAgent.push(userAgent);
    await user.save({ validateBeforeSave: false });
  }

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    path: '/',
    sameSite: 'none',
    secure: true,
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new CustomError('There is no user with email address.', 404));
  }

  const token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  const resetToken = generateToken();

  await new Token({
    userId: user._id,
    resetToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000,
  }).save();

  try {
    const resetURL = `${process.env.FRONTEND_URL}resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    return next(
      new CustomError('There was an error sending the email. Try again later!'),
      500,
    );
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // const hashedToken = crypto
  //   .createHash('sha256')
  //   .update(req.params.token)
  //   .digest('hex');

  const userToken = await Token.findOne({
    resetToken: req.params.token,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return next(new CustomError('Token is invalid or has expired', 400));
  }

  const user = await User.findOne({ _id: userToken.userId });
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  await new Email(user).sendPasswordChanged();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  //createSendToken(user, 200, res);
  res.status(200).json({
    status: 'success',
    message: 'Password reset successful!',
  });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new CustomError(errors.errors[0].msg, 400));
  }

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new CustomError(USER_CURRENT_PASSWORD_WRONG, 401));
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return next(new CustomError(USER_PASSWORDS_NOT_MATCHING, 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  await new Email(user).sendPasswordChanged();

  createSendToken(user, 200, res);
});
