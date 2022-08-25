import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Form, Row } from "antd";
import { FormItem } from "@/apsisEngine/common/formValidations";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { swalError, swalSuccess } from "@/apsisEngine/helpers/helperService";
import ModalFooter from "@/components/common/ModalFooter";

const UOMForm = forwardRef(
  ({ editId, gridRef, handleCancel, ...props }, ref) => {
    //form initialize value
    const [form] = Form.useForm();
    const [defaultValues, setDefaultValues] = useState();

    const [formTitle, setFormTitle] = useState();
    const [sectionFields, setSectionFields] = useState();
    UOMForm.displayName = "UOMForm";
    useImperativeHandle(ref, () => ({
      resetForm() {
        form.resetFields();
        setDefaultValues({});
      },
    }));

    //get form element
    const getFields = async () => {
      let response = await fetchWrapper.post("masterform/getformdata", {
        form_slug: "uom_form",
      });
      if (response.data) {
        const { form_title, form_element } = response.data;
        setFormTitle(form_title);
        setSectionFields(form_element["sec_1"]);
      }
    };

    //get UOM item
    const getUomItem = async () => {
      await fetchWrapper
        .get("uom/" + editId)
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
        getUomItem();
      } else {
        form.setFieldsValue();
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

    //Store UOM
    const storeData = async (values) => {
      await fetchWrapper
        .post("uom", values)
        .then((response) => {
          if (!response.error) {
            swalSuccess("UOM Created Successfully");
            setDefaultValues({});
            gridRef.current.fetchInfo();
            //gridRef.current.setState({ selectedRowKeys: [] });
          } else {
            swalError("UOM couldn't create");
          }
        })
        .then(() => {
          if (handleCancel)
            setTimeout(() => {
              handleCancel();
            }, 2500);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    //update UOM Information
    const updateData = async (values) => {
      await fetchWrapper
        .patch("uom/" + editId, values)
        .then((response) => {
          if (!response.error) {
            swalSuccess("UOM Updated Successfully");
            const data = response.data;
            setDefaultValues(data);
            //setDefaultValues({});
            gridRef.current.fetchInfo();
            //gridRef.current.setState({ selectedRowKeys: [] });
          } else {
            swalError("UOM couldn't update");
          }
        })
        .then(() => {
          if (handleCancel)
            setTimeout(() => {
              handleCancel();
            }, 2500);
        })
        .catch((error) => {
          console.log(error);
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

export default UOMForm;
