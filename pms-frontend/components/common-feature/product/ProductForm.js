/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment } from "react";
import { Form, Row } from "antd";
import { FormItem } from "@/apsisEngine/common/formValidations";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { swalError, swalSuccess } from "@/apsisEngine/helpers/helperService";
import FormFooter from "@/components/common/FormFooter";
import router from "next/router";
import { apsisEncrypt } from "@/apsisEngine/helpers/apsisEncryption";

export const ProductForm = (props) => {
  const [form] = Form.useForm();
  const [formTitle, setFormTitle] = useState();
  const [sectionFields1, setSectionFields1] = useState();
  const [sectionFields2, setSectionFields2] = useState();
  const [product_category_id, setProductCatId] = useState();
  const [uomsMeasurement, setuomsMeasurement] = useState();
  const [formState, setformState] = useState({
    minimum_order_qty: 0,
    reorder_qty: 0,
    last_purchase_price: 0,
    stock_out_type: "FIFO",
  });

  const getFields = async () => {
    let response = await fetchWrapper.post("masterform/getformdata", {
      form_slug: "product_form",
    });

    if (response.data) {
      const { form_title, form_element } = response.data;
      setFormTitle(form_title);
      setSectionFields1(form_element["sec_1"]);
      setSectionFields2(form_element["sec_2"]);
    }
  };

  //submit Handler
  const onFinish = (values) => {
    const newData = {
      uoms_measurement: JSON.stringify({
        [formState.default_uom]: 1,
        ...uomsMeasurement,
      }),
    };

    const newValues = Object.fromEntries(
      Object.entries(values).filter(
        ([key]) =>
          key != "other_uoms" &&
          !key.startsWith("measurement_") &&
          !key.startsWith("product_types_")
      )
    );
    newValues;

    const newFormState = Object.fromEntries(
      Object.entries(formState).filter(
        ([key]) =>
          key != "other_uoms" &&
          !key.startsWith("measurement_") &&
          !key.startsWith("product_types_")
      )
    );

    const formData = {
      ...newValues,
      ...newFormState,
      ...newData,
      product_category_id,
      service_name,
    };
    const { product_category, ...rest } = formData;
    const payload = {
      ...rest,
      product_category: product_category[0].toString(),
    };
    if (props.editMode == true) {
      fetchWrapper
        .patch("product/" + props.id, payload)
        .then((response) => {
          if (!response.error) {
            swalSuccess("Product Updated Successfully");
            props.setproductId(props.id);
            props.setactiveKey("2");
          } else {
            swalError("Product couldn't update");
          }
        })
        .catch((error) => {
          console.log(error);
          swalError("Product couldn't update");
        });
    } else {
      fetchWrapper
        .post("product", payload)
        .then((response) => {
          if (!response.error) {
            swalSuccess("Product Created Successfully");
            router.push({
              pathname:
                "/common-feature/product/" +
                apsisEncrypt(response.data.toString()) +
                "/edit",
              query: { tab: "2" },
            });
          } else {
            swalError("Product couldn't create");
          }
        })
        .catch((error) => {
          console.log(error);
          swalError("Product couldn't create");
        });
    }
  };

  const adjustProductTypes = (decisions = [], newFormState = formState) => {
    let product_types = form.getFieldValue("product_types_type") ?? "";
    if (decisions.length > 0) {
      product_types += ",";
      product_types += decisions.toString();
    }

    setformState({
      ...newFormState,
      product_types: product_types,
    });
  };
  const [service_name, setServiceName] = useState("");
  const checkCategory = (catId, newFormState = formState) => {
    fetchWrapper
      .get("category/" + catId)
      .then((response) => {
        if (!response.error) {
          const data = response.data;
          const decisions = form.getFieldValue("product_types_decision") ?? [];
          if (data.operational_group == "CAPEX") {
            if (!decisions.includes(13)) {
              decisions.push(13);
            }
          } else {
            if (decisions.includes(13)) {
              decisions.splice(decisions.indexOf(13), 1);
            }
          }
          setServiceName(data.service_name);
          const newValues = {
            ...form.getFieldsValue(),
            product_types_decision: decisions,
            operational_group: data.operational_group,
            vat_service_id: data.service_id,
            // service_name: data.service_name,
          };
          form.setFieldsValue(newValues);
          adjustProductTypes(decisions, newFormState);
        }
      })
      .catch((error) => console.log(error));
  };

  //handle event
  const handleEvent = (event) => {
    const { name, value } = event.target;

    if (name.startsWith("measurement_")) {
      const uom = name.split("_")[1];
      setuomsMeasurement({ ...uomsMeasurement, [uom]: value });
    } else if (name == "product_category") {
      const parentCategory = [...value].pop();

      const newFormState = {
        ...formState,
        product_category_id: parentCategory,
        product_category: value.toString(),
      };
      console.log("cid...", newFormState);
      setProductCatId(parentCategory);
      checkCategory(parentCategory, newFormState);
    } else if (name.startsWith("product_types_")) {
      adjustProductTypes(form.getFieldValue("product_types_decision"));
    } else {
      setformState((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    getFields();
    if (props.formState) {
      const uoms = JSON.parse(props.formState.uoms_measurement);
      let uomData = {};

      if (uoms) {
        uomData = Object.fromEntries(
          Object.entries(uoms).map(([key, val]) => [`measurement_${key}`, val])
        );
      }

      const productCategory = props.formState.product_category
        ? props.formState.product_category.split(",")
        : [];

      const productTypes = props.formState.product_types
        ? props.formState.product_types.split(",")
        : [];

      const productCategoryIds = productCategory.map((cat) => parseInt(cat));
      const productTypeIds = productTypes.map((type) => parseInt(type));

      const formState = {
        ...props.formState,
        other_uoms: uoms ? Object.keys(uoms) : [],
        ...uomData,
      };

      setformState(formState);
      setuomsMeasurement(uoms);
      form.setFieldsValue({
        ...formState,
        product_category: productCategoryIds,
        product_types_type: productTypeIds.shift(),
        product_types_decision: productTypeIds,
      });
    }
  }, []);

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  return (
    <>
      <div className="main-wrap">
        <div className="card card-xl-stretch my-3">
          <div className="card-header border-0 px-3 py-2 d-flex justify-content-between">
            <h4 className="card-title fw-bolder text-dark mb-0">
              {formTitle ?? ""}
            </h4>
          </div>

          <Form
            form={form}
            name="customized_form_controls"
            layout="horizontal"
            validateMessages={validateMessages}
            onFinish={onFinish}
            initialValues={formState}
          >
            <div className="card-body pt-2">
              <div className="form-section">
                <h6 className="section-title"> </h6>
                <div className="section-body">
                  <Row gutter={16}>
                    {sectionFields1 &&
                      sectionFields1.map((field, index) => {
                        return (
                          <Fragment key={index}>
                            {field.input_name != "stock_out_type" && (
                              <FormItem
                                key={field.input_name}
                                field={field}
                                getEvent={handleEvent}
                                readOnly={
                                  field.input_name == "operational_group"
                                }
                              />
                            )}
                            {formState.operational_type == "Goods" &&
                              field.input_name == "stock_out_type" && (
                                <FormItem
                                  key={field.input_name}
                                  field={field}
                                  getEvent={handleEvent}
                                />
                              )}
                          </Fragment>
                        );
                      })}
                  </Row>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="form-section">
                <div className="section-body">
                  <div className="row d-flex justify-content-start mt-2">
                    <div className="col-md-4">
                      {formState?.default_uom &&
                        formState?.other_uoms &&
                        formState.other_uoms.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td style={{ width: "10%" }}>
                                <span className="text-bold">{`1 ${item} = `}</span>
                              </td>
                              <td
                                style={{
                                  width: "20%",
                                }}
                              >
                                <FormItem
                                  key={`measurement_${item}`}
                                  field={{
                                    input_name: `measurement_${item}`,
                                    input_type: "number",
                                    element_column: 24,
                                  }}
                                  getEvent={handleEvent}
                                />
                              </td>
                              <td
                                style={{
                                  width: "10%",
                                  textAlign: "center",
                                }}
                              >
                                <span className="text-bold">
                                  {formState.default_uom}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="form-section">
                <div className="section-body">
                  <Row gutter={16}>
                    {sectionFields2 &&
                      sectionFields2.map((field, index) => {
                        return (
                          <FormItem
                            key={field.input_name}
                            field={field}
                            getEvent={handleEvent}
                          />
                        );
                      })}
                  </Row>
                </div>
              </div>
            </div>

            <FormFooter backLink="/common-feature/product" />
          </Form>
        </div>
      </div>
    </>
  );
};

export default React.memo(ProductForm);
