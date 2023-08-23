const Project = require('./../models/projectModel');
const User = require('./../models/userModel');
const Task = require('./../models/taskModel');
const factory = require('./factory');
const asyncHandler = require('express-async-handler');
const CustomError = require('./../utils/customError');
const { validationResult } = require('express-validator');

exports.getAllTasks = asyncHandler(async (req, res, next) => {});

exports.getTask = asyncHandler(async (req, res, next) => {});

exports.createTask = asyncHandler(async (req, res, next) => {});

exports.updateTask = asyncHandler(async (req, res, next) => {});

exports.deleteTask = factory.deleteOne(Task);
