import React, { useEffect, useState } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import FormFooter from "@/components/common/FormFooter";
import {
  FormInput,
  FormItem,
  FormSelect,
  swalError,
  swalSuccess,
} from "@/apsisEngine/common/formValidations";
import { Form, Row, Col, Input, Card, Tabs, AutoComplete } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import TabContent from "./TabContent";
const { TabPane } = Tabs;

const SystemConfigForm = ({ editMode, id }) => {
  const [form] = Form.useForm();
  const [defaultValues, setDefaultValues] = useState();
  const router = useRouter();
  const [formTitle, setFormTitle] = useState();
  const [sectionFields, setSectionFields] = useState();
  const [formState, setFormState] = useState({});
  const [configSlugs, setConfigSlugs] = useState();
  const [configData, setConfigData] = useState();

  const [options, setOptions] = useState([]);

  const onSearch = (searchText) => {
    
    const str = searchText;

    let newRegEx = new RegExp(`((${str}))`, "i");

    const result = [];

    configData.map((item) => {
      if (item.match(newRegEx)) {
        result.push(item);
      }
    });
    
    setConfigSlugs(result);

    
  };

  const onSelect = (data) => {
    console.log("onSelect", data);
  };

  const getFields = async () => {
    let response = await fetchWrapper.post("masterform/getformdata", {
      form_slug: "branch_form",
    });
    if (response.data) {
      const { form_title, form_element } = response.data;
      setFormTitle(form_title);
      setSectionFields(form_element["sec_1"]);
    }
  };

  const handleSubmit = (values) => {
    if (editMode) {
      updateData(values);
    } else {
      storeData(values);
    }
  };

  const storeData = (values) => {};

  const updateData = (values) => {};

  const getSlugs = async () => {
    let response = await fetchWrapper.get("/config/get-slugs");
    if (!response.error) {
      setConfigSlugs(response.data);
      setConfigData(response.data);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      [name]: value,
    });
  };

  function convertWord(str) {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
  }

  //get on load data
  useEffect(() => {
    getFields();
    getSlugs();
  }, []);

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
                  <span className="fa fa-file-text mr-2"></span> System Configs
                </h6>
              </div>
            </div>

            <Form form={form} onFinish={handleSubmit}>
              <div className="form-section">
                <div className="section-body">
                  <div className="section-body p-3">
                    <div className="site-card-wrapper">
                    <div className="pl-2 pb-3">
                          <AutoComplete
                            options={options}
                            style={{ width: 150 }}
                            onSelect={onSelect}
                            onSearch={onSearch}
                            placeholder="search here"
                          />
                        </div>

                      <Row gutter={16}>
                        <Tabs tabPosition={`left`} style={{ width: "100%" }}>
                          {configSlugs &&
                            configSlugs.map((value, i) => {
                              return (
                                <TabPane tab={convertWord(value)} key={value}>
                                  <div style={{ width: "90%" }}>
                                    <TabContent slug={value} />
                                  </div>
                                </TabPane>
                              );
                            })}
                        </Tabs>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SystemConfigForm;
