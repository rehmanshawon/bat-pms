/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { Form, Card, Row, Col, List } from "antd";
import { FormItem } from "@/apsisEngine/common/formValidations";
import FormFooter from "@/components/common/FormFooter";
import { swalSuccess, swalError } from "@/apsisEngine/helpers/helperService";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { async } from "rxjs";
const CodeMirror = dynamic(
  () => {
    import(
      process.env.NEXT_PUBLIC_NODE_MODULES_PATH + "codemirror/mode/sql/sql"
    );
    return import("react-codemirror");
  },
  { ssr: false }
);

const createHints = [
  "Keep in mind the database is in Oracle.",
  "Use single quotes (' ') instead of double quotes (\" \") inside query.",
  "Use full group by if possible when using join query.",
  "Try to run the query before creating the Dropdown.",
];

export const DropDownForm = ({ data, editMode, id }) => {
  const [formTitle, setFormTitle] = useState("");
  const [sectionFields1, setSectionFields1] = useState([]);
  const [sectionFields2, setSectionFields2] = useState([]);
  const [sectionFields3, setSectionFields3] = useState([]);
  //form value state
  const [formState, updateFormState] = useState(data ?? {});
  const [actionTables, setActionTables] = useState([]);
  const [actionTablesArray, setActionTablesArray] = useState([]);
  const [columns, setcolumns] = useState([]);
  const [form] = Form.useForm();

  const router = useRouter();

  const getFields = async () => {
    let response = await fetchWrapper
      .post("masterform/getformdata", {
        form_slug: "dropdowngrid_form",
      })
      .catch((error) => console.log(error));

    if (response.data) {
      const { form_title, form_element } = response.data;

      setFormTitle(form_title);
      setSectionFields1(form_element["sec_1"]);
      setSectionFields2(form_element["sec_2"]);
      setSectionFields3(form_element["sec_3"]);
    }
  };

  const prepareColumnList = (value) => {
    const string = value.replace("SELECT", "");
    const options = string.split(",");
    const columns = options.map((item) => {
      return {
        label: item.trim(),
        value: item.trim(),
      };
    });
    setcolumns(columns);
  };

  const stateChange = (event) => {
    // get data form event
    const { name, value } = event.target;

    if (name == "sql_select") {
      prepareColumnList(value);
    }

    if (name == "action_table") {
      const selectedTable = actionTablesArray.find(
        (item) => item.table_name == value
      );
      form.setFieldsValue({ primary_key_field: selectedTable?.primary_key });
    }

    updateFormState({
      ...formState,
      [name]: value,
    });
  };

  //submit Handler
  const onFinish = async (values) => {
    if (Array.isArray(values.search_columns)) {
      values.search_columns = values.search_columns.toString();
    }

    const formData = { ...formState, ...values };
    if (editMode == true) {
      fetchWrapper
        .patch("/dropdown/" + id, formData)
        .then((response) => {
          if (!response.error) {
            swalSuccess(response.message).then(() =>
              router.push("/apsis-engine/dropdown")
            );
          } else {
            swalError(response.message);
          }
        })
        .catch((error) => {
          console.log(error);
          swalError(error.message);
        });
    } else {
      await fetchWrapper
        .post("/dropdown", formData)
        .then((response) => {
          if (!response.error) {
            swalSuccess(response.message).then(() =>
              router.push("/apsis-engine/dropdown/")
            );
          } else {
            swalError(response.message);
            console.log(response);
          }
        })
        .catch((error) => {
          console.log(error);
          swalError(error.message);
        });
    }
  };

  useEffect(() => {
    getFields();
  }, [data]);

  return (
    <>
      <div className="main-wrap">
        <div className="card card-xl-stretch my-3">
          <div className="card-header">
            <h4 className="font-weight-bold">{formTitle}</h4>
            <List
              size="small"
              bordered
              dataSource={createHints}
              renderItem={(item) => (
                <List.Item className="text-danger">{item}</List.Item>
              )}
            />
          </div>
          <Form
            form={form}
            name="mastergrid_form"
            layout="horizontal"
            onFinish={onFinish}
            initialValues={formState}
          >
            <div className="card-body pt-3 pb-0">
              <div className="form-section">
                <div className="section-body">
                  <div className="row justify-content-start">
                    {sectionFields1 &&
                      sectionFields1.map((field, index) => {
                        return (
                          <FormItem
                            key={field.input_name}
                            field={field}
                            getEvent={stateChange}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body pt-2 pb-0">
              <div className="form-section">
                <div className="section-body">
                  <Row gutter={24}>
                    {sectionFields2 &&
                      sectionFields2.map((field, index) => {
                        return field.input_name == "mastergrid_checkbox" ? (
                          <FormItem
                            key={field.input_name}
                            field={field}
                            getEvent={stateChange}
                          />
                        ) : (
                          <Col span={12} className="mb-2">
                            <div className="ant-form-item-label mb-2">
                              <label>
                                {field.required ? (
                                  <span className="text-danger">*&nbsp;</span>
                                ) : null}
                                {field.label_name}
                              </label>
                            </div>
                            {
                              <CodeMirror
                                className="editor"
                                value={formState[field.input_name]}
                                name={field.input_name}
                                options={{
                                  lineNumbers: true,
                                  mode: "sql",
                                }}
                                onChange={(v) => {
                                  const e = {
                                    target: {
                                      name: field.input_name,
                                      value: v,
                                    },
                                  };
                                  stateChange(e);
                                }}
                              />
                            }
                          </Col>
                        );
                      })}
                  </Row>
                </div>
              </div>
            </div>

            <div className="card-body pt-2 pb-0">
              <div className="form-section">
                <div className="section-body">
                  <div className="row justify-content-start">
                    {sectionFields3 &&
                      sectionFields3.map((field, index) => {
                        // if (field.input_name == "action_table") {
                        //   field.dropdown_options = JSON.stringify(actionTables);
                        // }
                        if (field.input_name == "search_columns") {
                          field.dropdown_options = JSON.stringify(columns);
                        }

                        return (
                          <FormItem
                            key={field.input_name}
                            field={field}
                            getEvent={stateChange}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            <FormFooter backLink="/apsis-engine/dropdown" />
          </Form>
        </div>
      </div>
    </>
  );
};

export default DropDownForm;
