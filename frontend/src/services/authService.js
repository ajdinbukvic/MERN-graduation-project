import { axiosPublic } from "./axiosPublic";
import { axiosPrivate } from "./axiosPrivate";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;
export const API_URL = `${BACKEND_URL}auth/`;

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axiosPublic.post(`auth/register`, userData, {
      withCredentials: true,
    });
    if (response.statusText === "OK") {
      toast.success("Uspješno ste se registrovali.");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axiosPublic.post(`auth/login`, userData);
    if (response.statusText === "OK") {
      toast.success("Uspješno ste se prijavili.");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    await axiosPrivate.get(`auth/logout`);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Forgot Password
export const forgotPassword = async (userData) => {
  try {
    const response = await axiosPublic.post(`auth/forgotPassword`, userData);
    toast.success(response.data.message);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Reset Password
export const resetPassword = async (userData, resetToken) => {
  try {
    const response = await axiosPublic.patch(
      `auth/resetPassword/${resetToken}`,
      userData
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Get Login Status
export const getLoginStatus = async () => {
  try {
    const response = await axiosPublic.get(`auth/loginStatus`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Change Password
export const changePassword = async (formData) => {
  try {
    const response = await axiosPrivate.patch(`auth/changePassword`, formData);
    return response.data.message;
    //toast.success(response.data.message);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const generateOTP = async (email) => {
  try {
    const response = await axiosPrivate.post(`auth/generateOTP`, email);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const verifyOTP = async (token) => {
  try {
    const response = await axiosPrivate.post(`auth/verifyOTP`, token);
    if (response.statusText === "OK") {
      toast.success("Uspješno ste omogućili 2FA.");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const validateOTP = async (token, email) => {
  try {
    const response = await axiosPrivate.post(`auth/validateOTP`, {
      token,
      email,
    });
    if (response.statusText === "OK") {
      toast.success("Uspješno ste se prijavili.");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

export const disableOTP = async () => {
  try {
    const response = await axiosPrivate.post(`auth/disableOTP`);
    if (response.statusText === "OK") {
      toast.success("Uspješno ste onemogućili 2FA.");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Get My profile
export const getMe = async () => {
  try {
    const response = await axiosPrivate.get(`users/me`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Get User Profile
export const getUser = async (id) => {
  try {
    const response = await axiosPrivate.get(`users/${id}`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Get All Users
export const getUsers = async () => {
  try {
    const response = await axiosPrivate.get(`users/`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Delete User Profile
export const deleteUser = async (id) => {
  try {
    const response = await axiosPrivate.delete(`users/${id}`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Update User Role
export const updateUserRole = async (id, formData) => {
  try {
    const response = await axiosPrivate.patch(
      `users/updateUserRole/${id}`,
      formData
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Update Profile
export const updateMe = async (formData) => {
  try {
    const response = await axiosPrivate.patch(`users/updateMe`, formData);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
