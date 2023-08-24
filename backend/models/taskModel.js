const mongoose = require('mongoose');
const User = require('./../models/userModel');
const Project = require('./../models/projectModel');

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    deadline: {
      type: Date,
      required: [true, 'Please add deadline'],
      validate: {
        validator: function (input) {
          return input > Date.now();
        },
        message: 'Deadline must be in future',
      },
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    assignedId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    createdId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['dodijeljen', 'predat', 'nedostaje'],
      default: 'dodijeljen',
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    attachments: [String],
  },
  {
    timestamps: true,
    minimize: false,
  },
);

taskSchema.virtual('timeleft').get(function () {
  if (this.deadline > Date.now()) return this.deadline - Date.now();
  return 0;
});

taskSchema.methods.changeTimePassedStatus = async function () {
  if (this.timeleft <= 0) {
    await Task.findByIdAndUpdate(this._id, {
      status: 'nedostaje',
    });
  }
};

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'assignedId',
    User,
  })
    .populate({
      path: 'createdId',
      User,
    })
    .populate({
      path: 'projectId',
      Project,
    });

  next();
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
