const { check } = require('express-validator');
const {
  PROJECT_TITLE_REQUIRED,
  PROJECT_SUBJECT_REQUIRED,
  PROJECT_PROJECT_TYPE_REQUIRED,
} = require('../constants/projectConstants');

exports.createProjectValidator = [
  check('title').notEmpty().withMessage(PROJECT_TITLE_REQUIRED).bail(),

  check('subject').notEmpty().withMessage(PROJECT_SUBJECT_REQUIRED).bail(),

  check('projectType')
    .notEmpty()
    .withMessage(PROJECT_PROJECT_TYPE_REQUIRED)
    .bail(),

  (req, res, next) => {
    next();
  },
];
