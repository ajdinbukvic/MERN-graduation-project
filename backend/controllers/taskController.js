const Project = require('./../models/projectModel');
const User = require('./../models/userModel');
const Task = require('./../models/taskModel');
const factory = require('./factory');
const asyncHandler = require('express-async-handler');
const CustomError = require('./../utils/customError');
const { validationResult } = require('express-validator');
const ObjectID = require('mongodb').ObjectId;

exports.setProjectUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.projectId) req.body.projectId = req.params.projectId;
  if (!req.body.createdId) req.body.createdId = req.user.id;
  next();
};

exports.getAllTasks = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  let project;
  const filter = req.query.filter;
  const filterWords = ['dodijeljen', 'predat', 'nedostaje'];
  const isFiltered = filterWords.includes(filter);
  let tasks;

  if (req.params.projectId) {
    project = await Project.findById(req.params.projectId);
    if (!project) {
      return next(new CustomError('No project found with that ID', 404));
    }
    const isMember = project.members.some((member) =>
      member._id.equals(user._id),
    );
    if (user.role === 'student') {
      if (!project.teamLeaderId._id.equals(user._id) && !isMember) {
        return next(
          new CustomError('You are not allowed to tasks of this project', 401),
        );
      }
      if (isFiltered) {
        tasks = await Task.find({
          projectId: req.params.projectId,
          status: filter,
        }).sort({
          assignedId: -1,
          createdAt: -1,
        });
      } else {
        tasks = await Task.find({ projectId: req.params.projectId }).sort({
          assignedId: -1,
          createdAt: -1,
        });
      }
    } else if (user.role === 'profesor') {
      if (!project.profesorId._id.equals(user._id)) {
        return next(
          new CustomError('You are not allowed to tasks of this project', 401),
        );
      }
      if (isFiltered) {
        tasks = await Task.find({
          projectId: req.params.projectId,
          status: filter,
        }).sort({
          createdAt: -1,
        });
      } else {
        tasks = await Task.find({ projectId: req.params.projectId }).sort({
          createdAt: -1,
        });
      }
    } else {
      if (isFiltered) {
        tasks = await Task.find({
          projectId: req.params.projectId,
          status: filter,
        }).sort({
          createdAt: -1,
        });
      } else {
        tasks = await Task.find({ projectId: req.params.projectId }).sort({
          createdAt: -1,
        });
      }
    }
  } else {
    if (user.role === 'student' || user.role === 'profesor') {
      return next(new CustomError('You are not allowed to see all tasks', 401));
    }
    tasks = await Task.find();
  }

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: {
      data: tasks,
    },
  });
});

exports.getTask = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new CustomError('No task found with that ID', 404));
  }

  const project = await Project.findById(task.projectId._id);
  const isMember = project.members.some((member) =>
    member._id.equals(req.user.id),
  );
  if (
    user.role === 'student' &&
    project.teamLeaderId._id.equals(req.user.id) &&
    isMember
  ) {
    return next(
      new CustomError('You are not member of project with that task ID', 401),
    );
  }

  if (user.role === 'profesor' && !project.profesorId._id.equals(req.user.id)) {
    return next(
      new CustomError('You are not author of project with that task ID', 401),
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: task,
    },
  });
});

exports.createTask = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new CustomError(errors.errors[0].msg, 400));
  }

  const project = await Project.findById(req.params.projectId);

  if (!project.teamLeaderId._id.equals(req.user.id)) {
    return next(new CustomError('Only team leader can create new task', 401));
  }

  if (!req.body.assignedId) {
    return next(new CustomError('You must specify member to this task', 401));
  }
  const isMember = project.members.some((member) =>
    member._id.equals(req.body.assignedId),
  );

  if (!project.teamLeaderId._id.equals(req.body.assignedId) && !isMember) {
    return next(new CustomError('You must assign task to project member', 401));
  }

  if (new Date(req.body.deadline) < Date.now()) {
    return next(new CustomError('Deadline must be in the future', 401));
  }

  const newTask = await Task.create({
    title: req.body.title,
    deadline: req.body.deadline,
    assignedId: req.body.assignedId,
    projectId: req.params.projectId,
    createdId: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      data: newTask,
    },
  });
});

const updateFinishedTasks = (tasks) => {
  tasks.forEach(async (task) => {
    try {
      await task.changeTimePassedStatus();
    } catch (err) {
      throw err;
    }
  });
};

exports.checkStatus = asyncHandler(async (req, res, next) => {
  const tasks = await Task.find({ status: 'dodijeljen' });
  if (!tasks) return next();
  updateFinishedTasks(tasks);
  next();
});

exports.updateTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new CustomError('No task found with that ID', 404));
  }

  if (!req.body.description || !req.body.attachments) {
    return next(
      new CustomError('Description and attachments are required fields', 401),
    );
  }

  if (!task.assignedId._id.equals(req.user.id)) {
    return next(new CustomError('This task is not assigned to you', 401));
  }

  if (task.status !== 'dodijeljen') {
    return next(new CustomError('You can submit only assigned task', 401));
  }

  if (task.timeleft <= 0) {
    return next(
      new CustomError('Deadline for submitting this task has passed', 401),
    );
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    {
      status: 'predat',
      description: req.body.description,
      attachments: req.body.attachments,
      endDate: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(201).json({
    status: 'success',
    data: {
      data: updatedTask,
    },
  });
});

exports.deleteTask = factory.deleteOne(Task);
