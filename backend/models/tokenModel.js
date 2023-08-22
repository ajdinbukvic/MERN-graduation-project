const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  resetToken: {
    type: String,
    default: '',
  },
  verificationToken: {
    type: String,
    default: '',
  },
  otpToken: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;
