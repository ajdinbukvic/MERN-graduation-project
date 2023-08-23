const Project = require('./../models/projectModel');
const User = require('./../models/userModel');
const factory = require('./factory');
const asyncHandler = require('express-async-handler');
const CustomError = require('./../utils/customError');
const { validationResult } = require('express-validator');

exports.getAllProjects = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  let projects;
  if (user.role === 'student') {
    projects = await Project.find({
      $or: [{ teamLeaderId: req.user.id }, { members: { $in: [req.user.id] } }],
    }).sort({ isActive: -1 });
  } else if (user.role === 'profesor') {
    projects = await Project.find({ profesorId: req.user.id }).sort({
      isActive: -1,
    });
  } else {
    projects = await Project.find().sort({ isActive: -1 });
  }

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      data: projects,
    },
  });
});

exports.getProject = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new CustomError('No project found with that ID', 404));
  }

  if (
    (user.role === 'student' && project.teamLeaderId === req.user.id) ||
    project.members.includes(req.user.id)
  ) {
    return next(new CustomError('You are not member of this project', 401));
  }

  if (user.role === 'profesor' && project.profesorId !== req.user.id) {
    return next(new CustomError('You are not author of this project', 401));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: project,
    },
  });
});

exports.createProject = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new CustomError(errors.errors[0].msg, 400));
  }

  const { teamLeader, members } = req.body;

  const teamLeaderExists = await User.findOne({ email: teamLeader });

  if (!teamLeaderExists) {
    return next(
      new CustomError('Email of team leader does not exist in database', 401),
    );
  }

  const membersId = [];
  for (const member of members) {
    const memberExists = await User.findOne({ email: member });
    if (!memberExists) {
      return next(
        new CustomError(
          `Email of member ${member} does not exist in database`,
          401,
        ),
      );
    }
    if (member === teamLeader) {
      return next(
        new CustomError(`Team leader can not be member of project`, 401),
      );
    }
    membersId.push(memberExists.id);
  }

  const newProject = await Project.create({
    title: req.body.title,
    subject: req.body.subject,
    projectType: req.body.projectType,
    profesorId: req.user.id,
    teamLeaderId: teamLeaderExists.id,
    members: membersId,
  });

  res.status(201).json({
    status: 'success',
    data: {
      data: newProject,
    },
  });
});

exports.updateProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new CustomError('No project found with that ID', 404));
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    { isActive: req.body.status },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(201).json({
    status: 'success',
    data: {
      data: updatedProject,
    },
  });
});

exports.deleteProject = factory.deleteOne(Project);
