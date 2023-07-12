const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('./../models/userModel');
const CustomError = require('./../utils/customError');

// Send Verification Email
const sendVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  // Check if user doesn't exists
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error('User already verified');
  }

  // Delete token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // Create Verification Token and save
  const verificationToken = crypto.randomBytes(32).toString('hex') + user.id;

  // Hash token before saving to DB
  const hashedToken = hashToken(verificationToken);

  // Save Token to DB
  await new Token({
    userId: user._id,
    vToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * (60 * 1000), // Thirty minutes
  }).save();

  // Construct Verification Url
  const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

  // Verification Email
  // const message = `
  //     <h2>Hello ${user.name}</h2>
  //     <p>Please use the url below to verify your account</p>
  //     <p>This link is valid for 24hrs</p>

  //     <a href=${verificationUrl} clicktracking=off>${verificationUrl}</a>

  //     <p>Regards...</p>
  //     <p>AUTH:Z Team</p>
  //   `;
  const subject = 'Verify Your Account - AUTH:Z';
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = 'noreply@zinotrustacademy.com';
  const template = 'email';
  const name = user.name;
  const link = verificationUrl;

  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link,
    );
    res.status(200).json({ success: true, message: 'Verification Email Sent' });
  } catch (error) {
    res.status(500);
    throw new Error('Email not sent, please try again');
  }
});

// Verify User
const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  // Hash Token
  const hashedToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // fIND tOKEN in DB
  const userToken = await Token.findOne({
    vToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error('Invalid or Expired Token!!!');
  }
  // Find User
  const user = await User.findOne({ _id: userToken.userId });

  if (user.isVerified) {
    res.status(400);
    throw new Error('User is already verified!!!');
  }

  // Now Verify user
  user.isVerified = true;
  await user.save();

  res.status(200).json({
    message: 'Account Verification Successful',
  });
});
