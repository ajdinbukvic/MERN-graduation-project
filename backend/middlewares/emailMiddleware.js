const asyncHandler = require('express-async-handler');
const User = require('./../models/userModel');
const CustomError = require('./../utils/customError');
const Email = require('./../utils/email');
const { generateToken } = require('../utils/token');

exports.createEmailToken = async (user, statusCode, res) => {
  const token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  const verificationToken = generateToken();

  await new Token({
    userId: user._id,
    verificationToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  }).save();

  try {
    const verificationURL = `${req.protocol}://${req.get(
      'host',
    )}/api/auth/verifyEmail/${verificationToken}`;
    await new Email(user, verificationURL).sendVerificationEmail();

    res.status(statusCode).json({
      status: 'success',
      // url: verificationURL,
      data: {
        user,
      },
    });
  } catch (err) {
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500,
    );
  }
};

exports.verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const userToken = await Token.findOne({
    verificationToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return next(new CustomError('Token is invalid or has expired', 400));
  }

  const user = await User.findOne({ _id: userToken.userId });
  user.isVerified = true;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Email verified!',
  });
});
