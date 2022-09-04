import React, { useEffect, useState } from "react";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
import FormFooter from "components/common/FormFooter";
// import {
//   AssetImage,
//   BreakLine,
//   ShowInfo,
// } from "components/styles/FixedAsset";
import {
  FormInput,
  FormItem,
  swalError,
  swalSuccess,
} from "apsisEngine/common/formValidations";
import { Form, Row, Col } from "antd";
//import moment from "moment";
import { useRouter } from "next/router";

const UserEntryForm = ({ editMode, id }) => {
  const [form] = Form.useForm();
  const [defaultValues, setDefaultValues] = useState();
  const router = useRouter();
  const [formTitle, setFormTitle] = useState();
  const [sectionFields, setSectionFields] = useState();

  const getFields = async () => {
    let response = await fetchWrapper.post("masterform/getformdata", {
      form_slug: "user_form",
    });
    if (response.data) {
      const { form_title, form_element } = response.data;
      setFormTitle(form_title);
      setSectionFields(form_element["sec_1"]);
    }
  };

  const stateChange = (event) => {
    const { name, value } = event.target;
  };

  const handleSubmit = (values) => {
    if (editMode) {
      updateData(values);
    } else {
      storeData(values);
    }
  };

  const validate = (mobile) => {
    let isValid = true;
    let errors = [];
    if (typeof mobile !== "undefined") {
      //var pattern = new RegExp(/^[0-9\b]+$/);
      var pattern = new RegExp(/^([+]{1}[8]{2}|0088)?(01){1}[3-9]{1}\d{8}$/);
      if (!pattern.test(mobile)) {
        isValid = false;
        errors = "Please enter valid BD phone number.";
      }
    }
    return errors;
  };

  const storeData = (values) => {
    let payLoad = { ...values };

    fetchWrapper
      .post("user", payLoad)
      .then((response) => {
        if (!response.error) {
          swalSuccess(response.message);
          router.push({
            pathname: `/system-admin/users`,
          });
        } else {
          swalError(response.message);
        }
      })
      .catch((error) => {
        console.log(error);
        swalError(error.message);
      });
  };

  const updateData = (values) => {
    let payLoad = { ...values };
    let id = defaultValues.user_id;

    let valid_phone = validate(payLoad.mobile);

    if (valid_phone.length > 0) {
      swalError(valid_phone);
    } else {
      fetchWrapper
        .patch("user/" + id, payLoad)
        .then((response) => {
          if (!response.error) {
            swalSuccess(response.message);
            router.push({
              pathname: `/system-admin/users`,
            });
          } else {
            swalError(response.message);
          }
        })
        .catch((error) => {
          console.log(error);
          swalError(error.message);
        });
    }
  };

  const getUserData = async (id) => {
    let response = await fetchWrapper.get("/user/" + id);
    if (!response.error) {
      // const moduleData = [
      //   { key: '4', value: 'Budget' }
      // ]
      // response.data.user_modules_permission = moduleData;
      setDefaultValues(response.data);
    }
  };

  //get on load data
  useEffect(() => {
    getFields();
  }, []);

  //get on load data
  useEffect(() => {
    if (id && editMode) {
      getUserData(id);
    }
  }, [id, editMode]);

  useEffect(() => {
    if (defaultValues) {
      form.setFieldsValue(defaultValues);
    } else {
      form.resetFields();
    }
  }, [form, defaultValues]);

  return (
    <>
      <div className="main-wrap">
        <div className="card card-xl-stretch">
          <div className="master_grid">
            <div className="title_area">
              <div className="gridTitle">
                <h6>
                  <span className="fa fa-file-text mr-2"></span>{" "}
                  {editMode ? "User Edit Form" : "User Entry Form"}
                </h6>
              </div>
              <div className="gridTitle">
                <h6 className="d-flex justify-content-between">
                  <>
                    {editMode && defaultValues ? (
                      <span> Code : {defaultValues.user_code} </span>
                    ) : (
                      <></>
                    )}
                  </>
                </h6>
              </div>
            </div>

            <Form form={form} onFinish={handleSubmit}>
              <div className="form-section">
                <div className="section-body">
                  <div className="section-body p-3">
                    <Row gutter={16}>
                      {sectionFields &&
                        sectionFields.map((field, i) => {
                          return (
                            <>
                              {!editMode && (
                                <FormItem
                                  key={field.input_name}
                                  field={field}
                                  getEvent={stateChange}
                                />
                              )}

                              {editMode &&
                                !["email", "user_name"].includes(field.input_name) && (
                                  <FormItem
                                    key={field.input_name}
                                    field={field}
                                    getEvent={stateChange}
                                  />
                                )}

                              {editMode && field.input_name == "user_name" && (
                                <Col className="col-lg-4 pt-1">
                                  <label className="col-form-label inputForm">
                                    User Name
                                  </label>
                                  <FormInput
                                    name="user_name"
                                    type="text"
                                    value={
                                      defaultValues
                                        ? defaultValues.user_name
                                        : ""
                                    }
                                    //getEvent={handleChange}
                                    readOnly={true}
                                  />
                                </Col>
                              )}

                              {editMode && field.input_name == "email" && (
                                <Col className="col-lg-4 pt-1">
                                  <label className="col-form-label inputForm">
                                    Email
                                  </label>
                                  <FormInput
                                    name="email"
                                    type="text"
                                    value={
                                      defaultValues ? defaultValues.email : ""
                                    }
                                    //getEvent={handleChange}
                                    readOnly={true}
                                  />
                                </Col>
                              )}
                            </>
                          );
                        })}
                    </Row>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-2">
                <FormFooter
                  backLink="/apsis-engine/users"
                  submitText={editMode ? "Update" : "Save"}
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserEntryForm;
