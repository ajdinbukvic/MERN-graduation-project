const mongoose = require('mongoose');
//const User = require('./../models/userModel');

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
      enum: ['dodijeljen', 'završen', 'nedostaje'],
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

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
