import React, {
  useEffect,
  Fragment,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Form, Row, Col, Input, Select, Button } from "antd";
import { FormItem } from "apsisEngine/common/formValidations";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
import { swalError, swalSuccess } from "apsisEngine/helpers/helperService";
import ModalFooter from "components/common/ModalFooter";

// eslint-disable-next-line react/display-name
const DepartmentForm = forwardRef(
  ({ editId, gridRef, handleCancel, ...props }, ref) => {
    //form initialize value
    const [form] = Form.useForm();
    const [defaultValues, setDefaultValues] = useState();

    const [formTitle, setFormTitle] = useState();
    const [sectionFields, setSectionFields] = useState();

    useImperativeHandle(ref, () => ({
      resetForm() {
        form.resetFields();
        setDefaultValues({});
      },
    }));

    //get form element
    const getFields = async () => {
      let response = await fetchWrapper.post("masterform/getformdata", {
        form_slug: "department_form",
      });
      if (response.data) {
        const { form_title, form_element } = response.data;
        setFormTitle(form_title);
        setSectionFields(form_element["sec_1"]);
      }
    };

    //get Brand item
    const getDepartment = async () => {
      await fetchWrapper
        .get("department/" + editId)
        .then((response) => {
          if (!response.error) {
            const data = response.data;
            if(data instanceof Array){           
            setDefaultValues(data[0]);
            form.setFieldsValue(data[0]);
            }
            else{
              setDefaultValues(data);
            form.setFieldsValue(data);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

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
    //get on load data
    useEffect(() => {
      getFields();
      if (editId) {
        getDepartment();
      } else {
        form.setFieldsValue({});
        form.resetFields();
      }
    }, [editId]);

    useEffect(() => {
      form.setFieldsValue(defaultValues);
    }, [form, defaultValues]);
    //Store Brand
    const storeData = async (values) => {
      const data = { ...defaultValues, ...values };
      await fetchWrapper
        .post("department", data)
        .then((response) => {
          if (!response.error) {
            swalSuccess("Department Created Successfully").then(() => {
              setDefaultValues({});
              gridRef.current.fetchInfo();
            });
          } else {
            swalError("Department couldn't be created");
          }
        })
        .finally(() => {
          if (handleCancel) handleCancel();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    //update Brand Information
    const updateData = async (values) => {
      const data = { ...defaultValues, ...values };
      await fetchWrapper
        .patch("department/" + editId, data)
        .then((response) => {
          if (!response.error) {
            swalSuccess("Department Updated Successfully").then(() => {
              setDefaultValues({});
              gridRef.current.fetchInfo();
            });
            //gridRef.current.setState({ selectedRowKeys: [] });
          } else {
            swalError("Department couldn't be updated");
          }
        })

        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          if (handleCancel) handleCancel();
        });
    };

    //form Submit
    const onFinish = (values) => {
      if (editId) updateData(values);
      else storeData(values);
    };

    // const getEvent = (e) => {
    //   const { name, value, selectedItem } = e.target;
    //   console.log(selectedItem);
    //   if (name == "parent_category_id") {
    //     setDefaultValues({
    //       ...defaultValues,
    //       [name]: value,
    //       //parent_categories: selectedItem[0].label,
    //     });
    //   }
    //   9;
    // };
//console.log(defaultValues,sectionFields);
    return (
      <>
        <Form
          form={form}
          name="department_form_controls"
          layout="horizontal"
          onFinish={onFinish}
          initialValues={defaultValues}
        >
          <div className="main-wrap">
            <div className="card card-xl-stretch">
              <div className="card-body pt-2">
                <div className="form-section">
                  <div className="section-body">
                    <Row gutter={16}>
                      {sectionFields &&
                        sectionFields.map((field) => (
                          <FormItem
                            key={field.input_name}
                            field={field}
                            //getEvent={getEvent}
                          />
                        ))}
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ModalFooter handleCancel={handleCancel} />
        </Form>
      </>
    );
  }
);

export default DepartmentForm;
