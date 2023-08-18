const asyncHandler = require('express-async-handler');
const User = require('./../models/userModel');
const crypto = require('crypto');
const CustomError = require('./../utils/customError');
const OTPAuth = require('otpauth');
const { encode } = require('hi-base32');

const generateRandomBase32 = () => {
  const buffer = crypto.randomBytes(15);
  const base32 = encode(buffer).replace(/=/g, '').substring(0, 24);
  return base32;
};

exports.generateOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError('There is no user with email address.', 404));
  }

  const base32Secret = generateRandomBase32();

  const totp = new OTPAuth.TOTP({
    issuer: 'diplomskiapp',
    label: 'Diplomski App',
    algorithm: 'SHA1',
    digits: 6,
    period: 15,
    secret: base32Secret,
  });

  const otpAuthUrl = totp.toString();

  user.otpAuthUrl = otpAuthUrl;
  user.otpBase32 = base32Secret;
  await user.save();

  res.status(200).json({
    base32: base32Secret,
    otpAuthUrl,
  });
});

exports.verifyOTP = asyncHandler(async (req, res, next) => {
  const { token } = req.body;

  const user = await User.findOne({ _id: req.user._id });

  if (!user) {
    return next(new CustomError('There is no user with that ID.', 404));
  }

  const totp = new OTPAuth.TOTP({
    issuer: 'diplomskiapp',
    label: 'Diplomski App',
    algorithm: 'SHA1',
    digits: 6,
    period: 15,
    secret: user?.otpBase32,
  });

  const delta = totp.validate({ token });

  if (!delta) {
    return next(new CustomError('Token is invalid or has expired', 401));
  }

  user.otpEnabled = true;
  user.otpVerified = true;
  await user.save();

  res.status(200).json({
    otpEnabled: true,
    otpVerified: true,
  });
});

exports.validateOTP = asyncHandler(async (req, res, next) => {
  const { token } = req.body;

  const user = await User.findOne({ _id: req.user._id });

  if (!user) {
    return next(new CustomError('There is no user with that ID.', 404));
  }

  const totp = new OTPAuth.TOTP({
    issuer: 'diplomskiapp',
    label: 'Diplomski App',
    algorithm: 'SHA1',
    digits: 6,
    period: 15,
    secret: user?.otpBase32,
  });

  const delta = totp.validate({ token, window: 1 });

  if (!delta) {
    return next(new CustomError('Token is invalid or has expired', 401));
  }

  res.status(200).json({
    otpValid: true,
  });
});

exports.disableOTP = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { otpEnabled: false },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!user) {
    return next(new CustomError('There is no user with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});
