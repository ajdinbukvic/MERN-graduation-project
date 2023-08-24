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
  const response = await axiosPrivate.patch("auth/changePassword", userData);
  return response.data.message;
};

// Google Login
const loginWithGoogle = async (userToken) => {
  const response = await axiosPublic.post("auth/googleLogin", userToken);
  return response.data;
};

// 2FA Login
const generateOTP = async (email) => {
  const response = await axiosPrivate.post("auth/generateOTP", email);
  return response.data;
};

const verifyOTP = async (token) => {
  const response = await axiosPrivate.post("auth/verifyOTP", token);
  return response.data;
};

const validateOTP = async (token, email) => {
  const response = await axiosPrivate.post("auth/validateOTP", {
    token,
    email,
  });
  return response.data;
};

const disableOTP = async () => {
  const response = await axiosPrivate.post("auth/disableOTP");
  return response.data;
};

const loginWithCode = async (code) => {
  const response = await axiosPrivate.post("auth/validateOTP", code);
  return response.data;
};

// Get My profile
const getMe = async () => {
  const response = await axiosPrivate.get(`users/me`);
  return response.data;
};

// Get User
const getUser = async (id) => {
  const response = await axiosPrivate.get(`users/${id}`);
  return response.data;
};

// Get Users
const getUsers = async () => {
  const response = await axiosPrivate.get("users/");
  return response.data;
};

// Delete User
const deleteUser = async (id) => {
  //   console.log("delete:" + id);
  const response = await axiosPrivate.delete(`users/${id}`);
  return response.data.message;
};

// Update User Role
const updateUserRole = async (userData) => {
  const response = await axiosPrivate.patch(`users/${userData.id}`, {
    role: userData.role,
  });
  return response.data;
};

// Update My Profile
const updateMe = async (userData) => {
  const response = await axiosPrivate.patch("users/updateMe", userData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Get Projects
const getProjects = async () => {
  const response = await axiosPrivate.get("projects/");
  return response.data;
};

// Get Project
const getProject = async (projectId) => {
  const response = await axiosPrivate.get(`projects/${projectId}`);
  return response.data;
};

// Update Project Status
const updateProject = async (projectData) => {
  const response = await axiosPrivate.patch(`projects/${projectData.id}`, {
    status: projectData.status,
  });
  return response.data;
};

// Create Project
const createProject = async (projectData) => {
  const response = await axiosPrivate.post(`projects/`, projectData);
  return response.data;
};

// Get Tasks
const getTasks = async (taskData) => {
  const response = await axiosPrivate.get(
    `projects/${taskData.projectId}/tasks?filter=${taskData.filter}`
  );
  return response.data;
};

// Get Task
const getTask = async (taskData) => {
  const response = await axiosPrivate.get(
    `projects/${taskData.projectId}/tasks/${taskData.id}`
  );
  return response.data;
};

// Update Task
const updateTask = async (taskData) => {
  const response = await axiosPrivate.patch(
    `projects/${taskData.projectId}/tasks/${taskData.id}`,
    taskData.data
  );
  return response.data;
};

// Create Task
const createTask = async (taskData) => {
  const response = await axiosPrivate.post(
    `projects/${taskData.projectId}/tasks/`,
    taskData.data
  );
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
  updateUserRole,
  changePassword,
  getUsers,
  deleteUser,
  updateMe,
  getMe,
  verifyEmail,
  loginWithGoogle,
  loginWithCode,
  generateOTP,
  verifyOTP,
  validateOTP,
  disableOTP,
  getProjects,
  getProject,
  updateProject,
  createProject,
  getTasks,
  getTask,
  updateTask,
  createTask,
};

export default authService;
