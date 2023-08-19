import axios from "axios";
import { axiosPublic } from "./axiosPublic";
//import { memoizedRefreshToken } from "./refresh";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

axios.defaults.baseURL = BACKEND_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;

    if (error?.response?.status === 401 && !config?._retry) {
      config._retry = true;

      try {
        const response = await axiosPublic.post(
          "auth/refresh",
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data;
        if (accessToken) {
          localStorage.removeItem("token");
          localStorage.setItem("token", accessToken);
          config.headers = {
            ...config.headers,
            authorization: `Bearer ${accessToken}`,
          };
        }
      } catch (err) {
        console.log(err);
      }
      //const result = await memoizedRefreshToken();
      // if (result?.accessToken) {
      //   config.headers = {
      //     ...config.headers,
      //     authorization: `Bearer ${result?.accessToken}`,
      //   };
      // }

      return axios(config);
    }
    return Promise.reject(error);
  }
);

export const axiosPrivate = axios;
