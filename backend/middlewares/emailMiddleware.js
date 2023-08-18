const asyncHandler = require('express-async-handler');
const User = require('./../models/userModel');
const Token = require('./../models/tokenModel');
const CustomError = require('./../utils/customError');
const Email = require('./../utils/email');
const { generateToken } = require('../utils/token');
const crypto = require('crypto');

exports.createEmailToken = asyncHandler(
  async (user, statusCode, req, res, next) => {
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

    const verificationURL = `${process.env.FRONTEND_URL}verifyEmail/${verificationToken}`;
    await new Email(user, verificationURL).sendVerificationEmail();

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
      status: 'success',
      //url: verificationURL,
      data: {
        user,
      },
    });
  },
);

exports.verifyEmail = asyncHandler(async (req, res, next) => {
  // const hashedToken = crypto
  //   .createHash('sha256')
  //   .update(req.params.token)
  //   .digest('hex');

  const userToken = await Token.findOne({
    verificationToken: req.params.token,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return next(new CustomError('Token is invalid or has expired', 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userToken.userId,
    { isVerified: true },
    {
      new: true,
      runValidators: true,
    },
  );

  // const user = await User.findOne({ _id: userToken.userId });
  // user.isVerified = true;
  // await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Email verified!',
  });
});
