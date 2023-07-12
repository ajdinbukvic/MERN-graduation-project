const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { promisify } = require('util');
const User = require('./../models/userModel');

exports.generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
};

exports.generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

exports.hashToken = (token) => {
  return crypto.createHash('sha256').update(token.toString()).digest('hex');
};

exports.createSendToken = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  const cookieOptions = {
    path: '/',
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  res.cookie('jwt', refreshToken, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    data: {
      user,
    },
  });
};

const key = 'wqvkjmkrolmrnernluvgusqn';
const iv = crypto.randomBytes(16);
const algorithm = 'aes192';
const encoding = 'hex';

exports.encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  cipher.update(text);
  return cipher.final(encoding);
};

exports.decrypt = (text) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.update(text, encoding);
  return decipher.final('utf8');
};

exports.createResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  return hashedToken;
};
