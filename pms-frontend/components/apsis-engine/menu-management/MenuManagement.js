import { React, useEffect, useState, useRef } from "react";
import {
    Button,
    Form,
    Row,
    Col,
    Input,
    Checkbox,
    Radio,
    Card,
    Table,
} from "antd";
import { FormItem } from "apsisEngine/common/formValidations";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
//import DemoTable from "./DemoTable";
import DemoTable2 from "./DemoTable2";
import { swalSuccess } from "apsisEngine/helpers/helperService";
//import { swalError } from "@/apsisEngine/helpers/helperService";

const MenuManagement = () => {
    const [formTitle, setFormTitle] = useState();
    const [sectionFields, setSectionFields] = useState();
    const childRef = useRef(null);

    const [formTitle1, setFormTitle1] = useState();
    const [sectionFields1, setSectionFields1] = useState();
    //form initialize value
    const [Menu_Information] = Form.useForm();
    const [Quick_Menu] = Form.useForm();
    const [defaultValues, setDefaultValues] = useState();
    const [menuData, setMenuData] = useState([]);
    const [readyToUpdate, setReadyToUpdate] = useState(false);
    const [menuId, setMenuId] = useState();
    //get form element
    const getFields = async (slug) => {
        await fetchWrapper
            .post("masterform/getformdata", {
                form_slug: slug,
            })
            .then((response) => {
                const { form_title, form_element } = response.data;

                if (slug == "menuManagement_form") {
                    setFormTitle(form_title);
                    setSectionFields(form_element["sec_1"]);
                } else {
                    setFormTitle1(form_title);
                    setSectionFields1(form_element["sec_1"]);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const storeData = async (values) => {
        console.log(values);
        if (!readyToUpdate)
            await new fetchWrapper.post("/menu", values)
                .then((res) => {
                    if (!res.error) {
                        swalSuccess("Menu Created Successfully!!!");
                    }
                    Menu_Information.resetFields();
                })
                .catch((error) => {
                    console.log(error);
                });
        else {
            values["menu_id"] = menuId;
            //console.log(values);
            await new fetchWrapper.post("/menu/updateMenu", values)
                .then((res) => {
                    if (!res.error) {
                        swalSuccess("Menu Updated Successfully!!!");
                    }
                    // Menu_Information.resetFields();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        getFields("menuManagement_form");
        getFields("menuManagement_form2");
    }, []);

    const handleChange = async (event) => {
        const { name, value } = event.target;
        console.log(name, value);
        if (name == "module_id1") {
            await new fetchWrapper.get(`menu/${value}`)
                .then((res) => {
                    //console.log(res.data);
                    setMenuData(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handelReset = () => {
        Menu_Information.resetFields();
        setReadyToUpdate(false);
    };

    const saveManuOrder = () => {
        if (childRef.current) {
            childRef.current.submit();
        }
    };

    const setMenuInfoFormData = (data) => {
        // console.log(data);
        Menu_Information.setFieldsValue(data);
        setMenuId(data.menu_id);
        setReadyToUpdate(true);
    };

    console.log(Menu_Information.getFieldValue());

    //  console.log(menuData);

    return (
        <Col span={24}>
            <Row>
                <Col span={12}>
                    <Card
                        title={formTitle1}
                        extra={
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    saveManuOrder();
                                }}
                            >
                                Save Menu Order
                            </button>
                        }
                        style={{ marginRight: "1rem", minHeight: '454px' }}
                    >
                        <div className="card-body">
                            <Form form={Quick_Menu}>
                                <div className="form-section">
                                    {/* <h6 className="section-title">
                                {formTitle ?? "Basic Information"}
                            </h6> */}
                                    <div className="section-body">
                                        <Row gutter={16}>
                                            {sectionFields1 &&
                                                sectionFields1.map((field) => {
                                                    return (
                                                        <FormItem
                                                            key={
                                                                field.input_name
                                                            }
                                                            field={field}
                                                            getEvent={(e) =>
                                                                handleChange(e)
                                                            }
                                                        />
                                                    );
                                                })}
                                        </Row>
                                        {/* <DemoTable obj={menuData} /> */}
                                    </div>
                                    {/* <div className="section-footer mt-2">
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                    <Button
                                        style={{ marginLeft: "1rem" }}
                                        type="reset"
                                        htmlType="reset"
                                        onClick={handelReset}
                                    >
                                        Reset
                                    </Button>
                                </Form.Item>
                            </div> */}
                                </div>
                            </Form>
                        </div>
                        <DemoTable2
                            getvalues={setMenuInfoFormData}
                            ref={childRef}
                            obj={menuData}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title={formTitle}>
                        <Form
                            form={Menu_Information}
                            onFinish={storeData}
                            initialValues={defaultValues}
                            name="customized_form_controls"
                            layout="horizontal"
                        >
                            <div className="form-section">
                                {/* <h6 className="section-title">
                                {formTitle1 ?? "Basic Information"}
                            </h6> */}
                                <div className="section-body">
                                    <Row gutter={16}>
                                        {sectionFields &&
                                            sectionFields.map((field) => {
                                                return (
                                                    <FormItem
                                                        key={field.input_name}
                                                        field={field}
                                                    // getEvent={(e) =>
                                                    //     handleChange(e)
                                                    // }
                                                    />
                                                );
                                            })}
                                    </Row>
                                </div>
                                <div className="section-footer mt-2">
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            Submit
                                        </Button>
                                        <Button
                                            style={{ marginLeft: "1rem" }}
                                            type="reset"
                                            htmlType="reset"
                                            onClick={handelReset}
                                        >
                                            Reset
                                        </Button>
                                    </Form.Item>
                                </div>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Col>
    );
};

export default MenuManagement;
