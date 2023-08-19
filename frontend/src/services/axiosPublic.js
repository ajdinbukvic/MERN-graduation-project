import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

export const axiosPublic = axios.create({
  withCredentials: true,
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
