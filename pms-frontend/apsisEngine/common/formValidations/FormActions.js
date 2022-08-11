import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { useRouter } from "next/router";

export class FormAction {
  //get data form API
  static getData = async (API_ENDPOINT) => {
    return new Promise(async (resolve, reject) => {
      await fetchWrapper.get(API_ENDPOINT).then((resp) => {
        if (!resp.error) resolve(resp);
        else reject(resp.error);
      });
    });
  };

  //post data to API
  static postData = async (API_ENDPOINT, DATA = "") => {
    return new Promise(async (resolve, reject) => {
      await fetchWrapper.post(API_ENDPOINT, DATA).then((resp) => {
        if (!resp.error) resolve(resp);
        else reject(resp.error);
      });
    });
  };

  //patch data to API
  static patchData = async (API_ENDPOINT, DATA = "") => {
    return new Promise(async (resolve, reject) => {
      await fetchWrapper.patch(API_ENDPOINT, DATA).then((resp) => {
        if (!resp.error) resolve(resp);
        else reject(resp.error);
      });
    });
  };
}
export default FormAction;

// export async function getResources(API_ENDPOINT) {
//   await fetchWrapper
//     .get("modulechanger/authorized-list")
//     .then((response) => {
//       localStorage.setItem("module_list", JSON.stringify(response.data));
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

// const getResources = async () => {
//   let response = await fetchWrapper.post("masterform/getformdata", {
//     form_slug: "brand_form",
//   });

//   if (response.data) {
//     const { form_title, form_element } = response.data;
//     setFormTitle(form_title);
//     setSectionFields(form_element["sec_1"]);
//   }
// };
