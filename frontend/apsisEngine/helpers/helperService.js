//sweet alert
import Swal from "sweetalert2";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
// import { useHistory } from "react-router-dom";

export function swalConfirm($msg, $title, $cText) {
  try {
    let result = Swal.fire({
      title: $title || "Are you sure",
      text: $msg ? $msg : "you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: $cText || "Yes, Confirm",
      allowOutsideClick: false,
    });
    return result;
  } catch (e) {
    // Fail!
    console.error(e);
    return false;
  }
}

//Error Message
export function swalError($msg, $title = "Oops...") {
  try {
    let result = Swal.fire({
      icon: "error",
      title: $title,
      text: $msg,
      allowOutsideClick: false,
    });
    return result;
  } catch (e) {
    // Fail!
    console.error(e);
    return false;
  }
}

//Success Message
export function swalSuccess(
  $text = "Your work has been saved!",
  $title = "Success!",
  $html = false
) {
  try {
    let result = "";
    if ($html != false) {
      result = Swal.fire({
        icon: "success",
        title: $title,
        html: $html,
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 2500,
      });
    } else {
      result = Swal.fire({
        icon: "success",
        title: $title,
        text: $text,
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 2500,
      });
    }
    return result;
  } catch (e) {
    // Fail!
    console.error(e);
    return false;
  }
}

export async function changeModule(moduleId) {
  if (moduleId) {
    await fetchWrapper
      .get(`modulechanger/${moduleId}`)
      .then((response) => {
        if (!response.error) {
          const module = response.data;
          localStorage.setItem(
            "module_info",
            JSON.stringify(module.module_info)
          );
          localStorage.setItem("menu_list", JSON.stringify(module.menu_list));
          // Message.success("Sign in complete. Taking you to your dashboard!");
          window.location.href = module.module_info.module_url;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    window.location.href = "/landing-page";
  }
}

export async function getAuthorizedModules() {
  await fetchWrapper
    .get("modulechanger/authorized-list")
    .then((response) => {
      localStorage.setItem("module_list", JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}

const toObject = (arr) =>
  arr.reduce((a, b) => ({ ...a, [b.label]: b.value }), {});

export async function getUomPrecision() {
  await fetchWrapper
    .post("dropdown/dropdowndata", {
      dropdown_slug: "uom_precision",
    })
    .then((response) => {
      if (!response.error) {
        const data = toObject(response.data);
        localStorage.setItem("uom_precision", JSON.stringify(data));
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//get form element
export async function getFormData(slug) {
  let response = await fetchWrapper.post("masterform/getformdata", {
    form_slug: slug,
  });
  if (response.data) {
    return response.data;
  } else {
    return null;
  }
}
