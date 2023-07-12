const { check } = require('express-validator');
const {
  USER_EMAIL_REQUIRED,
  USER_PASSWORD_REQUIRED,
  USER_ALREADY_EXISTS,
  USER_PASSWORD_CONFIRM_REQUIRED,
  USER_CURRENT_PASSWORD_REQUIRED,
  USER_PASSWORD_MIN_LENGTH,
} = require('../constants/userConstants');
const User = require('./../models/userModel');

exports.createUserValidator = [
  check('email')
    .notEmpty()
    .withMessage(USER_EMAIL_REQUIRED)
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user != null) {
        return Promise.reject(USER_ALREADY_EXISTS(value));
      }
    })
    .bail(),

  check('password')
    .notEmpty()
    .withMessage(USER_PASSWORD_REQUIRED)
    .isLength({ min: 8 })
    .withMessage(USER_PASSWORD_MIN_LENGTH)
    .bail(),

  check('passwordConfirm')
    .notEmpty()
    .withMessage(USER_PASSWORD_CONFIRM_REQUIRED)
    .isLength({ min: 8 })
    .withMessage(USER_PASSWORD_MIN_LENGTH)
    .bail(),

  (req, res, next) => {
    next();
  },
];

exports.loginUserValidator = [
  check('email').notEmpty().withMessage(USER_EMAIL_REQUIRED).bail(),

  check('password').notEmpty().withMessage(USER_PASSWORD_REQUIRED).bail(),

  (req, res, next) => {
    next();
  },
];

exports.changePasswordUserValidator = [
  check('currentPassword')
    .notEmpty()
    .withMessage(USER_CURRENT_PASSWORD_REQUIRED)
    .bail(),

  check('password')
    .notEmpty()
    .withMessage(USER_PASSWORD_REQUIRED)
    .isLength({ min: 8 })
    .withMessage(USER_PASSWORD_MIN_LENGTH)
    .bail(),

  check('passwordConfirm')
    .notEmpty()
    .withMessage(USER_PASSWORD_CONFIRM_REQUIRED)
    .isLength({ min: 8 })
    .withMessage(USER_PASSWORD_MIN_LENGTH)
    .bail(),

  (req, res, next) => {
    next();
  },
];
