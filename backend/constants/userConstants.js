const USER_EMAIL_REQUIRED = 'Email is required!';
const USER_PASSWORD_REQUIRED = 'Password is required!';
const USER_PASSWORD_CONFIRM_REQUIRED = 'Password confirm is required!';
const USER_CURRENT_PASSWORD_REQUIRED = 'Password is required!';
const USER_PASSWORD_MIN_LENGTH = 'Password must be at least 8 characters long!';
const USER_INCORRECT_EMAIL_PASSWORD = 'Email or password is wrong!';
const USER_CURRENT_PASSWORD_WRONG = 'Your current password is wrong!';
const USER_PASSWORDS_NOT_MATCHING =
  'Password and password confirm must be same!';
USER_ALREADY_EXISTS = (email) => `User with email ${email} already exists.`;

module.exports = {
  USER_EMAIL_REQUIRED,
  USER_PASSWORD_REQUIRED,
  USER_ALREADY_EXISTS,
  USER_INCORRECT_EMAIL_PASSWORD,
  USER_CURRENT_PASSWORD_WRONG,
  USER_PASSWORDS_NOT_MATCHING,
  USER_PASSWORD_MIN_LENGTH,
  USER_PASSWORD_CONFIRM_REQUIRED,
  USER_CURRENT_PASSWORD_REQUIRED,
};
