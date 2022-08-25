/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment } from "react";
import { Modal, Button, Input, Form, Table, Popconfirm, Row } from "antd";
import { useState, useEffect } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import ModalFooter from "@/components/common/ModalFooter";
import { FormItem } from "@/apsisEngine/common/formValidations";

export const ProductSpecifications = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sectionFields, setsectionFields] = useState();
  const [productSpecifications, setproductSpecifications] = useState([]);
  const [formState, setformState] = useState({});

  const handleEvent = (e) => {
    const { name, value } = e.target;
    setformState({ ...formState, [name]: value });
  };

  const getFields = async () => {
    let response = await fetchWrapper.post("masterform/getformdata", {
      form_slug: "product_specifications_form",
    });
    if (response.data) {
      const { form_title, form_element } = response.data;
      setsectionFields(form_element["sec_1"]);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "spec_name",
      key: "spec_name",
    },
    {
      title: "Unit",
      dataIndex: "spec_unit",
      key: "spec_unit",
    },
    {
      title: "Standard",
      dataIndex: "spec_standard",
      key: "spec_standard",
    },
    {
      title: "Input Type",
      dataIndex: "spec_input_type",
      key: "spec_input_type",
    },
    {
      title: "Dropdown Options",
      dataIndex: "dropdown_options",
      key: "dropdown_options",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "5%",
      render: (_, record) =>
        productSpecifications.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button size="small" className="deleteButton">
              <a>
                <i className="fa fa-trash fs-5 text-white"></i>
              </a>
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  const [form] = Form.useForm();

  const handleDelete = (key) => {
    const dataSource = [...productSpecifications];
    const newData = dataSource.filter((item) => item.key !== key);
    setproductSpecifications(newData);
    props.productSpecHandler(newData);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    getFields();
    setproductSpecifications(props.specifications);
  }, [props.specifications]);

  const onFinish = (data) => {
    data.key = Math.random().toString();
    let spec = productSpecifications;
    spec.push(data);
    setproductSpecifications([...spec]);
    props.productSpecHandler([...spec]);
    form.resetFields();
    closeModal();
  };

  const gridData = productSpecifications;

  return (
    <>
      <Row className="justify-content-between align-items-baseline">
        <h6>
          <i className="fa fa-list"></i> Product Specifications List
        </h6>
        <Button
          type="primary"
          className="my-2"
          style={{ zIndex: 1 }}
          onClick={showModal}
        >
          Add New
        </Button>
      </Row>

      <Modal
        title="Product Specifications"
        visible={isModalVisible}
        onOk={closeModal}
        onCancel={closeModal}
        width={800}
        footer={null}
      >
        <div className="main-wrap">
          <div className="">
            <Form form={form} onFinish={onFinish}>
              <div className="card-body">
                <div className="form-section">
                  <div className="section-body">
                    <Row gutter={24}>
                      {sectionFields &&
                        sectionFields.map((field, index) => {
                          return (
                            <Fragment key={index}>
                              {field.input_name == "dropdown_options" &&
                                formState.spec_input_type == "dropdown" && (
                                  <FormItem
                                    key={field.input_name}
                                    field={field}
                                    getEvent={handleEvent}
                                  />
                                )}
                              {field.input_name != "dropdown_options" && (
                                <FormItem
                                  key={field.input_name}
                                  field={field}
                                  getEvent={handleEvent}
                                />
                              )}
                            </Fragment>
                          );
                        })}
                    </Row>
                  </div>
                </div>
              </div>
              <ModalFooter handleCancel={closeModal} />
            </Form>
          </div>
        </div>
      </Modal>

      <Table
        bordered
        pagination={false}
        columns={columns}
        dataSource={gridData}
      />
    </>
  );
};

export default ProductSpecifications;
