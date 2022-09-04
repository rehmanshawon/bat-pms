/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { Form, Card, Row, Col, List, Checkbox } from "antd";
import { FormItem } from "@/apsisEngine/common/formValidations";
import FormFooter from "@/components/common/FormFooter";
import { swalSuccess, swalError } from "@/apsisEngine/helpers/helperService";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
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
  "Try to run the query before creating the mastergrid.",
];

export const MastergridForm = ({ data, editMode, id }) => {
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
  // const [onCall, setonCall] = useState(false);
  const [enableForm, setEnableForm] = useState(false);
  const [isSelectable, setisSelectable] = useState(false);
  const [exportExcel, setExportExcel] = useState(false);
  const [exportPdf, setExportPdf] = useState(false);
  const [exportCsv, setExportCsv] = useState(false);
  const [exportPrinting, setExportPrinting] = useState(false);
  const [clientSide, setClientSide] = useState(false);
  const [gridCheckbox, setgridCheckbox] = useState(false);
  const [gridSerial, setgridSerial] = useState(false);
  const [taggHtml, settaggHtml] = useState(false);
  const router = useRouter();
  const getOnCall = (e) => {
    console.log(e.target);
    const name = e.target.name;
    switch (name) {
      case "enable_form":
        setEnableForm(e.target.checked);
        break;
      case "is_selectable":
        setisSelectable(e.target.checked);
        break;
      case "export_excel":
        setExportExcel(e.target.checked);
        break;
      case "export_pdf":
        setExportPdf(e.target.checked);
        break;
      case "export_csv":
        setExportCsv(e.target.checked);
        break;
      case "export_printing":
        setExportPrinting(e.target.checked);
        break;
      case "client_side":
        setClientSide(e.target.checked);
        break;
      case "grid_checkbox":
        setgridCheckbox(e.target.checked);
        break;
      case "grid_serial":
        setgridSerial(e.target.checked);
        break;
      case "tagg_html":
        settaggHtml(e.target.checked);
        break;
      default:
        console.log(`Sorry, we are out of ${name}.`);
    }
  };
  const getFields = async () => {
    let response = await fetchWrapper
      .post("masterform/getformdata", {
        form_slug: "mastergrid_form",
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

  const getActionTablesData = () => {
    fetchWrapper
      .get("master-grid/table-info")
      .then((response) => {
        if (!response.error) {
          const data = response.data;
          setActionTablesArray(data);
          const tables = data.map((item) => {
            return {
              label: item.table_name,
              value: item.table_name,
            };
          });

          setActionTables(tables);
        }
      })
      .catch((error) => console.log(error));
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
  const onFinish = (values) => {
    let checkboxes = {};
    if (values.mastergrid_checkbox) {
      values.mastergrid_checkbox.forEach((item) => (checkboxes[item] = 1));
    }
    if (!values.hide_columns) values.hide_columns = [];

    delete values.mastergrid_checkbox;

    if (Array.isArray(values.search_columns)) {
      values.search_columns = values.search_columns.toString();
    }
    if (Array.isArray(values.page_customize)) {
      values.page_customize = values.page_customize.sort().toString();
    }

    const formData = { ...formState, ...values, ...checkboxes };
    formData.enable_form = enableForm == true ? 1 : 0;
    formData.is_selectable = isSelectable == true ? 1 : 0;
    formData.export_excel = exportExcel == true ? 1 : 0;
    formData.export_pdf = exportPdf == true ? 1 : 0;
    formData.export_csv = exportCsv == true ? 1 : 0;
    formData.export_printing = exportPrinting == true ? 1 : 0;
    formData.client_side = clientSide == true ? 1 : 0;
    formData.grid_checkbox = gridCheckbox == true ? 1 : 0;
    formData.grid_serial = gridSerial == true ? 1 : 0;
    formData.tagg_html = taggHtml == true ? 1 : 0;
    console.log("Payload", formData);
    if (editMode == true) {
      fetchWrapper
        .patch("master-grid/data/" + id, formData)
        .then((response) => {
          if (!response.error) {
            swalSuccess(response.message).then(() =>
              router.push("/apsis-engine/mastergrid")
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
      fetchWrapper
        .post("master-grid/create", formData)
        .then((response) => {
          if (!response.error) {
            swalSuccess(response.message).then(() =>
              router.push("/apsis-engine/mastergrid")
            );
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

  useEffect(() => {
    getFields();
    getActionTablesData();
    if (editMode && data) {
      updateFormState(data);
      form.setFieldsValue(data);
      prepareColumnList(data.sql_select);
    }
  }, [data, editMode]);

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
                        if (field.input_name == "action_table") {
                          field.dropdown_options = JSON.stringify(actionTables);
                        }
                        if (
                          field.input_name == "hide_columns" ||
                          field.input_name == "search_columns"
                        ) {
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
                    <Row gutter={24}>
                      <Col span={6}>
                        <Checkbox
                          name="enable_form"
                          className="pl-3 pb-3"
                          onChange={getOnCall}
                          checked={enableForm}
                        >
                          Enable Form
                        </Checkbox>
                        <br></br>
                        <Checkbox
                          name="is_selectable"
                          className="pl-3 pb-3"
                          onChange={getOnCall}
                          checked={isSelectable}
                        >
                          Is Selectable
                        </Checkbox>
                        <br></br>
                        <Checkbox
                          name="export_excel"
                          className="pl-3 pb-3"
                          onChange={getOnCall}
                          checked={exportExcel}
                        >
                          Enable Excel
                        </Checkbox>
                        <br></br>
                        <Checkbox
                          name="export_pdf"
                          className="pl-3 pb-3"
                          onChange={getOnCall}
                          checked={exportPdf}
                        >
                          Enable Pdf
                        </Checkbox>
                        <br></br>
                        <Checkbox
                          name="export_csv"
                          className="pl-3 pb-3"
                          onChange={getOnCall}
                          checked={exportCsv}
                        >
                          Enable Csv
                        </Checkbox>
                      </Col>
                      <Col span={6}>
                        <Checkbox
                          name="export_printing"
                          className="pl-3 pb-3"
                          onChange={getOnCall}
                          checked={exportPrinting}
                        >
                          Enable Printing
                        </Checkbox>
                        <br></br>
                        <Checkbox
                          name="client_side"
                          className="pl-3 pb-3"
                          onChange={getOnCall}
                          checked={clientSide}
                        >
                          Client Side
                        </Checkbox>
                        <br></br>
                        <Checkbox
                          name="grid_checkbox"
                          className="pl-3 pb-3"
                          onChange={getOnCall}
                          checked={gridCheckbox}
                        >
                          Grid Checkbox
                        </Checkbox>
                        <br></br>
                        <Checkbox
                          name="grid_serial"
                          className="pl-3 pb-3"
                          onChange={getOnCall}
                          checked={gridSerial}
                        >
                          Grid Serial
                        </Checkbox>
                        <br></br>
                        <Checkbox
                          name="tagg_html"
                          className="pl-3 pb-3"
                          onChange={getOnCall}
                          checked={taggHtml}
                        >
                          Tagg HTML
                        </Checkbox>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </div>

            <FormFooter backLink="/apsis-engine/mastergrid" />
          </Form>
        </div>
      </div>
    </>
  );
};

export default MastergridForm;
