const asyncHandler = require('express-async-handler');
const User = require('./../models/userModel');
const CustomError = require('./../utils/customError');
const Email = require('./../utils/email');
const parser = require('ua-parser-js');
const axios = require('axios');
const { createSendToken } = require('../utils/token');
const { USER_INCORRECT_EMAIL_PASSWORD } = require('../constants/userConstants');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Login With Google
exports.googleLogin = asyncHandler(async (req, res, next) => {
  const { userToken } = req.body;

  const verify = await client.verifyIdToken({
    idToken: userToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { email_verified, email, name, picture } = verify.payload;

  if (!email_verified) {
    return next(new CustomError('Email is not verified.', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  const ua = parser(req.headers['user-agent']);
  const userAgent = [ua.ua];

  const password = email + process.env.GOOGLE_SECRET;

  if (user) {
    if (!(await user.correctPassword(password, user.password))) {
      return next(new CustomError(USER_ALREADY_EXISTS(email), 401));
    }

    const isAllowedUserAgent = user.userAgent.includes(userAgent);
    if (!isAllowedUserAgent) {
      await new Email(user, userAgent).sendLoginWithNewDevice();
      user.userAgent.push(userAgent);
      await user.save({ validateBeforeSave: false });
    }

    createSendToken(user, 200, res);
  } else {
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm: password,
      photo: picture,
      isVerified: email_verified,
      userAgent,
    });

    createSendToken(newUser, 200, res);
  }
});

// Login With Facebook
exports.facebookLogin = asyncHandler(async (req, res, next) => {
  const { token, userId } = req.body;

  const URL = `https://graph.facebook.com/v13.9/${userId}/?fields=id,name,email,picture&access_token=${token}`;

  const data = await axios.get(URL);

  const { email, name, picture } = data;

  const user = await User.findOne({ email }).select('+password');

  const ua = parser(req.headers['user-agent']);
  const userAgent = [ua.ua];

  const password = email + process.env.FACEBOOK_SECRET;

  if (user) {
    if (!(await user.correctPassword(password, user.password))) {
      return next(new CustomError(USER_INCORRECT_EMAIL_PASSWORD, 401));
    }

    const isAllowedUserAgent = user.userAgent.includes(userAgent);
    if (!isAllowedUserAgent) await new Email(user).sendLoginWithNewDevice();

    createSendToken(user, 200, res);
  } else {
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm: password,
      photo: picture,
      isVerified: true,
      userAgent,
    });

    createSendToken(newUser, 200, res);
  }
});
