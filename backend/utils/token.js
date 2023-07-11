const crypto = require('crypto');
const jwt = require('jsonwebtoken');

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
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
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
