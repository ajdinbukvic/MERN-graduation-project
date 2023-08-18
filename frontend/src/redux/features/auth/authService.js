import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;
export const API_URL = `${BACKEND_URL}auth/`;

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Register User
const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);
  return response.data;
};

// Logout user
const logout = async () => {
  const response = await axios.get(API_URL + "logout");
  return response.data;
};

// Get Login Status
const getLoginStatus = async () => {
  const response = await axios.get(API_URL + "loginStatus");
  return response.data;
};

// Forgot Password
const forgotPassword = async (userData) => {
  const response = await axios.post(API_URL + "forgotPassword", userData);
  return response.data.message;
};

// Reset Password
const resetPassword = async (userData, resetToken) => {
  const response = await axios.patch(
    `${API_URL}resetPassword/${resetToken}`,

    userData
  );
  return response.data.message;
};

// Verify Email
const verifyEmail = async (verificationToken) => {
  const response = await axios.patch(
    `${API_URL}verifyEmail/${verificationToken}`
  );
  return response.data.message;
};

// Change Password
const changePassword = async (userData) => {
  const response = await axios.patch(API_URL + "changePassword", userData);
  return response.data.message;
};

// Google Login
const loginWithGoogle = async (userToken) => {
  const response = await axios.post(API_URL + "googleLogin", userToken);
  return response.data;
};

// 2FA Login
const loginWithCode = async (code) => {
  const response = await axios.post(API_URL + "validateOTP", code);
  return response.data;
};

// Get User Profile
const getUser = async () => {
  const response = await axios.get(API_URL + "getUser");
  return response.data;
};

// Update User
const updateUser = async (userData) => {
  const response = await axios.patch(API_URL + "updateUser", userData);
  return response.data;
};

// Get Users
const getUsers = async () => {
  const response = await axios.get(API_URL + "getUsers");
  return response.data;
};

// Delete User
const deleteUser = async (id) => {
  //   console.log("delete:" + id);
  const response = await axios.delete(API_URL + id);
  return response.data.message;
};

// upgrade user
const upgradeUser = async (userData) => {
  const response = await axios.patch(API_URL + "upgrade", userData);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getLoginStatus,
  forgotPassword,
  resetPassword,
  getUser,
  updateUser,
  changePassword,
  getUsers,
  deleteUser,
  upgradeUser,
  verifyEmail,
  loginWithGoogle,
  loginWithCode,
};

export default authService;
