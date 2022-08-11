import axios from "axios";
import { userService } from "@/apsisEngine/helpers/userService";

let instance = axios.create({
  //baseURL: "http://192.168.0.27:4000/api/v1",
  baseURL: "http://localhost:4000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.request.use(
  function (config) {
    config.headers.Authorization = authHeader();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// helper functions
function authHeader() {
  // return auth header with basic auth credentials if user is logged in and request is to the api url
  const user = JSON.parse(localStorage.getItem("user"));

  const isLoggedIn = user && user.access_token;
  // const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
  if (isLoggedIn) {
    return `Bearer ${user.access_token}`;
  } else {
    userService.logout();
    return "";
  }
}

export default instance;
