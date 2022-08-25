/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, Fragment, useState } from "react";

import { FormItem } from "@/apsisEngine/common/formValidations";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { Button, Form, Select } from "antd";
import { swalError, swalSuccess } from "@/apsisEngine/helpers/helperService";
import { useRouter } from "next/router";

export const ProductVendorForm = (props) => {
  const router = useRouter();
  const product_id = props.productId;

  const [formTitle, setFormTitle] = useState();
  const [sectionFields1, setSectionFields1] = useState();

  const getFields = async () => {
    let response = await fetchWrapper.post("masterform/getformdata", {
      form_slug: "product_vendor_mapping",
    });

    if (response.data) {
      const { form_title, form_element } = response.data;
      setFormTitle(form_title);
      setSectionFields1(form_element["sec_1"]);
    }
  };

  //form value state
  const [formState, updateFormState] = useState({
    product_id: product_id,
  });
  const [form] = Form.useForm();

  const stateChange = (event) => {
    //get data form event
    const { name, value } = event.target;

    updateFormState({ ...formState, [name]: value });

    fetchWrapper
      .post("productvsvendor", { ...formState, [name]: value })
      .then((response) => {
        if (!response.error) {
          updateFormState({});
          swalSuccess("Product VS Vendors mapped Successfully");
          if (props.prodVendorRef.current) {
            props.prodVendorRef.current.fetchInfo();
          }
        } else {
          swalError("Product VS Vendors couldn't map");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getFields();
  }, []);

  return (
    <>
      <div className="main-wrap">
        <div className="card card-xl-stretch my-3">
          <div className="card-header border-0 px-4 py-2 d-flex justify-content-between">
            <h4 className="card-title fw-bolder text-dark mb-0">
              {formTitle ?? ""}
            </h4>
          </div>
          <Form form={form}>
            <div className="card-body pt-2">
              <div className="form-section">
                <div className="section-body">
                  <div className="row">
                    {sectionFields1 &&
                      sectionFields1.map((field, index) => {
                        return (
                          <Fragment key={index}>
                            <FormItem
                              key={field.input_name}
                              field={field}
                              getEvent={stateChange}
                            />
                          </Fragment>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ProductVendorForm;
