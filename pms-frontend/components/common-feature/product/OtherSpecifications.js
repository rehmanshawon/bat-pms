/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Modal, Button, Input, Form, Table, Popconfirm, Row } from "antd";
import { useState, useEffect } from "react";
import { FormItem } from "@/apsisEngine/common/formValidations";
import ModalFooter from "@/components/common/ModalFooter";

export const OtherSpecifications = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [otherSpecifications, setotherSpecifications] = useState(
    props.specificationsOthers ?? []
  );
  const [form] = Form.useForm();

  const labelField = {
    input_name: "spec_name",
    label_name: "Label",
    required: 1,
    input_type: "text",
    element_column: 12,
  };

  const valueField = {
    input_name: "spec_value",
    label_name: "Value",
    required: 1,
    input_type: "text",
    element_column: 12,
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (key) => {
    const dataSource = [...otherSpecifications];
    const newData = dataSource.filter((item) => item.key !== key);
    setotherSpecifications(newData);
    props.otherSpecHandler(newData);
  };

  const onFinish = (data) => {
    if (data.spec_name && data.spec_value) {
      data.key = Math.random().toString();
      let spec = otherSpecifications;
      spec.push(data);
      setotherSpecifications([...spec]);
      props.otherSpecHandler([...spec]);
      form.resetFields();
      closeModal();
    }
  };

  const columns = [
    {
      title: "Label",
      dataIndex: "spec_name",
      key: "spec_name",
    },
    {
      title: "Value",
      dataIndex: "spec_value",
      key: "spec_value",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "5%",
      render: (_, record) =>
        otherSpecifications.length >= 1 ? (
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

  const gridData = otherSpecifications;

  useEffect(() => {
    setotherSpecifications(props.specificationsOthers);
  }, [props.specificationsOthers]);

  return (
    <>
      <Row className="justify-content-between align-items-baseline">
        <h6>
          <i className="fa fa-list"></i> Other Specifications List
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
        title="Other Specifications"
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
                      <FormItem field={labelField} />
                      <FormItem field={valueField} />
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

export default OtherSpecifications;
