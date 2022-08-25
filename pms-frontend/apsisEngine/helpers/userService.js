import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import Router from "next/router";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("user"))
);

export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  logout,
};

function logout() {
  fetchWrapper
    .post("auth/logout")
    .then((response) => console.log(response))
    .catch((error) => console.log(error))
    .finally(() => {
      // remove user from local storage, publish null to user subscribers and redirect to login page
      localStorage.removeItem("user");
      localStorage.removeItem("module_info");
      localStorage.removeItem("menu_list");
      localStorage.removeItem("module_list");
      localStorage.removeItem("uom_precision");
      userSubject.next(null);
      Router.push("/signin");
    });
}
