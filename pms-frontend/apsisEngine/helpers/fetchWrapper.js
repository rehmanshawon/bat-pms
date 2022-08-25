import axios from "axios";
import Router from "next/router";
import { Promise } from "es6-promise";
const baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://192.168.0.27:4000/api/v1";

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config) {
    config.headers.Authorization = authHeader();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    //Return any error which is not due to authentication back to the calling service
    if (error?.response?.status !== 401) {
      return new Promise((resolve, reject) => {
        if (error && error?.response?.data) {
          reject(error.response.data);
        }
        reject({ error: "Something wrong try with valid data" });
      });
    }

    //resource not found
    if (error?.response && error?.response?.status == 404) {
      return Promise.reject(new NotFoundError());
    }

    // Logout user if token refresh didn't work or user is disabled
    if (
      error.config.url == "apsis/auth/refreshtoken" ||
      error.response.message == "Account is disabled."
    ) {
      //force logout
      logout();
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    // Try request again with new token
    if (
      error.response.status == 401 &&
      error.config.url != "apsis/auth/refreshtoken"
    ) {
      return getNewToken()
        .then((access_token) => {
          // New request with new token
          const config = error.config;
          config.headers["Authorization"] = `Bearer ${access_token}`;
          return new Promise((resolve, reject) => {
            instance
              .request(config)
              .then((response) => {
                resolve(response);
              })
              .catch((error) => {
                reject(error);
              });
          });
        })
        .catch((error) => {
          return new Promise.reject(error);
        });
    }

    return new Promise((resolve, reject) => {
      reject(error.response.data);
    });
  }
);

// Auth Helper functions
function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = user && user.access_token;
  if (isLoggedIn) {
    return `Bearer ${user.access_token}`;
  } else {
    logout();
    return false;
  }
}

const getNewToken = () => {
  return new Promise((resolve, reject) => {
    instance
      .post("auth/refreshtoken", {
        access_token: getLocalAccessToken(),
        refresh_token: getLocalRefreshToken(),
      })
      .then((response) => {
        updateLocalAccessToken(response.data);
        resolve(response.data.access_token);
      })
      .catch((error) => {
        if (error.error == true) {
          logout();
        }
        reject(error);
      });
  });
};

//update Access Token
const updateLocalAccessToken = ({ access_token, refresh_token }) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    user.access_token = access_token;
    user.refresh_token = refresh_token;
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.log(error);
  }
};

//get access token
const getLocalAccessToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.access_token) {
      return user.access_token;
    }
    return false;
  } catch (error) {
    return false;
  }
};

//get refresh token
export const getLocalRefreshToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.refresh_token) {
      return user.refresh_token;
    }
    return false;
  } catch (error) {
    return false;
  }
};

//Logout Helper Functions
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("module_info");
  localStorage.removeItem("menu_list");
  Router.push("/signin");
}

export default instance;
