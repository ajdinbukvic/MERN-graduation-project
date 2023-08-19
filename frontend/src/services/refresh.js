import mem from "mem";

import { axiosPublic } from "./axiosPublic";

export const refreshToken = async () => {
  try {
    const response = await axiosPublic.post("auth/refresh");

    const { accessToken } = response.data;

    if (accessToken) {
      localStorage.removeItem("token");
      localStorage.setItem("token", accessToken);
    }

    return accessToken;
  } catch (error) {
    localStorage.removeItem("token");
  }
};

const maxAge = 10000;

export const memoizedRefreshToken = mem(refreshToken, {
  maxAge,
});
