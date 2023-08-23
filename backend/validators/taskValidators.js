const { check } = require('express-validator');
const {
  TASK_TITLE_REQUIRED,
  TASK_DEADLINE_REQUIRED,
} = require('../constants/taskConstants');

exports.createProjectValidator = [
  check('title').notEmpty().withMessage(TASK_TITLE_REQUIRED).bail(),

  check('deadline').notEmpty().withMessage(TASK_DEADLINE_REQUIRED).bail(),

  (req, res, next) => {
    next();
  },
];
