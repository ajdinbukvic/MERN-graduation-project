const mongoose = require('mongoose');
const User = require('./../models/userModel');

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
    },
    projectType: {
      type: String,
      required: [true, 'Please add a project type'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profesorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    teamLeaderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    minimize: false,
  },
);

// projectSchema.pre(/^find/, function (next) {
//   this.find({ isActive: { $ne: false } });
//   next();
// });

projectSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'profesorId',
    User,
  })
    .populate({
      path: 'teamLeaderId',
      User,
    })
    .populate({
      path: 'members',
      User,
    });

  next();
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
