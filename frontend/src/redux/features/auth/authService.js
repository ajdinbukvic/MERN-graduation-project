import { axiosPublic } from "../../../services/axiosPublic";
import { axiosPrivate } from "../../../services/axiosPrivate";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;
export const API_URL = `${BACKEND_URL}auth/`;

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Register User
const register = async (userData) => {
  const response = await axiosPublic.post("auth/register", userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axiosPublic.post("auth/login", userData);
  return response.data;
};

// Logout user
const logout = async () => {
  const response = await axiosPrivate.get("auth/logout");
  return response.data;
};

// Get Login Status
const getLoginStatus = async () => {
  const response = await axiosPublic.get("auth/loginStatus");
  return response.data;
};

// Forgot Password
const forgotPassword = async (userData) => {
  const response = await axiosPublic.post("auth/forgotPassword", userData);
  return response.data.message;
};

// Reset Password
const resetPassword = async (userData, resetToken) => {
  const response = await axiosPublic.patch(
    `auth/resetPassword/${resetToken}`,

    userData
  );
  return response.data.message;
};

// Verify Email
const verifyEmail = async (verificationToken) => {
  const response = await axiosPublic.patch(
    `auth/verifyEmail/${verificationToken}`
  );
  return response.data.message;
};

// Change Password
const changePassword = async (userData) => {
  const response = await axiosPublic.patch("auth/changePassword", userData);
  return response.data.message;
};

// Google Login
const loginWithGoogle = async (userToken) => {
  const response = await axiosPublic.post("auth/googleLogin", userToken);
  return response.data;
};

// 2FA Login
const loginWithCode = async (code) => {
  const response = await axiosPrivate.post("auth/validateOTP", code);
  return response.data;
};

// Get User Profile
const getUser = async () => {
  const response = await axiosPrivate.get("auth/getUser");
  return response.data;
};

// Update User
const updateUser = async (userData) => {
  const response = await axiosPrivate.patch("auth/updateUser", userData);
  return response.data;
};

// Get Users
const getUsers = async () => {
  const response = await axiosPrivate.get("auth/getUsers");
  return response.data;
};

// Delete User
const deleteUser = async (id) => {
  //   console.log("delete:" + id);
  const response = await axiosPrivate.delete("auth/delete" + id);
  return response.data.message;
};

// upgrade user
const upgradeUser = async (userData) => {
  const response = await axiosPrivate.patch("auth/upgrade", userData);
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
