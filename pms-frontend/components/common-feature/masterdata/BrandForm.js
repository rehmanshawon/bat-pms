import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Form, Row, Button } from "antd";
import { FormItem } from "@/apsisEngine/common/formValidations";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { swalError, swalSuccess } from "@/apsisEngine/helpers/helperService";
import ModalFooter from "@/components/common/ModalFooter";

const BrandForm = forwardRef(
  ({ editId, gridRef, handleCancel, ...props }, ref) => {
    //form initialize value
    const [form] = Form.useForm();
    const [defaultValues, setDefaultValues] = useState();

    const [formTitle, setFormTitle] = useState();
    const [sectionFields, setSectionFields] = useState();
    BrandForm.displayName = "BrandForm";
    useImperativeHandle(ref, () => ({
      resetForm() {
        form.resetFields();
        setDefaultValues({});
      },
    }));

    //get form element
    const getFields = async () => {
      let response = await fetchWrapper.post("masterform/getformdata", {
        form_slug: "brand_form",
      });
      if (response.data) {
        const { form_title, form_element } = response.data;
        setFormTitle(form_title);
        setSectionFields(form_element["sec_1"]);
      }
    };

    //get Brand item
    const getBrandItem = async () => {
      await fetchWrapper
        .get("brands/" + editId)
        .then((response) => {
          if (!response.error) {
            //setDefaultValues(response?.data[0] ?? {});
            const data = response.data;
            setDefaultValues(data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    //get on load data
    useEffect(() => {
      getFields();
      if (editId) {
        getBrandItem();
      } else {
        form.setFieldsValue({});
        form.resetFields();
      }
    }, [editId]);

    useEffect(() => {
      form.setFieldsValue(defaultValues);
    }, [form, defaultValues]);

    // const validateMessages = {
    //   required: "${label} is required!",
    //   types: {
    //     email: "${label} is not a valid email!",
    //     number: "${label} is not a valid number!",
    //   },
    //   number: {
    //     range: "${label} must be between ${min} and ${max}",
    //   },
    // };

    //Store Brand
    const storeData = async (values) => {
      await fetchWrapper
        .post("brands", values)
        .then((response) => {
          if (!response.error) {
            swalSuccess("Brand Created Successfully");
            setDefaultValues({});
            gridRef.current.fetchInfo();
          } else {
            swalError("Brand couldn't create");
          }
        })
        .catch((error) => {
          swalError(error.message);
        })
        .finally(() => {
          if (handleCancel) handleCancel();
        });
    };

    //update Brand Information
    const updateData = async (values) => {
      await fetchWrapper
        .patch("brands/" + editId, values)
        .then((response) => {
          if (!response.error) {
            swalSuccess("Brand Updated Successfully");
            setDefaultValues({ ...values });

            gridRef.current.fetchInfo();
          } else {
            swalError("Brand couldn't update");
          }
        })
        .catch((error) => {
          swalError(error.message);
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

    return (
      <>
        <Form
          form={form}
          name="customized_form_controls"
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
                          <FormItem key={field.input_name} field={field} />
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

export default BrandForm;
