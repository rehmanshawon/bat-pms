import FormArea from "@/apsisEngine/common/formArea";
import { Card, Col, Row, Form, Button, Spin } from "antd";
import React, { useEffect, useState } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { Select } from "antd";
const { Option } = Select;

import {
  FormInput,
  FormInputNumber,
  FormDatePicker,
} from "@/apsisEngine/common/formValidations";
import { swalError, swalSuccess } from "@/apsisEngine/helpers/helperService";

const DatabaseInsertion = () => {
  const mainTitle = "Database Insertion";
  const [form] = Form.useForm();
  const [defaultValues, setDefaultValues] = useState({});
  const [tableName, setTableName] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [fieldsList, setFieldsList] = useState([]);

  const [loading, setLoading] = useState(false);

  const stateChange = (event) => {
    const { name, value } = event.target;

    setDefaultValues({
      ...defaultValues,
      [name]: value,
    });
  };

  const dropDownChange = (name, value) => {
    setDefaultValues({
      ...defaultValues,
      [name]: value,
    });
  };

  const tableNameChange = (value) => {
    setTableName(value);
  };

  const getTableList = async () => {
    let response = await fetchWrapper.get("sys-data/table-list");
    if (!response.error) {
      setTableList(response.data);
    }
  };

  const getFieldValues = async (table_name) => {
    let response = await fetchWrapper.get("sys-data", {
      params: { table_name: table_name },
    });
    if (!response.error) {
      setLoading(false);
      console.log(response.data);
      let column_data = response.data.columns;
      let payload_obj = {};
      column_data.map((item) => {
        payload_obj[item.COLUMN_NAME] = ["status", "company_id"].includes(
          item.COLUMN_NAME
        )
          ? 1
          : null;
      });
      setDefaultValues(payload_obj);
      setFieldsList(response.data);
      setLoading(false);
    }
  };

  //render data
  const renderSwitch = (field, index) => {
    switch (field.DATA_TYPE.toLowerCase()) {
      case "text":
      case "varchar2":
      case "nvarchar2":
      case "email":
        return (
          <FormInput
            name={field.COLUMN_NAME}
            type={field.DATA_TYPE}
            placeholder={field.COLUMN_NAME ?? ""}
            getEvent={(e) => stateChange(e)}
          />
        );

      case "number":
        return (
          <FormInputNumber
            name={field.COLUMN_NAME}
            type={field.DATA_TYPE}
            placeholder={field.COLUMN_NAME ?? ""}
            getEvent={(e) => stateChange(e)}
          />
        );

      case "date":
      case "month":
      case "year":
        return (
          <FormDatePicker
            name={field.COLUMN_NAME}
            type={field.DATA_TYPE}
            placeholder={field.COLUMN_NAME ?? ""}
            getEvent={(e) => stateChange(e)}
          />
        );

      case "enum":
        return (
          <Select
            showSearch
            placeholder="Select"
            optionFilterProp="children"
            onChange={(e) => dropDownChange(field.COLUMN_NAME, e)}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {field.ENUM_VALUE &&
              field.ENUM_VALUE.map((item) => {
                return (
                  <>
                    <Option value={item}>{item}</Option>
                  </>
                );
              })}
          </Select>
        );

      default:
        return (
          <FormInput
            name={field.COLUMN_NAME}
            type={field.DATA_TYPE}
            placeholder={field.COLUMN_NAME ?? ""}
            getEvent={(e) => stateChange(e, field, index)}
          />
        );
    }
  };

  const onSearch = () => {
    setLoading(true);
    getFieldValues(tableName);
  };

  const onSubmit = () => {
    let payload = { ...defaultValues };
    payload.table_name = tableName;
    payload.apsis_columns = fieldsList.apsis_columns;

    fetchWrapper
      .post("sys-data", payload)
      .then((response) => {
        if (!response.error) {
          form.resetFields();
          setFieldsList([]);
          setDefaultValues({});
          swalSuccess(response.message);
        } else {
          swalError(response.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (defaultValues) {
      form.setFieldsValue(defaultValues);
    } else {
      form.resetFields();
    }
  }, [form, defaultValues]);

  useEffect(() => {
    getTableList();
  }, []);

  return (
    <>
      <FormArea mainTitle={mainTitle}>
        <Card className="apsisCard" bordered={true}>
          <div className="form-section">
            <div className="section-body">
              <div className="row justify-content-start">
                <Row gutter={16}>
                  <Col className="col-lg-12 pt-1">
                    <label className="col-form-label inputForm pr-2">
                      Table Name
                    </label>
                  </Col>
                  <Col className="col-lg-20">
                    <Select
                      style={{ width: 400 }}
                      showSearch
                      placeholder="Select a table"
                      optionFilterProp="children"
                      onChange={tableNameChange}
                      //onSearch={onSearch}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {tableList &&
                        tableList.map((item) => {
                          return (
                            <>
                              <Option value={item.TABLE_NAME}>
                                {item.TABLE_NAME}
                              </Option>
                            </>
                          );
                        })}
                    </Select>
                  </Col>
                  <Col className="col-lg-4">
                    <Button
                      size="middle"
                      type="primary"
                      htmlType="submit"
                      className="btn btn-primary"
                      onClick={onSearch}
                    >
                      <i
                        style={{ paddingRight: 5 }}
                        className="fa fa-search"
                      ></i>{" "}
                      Search
                    </Button>
                  </Col>
                </Row>

                <Spin spinning={loading}>
                  <Form form={form}>
                    {fieldsList && fieldsList.columns && (
                      <>
                        <Row>
                          {fieldsList.columns.map((field, index) => {
                            return (
                              <>
                                <Col className="col-lg-2 p-2">
                                  <Form.Item
                                    name={field.COLUMN_NAME}
                                    label={field.COLUMN_NAME ?? false}
                                    maxLength={field.DATA_LENGTH}
                                    rules={
                                      field.NULLABLE == "N"
                                        ? [
                                            {
                                              required: true,
                                              message: `${field.COLUMN_NAME} is required!`,
                                            },
                                          ]
                                        : []
                                    }
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                  >
                                    {renderSwitch(field, index)}
                                  </Form.Item>
                                </Col>
                              </>
                            );
                          })}
                        </Row>
                        <Row>
                          <div className="p-2 ml-1">
                            <Button
                              size="middle"
                              type="primary"
                              htmlType="submit"
                              className="btn btn-primary"
                              onClick={onSubmit}
                            >
                              <i
                                style={{ paddingRight: 5 }}
                                className="fa fa-send"
                              ></i>{" "}
                              Submit
                            </Button>
                          </div>
                        </Row>
                      </>
                    )}
                  </Form>
                </Spin>
              </div>
            </div>
          </div>
        </Card>
      </FormArea>
    </>
  );
};

export default DatabaseInsertion;
