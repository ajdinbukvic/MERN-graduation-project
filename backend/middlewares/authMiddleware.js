const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const asyncHandler = require('express-async-handler');
const User = require('./../models/userModel');
const CustomError = require('./../utils/customError');
const { createSendToken } = require('../utils/token');

exports.isLoggedIn = asyncHandler(async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.json(false);
  }
  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

exports.refresh = asyncHandler(async (req, res, next) => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new CustomError(
        'You are not logged in! Please log in to get access.',
        401,
      ),
    );
  }

  let decodedToken;
  try {
    decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_REFRESH_SECRET,
    );
  } catch (err) {
    return next(new CustomError('Token not valid or has expired.', 401));
  }

  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    return next(
      new CustomError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new CustomError(
        'User recently changed password! Please log in again.',
        401,
      ),
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;

  createSendToken(currentUser, 200, res);
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return next(
      new CustomError(
        'You are not logged in! Please log in to get access.',
        401,
      ),
    );
  }

  let decodedToken;
  try {
    decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_ACCESS_SECRET,
    );
  } catch (err) {
    return next(new CustomError('Token not valid or has expired.', 401));
  }

  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    return next(
      new CustomError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new CustomError(
        'User recently changed password! Please log in again.',
        401,
      ),
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError(
          'You do not have permission to perform this action',
          403,
        ),
      );
    }

    next();
  };
};
