import React, { useEffect, useState } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { FormItem } from "@/apsisEngine/common/formValidations";
import { swalSuccess } from "@/apsisEngine/helpers/helperService";
import { Tree, Form, Button, Col } from "antd";

const MenuPrivilege = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [data, setTreeData] = useState([]);
  const [form] = Form.useForm();
  const [roleId, setRoleId] = useState();
  const [formTitle, setFormTitle] = useState();
  const [sectionFields1, setSectionFields1] = useState();
  const [sectionFields2, setSectionFields2] = useState();
  const [defaultExpandAll, setDefaultExpandAll] = useState(false);

  const buildCheckedKeys = (data) => {
    const checked = [];
    const expanded = [];
    data.forEach((data) => {
      expanded.push(data.key);
      if (data.checked) checked.push(data.key);
      data.children.forEach((item) => {
        expanded.push(item.key);
        if (item.checked) {
          checked.push(item.key);
        }
      });
    });
    setCheckedKeys(checked);
    setExpandedKeys(expanded);
  };

  // const onExpand = (expandedKeysValue) => {
  //   console.log("onExpand", expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
  //   // or, you can remove all expanded children keys.

  //   setExpandedKeys(expandedKeysValue);
  //   setAutoExpandParent(false);
  // };

  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
    modifyFunction(checkedKeysValue, data);
  };

  const modifyFunction = (checkedKeysValue, data) => {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const result = checkedKeysValue.checked.filter((item) => {
        return item == element.key;
      });

      if (result.length > 0) {
        element["checked"] = true;
      } else {
        element["checked"] = false;
      }

      if (element.children && element.children.length != 0) {
        modifyFunction(checkedKeysValue, element.children);
      }
    }
  };

  const onSelect = (selectedKeysValue, info) => {
    console.log("onSelect", info);
    setSelectedKeys(selectedKeysValue);
  };

  // const stateChange = (event) => {
  //   // get data form event
  //   const { name, value } = event.target;
  // };

  const getFields = async () => {
    let response = await fetchWrapper
      .post("masterform/getformdata", {
        form_slug: "module_menu_privilege",
      })
      .catch((error) => console.log(error));

    if (response.data) {
      const { form_title, form_element } = response.data;
      setFormTitle(form_title);
      setSectionFields1(form_element["sec_1"]);
      setSectionFields2(form_element["sec_2"]);
    }
  };

  useEffect(() => {
    getFields();
  }, []);

  //Set Privilege Handler
  const handelSetPrivilege = () => {
    const role_id = parseInt(roleId);
    const privilegeSetData = { role_id, menuTree: data };

    fetchWrapper
      .post("menu/updateMenuPrivilege", privilegeSetData)
      .then((res) => {
        if (!res.error) {
          swalSuccess(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //submit Handler
  const onFinish = async (values) => {
    setRoleId(values.role_id);
    await fetchWrapper
      .post("/menu/menuPrivilege", values)
      .then((res) => {
        if (!res.error) {
          setDefaultExpandAll(true);
          setTreeData(res.data);
          buildCheckedKeys(res.data);
          setAutoExpandParent(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="main-wrap">
        <div className="card card-xl-stretch my-3">
          <div className="card-header border-0 ">
            <Form
              form={form}
              name="customized_form_controls"
              layout="vertical"
              onFinish={onFinish}
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
                              // getEvent={stateChange}
                            />
                          );
                        })}
                      <Col span={6}>
                        <Form.Item style={{ marginTop: "29px" }}>
                          <Button
                            style={{ width: "100%" }}
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                          >
                            See menu Privilege
                          </Button>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item style={{ marginTop: "29px" }}>
                          <Button
                            onClick={handelSetPrivilege}
                            style={{ width: "100%" }}
                            type="primary"
                            className="login-form-button"
                          >
                            Set Privilege
                          </Button>
                        </Form.Item>
                      </Col>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <hr />
      {data && data.length != 0 ? (
        <Tree
          checkable
          //onExpand={onExpand}
          expandedKeys={expandedKeys}
          // autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          onSelect={onSelect}
          selectedKeys={selectedKeys}
          treeData={data}
          //defaultExpandAll={defaultExpandAll? defaultExpandAll: false}
          checkStrictly={true}
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
        />
      ) : null}
    </>
  );
};
export default MenuPrivilege;
