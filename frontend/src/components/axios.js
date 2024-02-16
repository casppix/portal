import axios from "axios";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    if (!accessToken || isTokenExpired(accessToken)) {
      if (refreshToken) {
        try {
          const response = await axios.post(
            "https://localhost:8000/token/refresh/",
            {
              refresh_token: refreshToken,
            },
          );

          const newAccessToken = response.data.access_token;

          Cookies.set("access_token", newAccessToken);

          config.headers.Authorization = `Bearer ${newAccessToken}`;
        } catch (error) {
          console.error("Error refreshing access token:", error);
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          const navigate = useNavigate();
          navigate("/login");
        }
      } else {
        console.error("Refresh token is not available");
      }
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const isTokenExpired = (token) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const decodedToken = jwtDecode(token);
  return decodedToken.exp < currentTime;
};