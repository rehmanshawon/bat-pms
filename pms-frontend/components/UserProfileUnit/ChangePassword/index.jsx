import { Button, Form, Image, Input, message } from "antd";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
import React from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import styled from "styled-components";
import { swalError } from "apsisEngine/helpers/helperService";

const ChangePassword = ({ data, passLogicData }) => {
  // console.log('passlogindata',passLogicData);
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState("optional");

  const onFinish = async (e) => {
    const submitData = { ...e };
    submitData.password_reset_token = passLogicData.password_reset_token;
    // console.log(submitData);
    // console.log(e);
    await fetchWrapper
      .patch("auth/changepassword", submitData)
      .then((response) => {
        if (!response?.error) {
          form.resetFields();
          message.success("Password Update successful!");
        } else {
          message.error(response?.message);
        }
      })
      .catch((error) => {
        message.error(
          error?.message?.new_password
            ? error.message.new_password[0]
            : error.message
        );
      });
  };

  return (
    <Wrapper>
      <h6 className="py-3 border-bottom text-center">Change your password</h6>
      <Row className="p-3">
        {/* <Col className="text-center">
          <Image
            src={data?.user_image ? data?.user_image : "images/user.png"}
            width={80}
            height={80}
            className="rounded-circle border "
          />
          <div>
            <h6 className="mt-2">{data?.full_name}</h6>
          </div>
        </Col> */}
        <Col md={12} className="">
          {/* <h6 style={{fontSize:'14px'}}>Change Password</h6> */}
          <FormWrapper
            form={form}
            layout="vertical"
            initialValues={{ requiredMarkValue: "required" }}
            name="control-hooks"
            onFinish={onFinish}
            requiredMark="required"
          >
            <Form.Item
              required
              name="old_password"
              label="Current Password"
              tooltip="Current password is required"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="Current password" type="password" />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="new_password"
              label="New Password"
              tooltip={passLogicData?.password_regex_error_msg}
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const regEx = new RegExp(passLogicData?.password_regex);
                    const isMatch = regEx.test(value);
                    if (isMatch) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(`${passLogicData?.password_regex_error_msg}`)
                    );
                  },
                }),
              ]}
            >
              <Input type="password" placeholder="New Password" />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="confirm_new_password"
              label="Confirm new Password"
              dependencies={["new_password"]}
              tooltip="Confirm new must be match with New Password!"
              rules={[
                {
                  required: true,
                  message: "Please confirm new password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("new_password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Password does not match!")
                    );
                  },
                }),
              ]}
            >
              <Input type="password" placeholder="Confirm New Password" />
            </Form.Item>
            <Form.Item className="mt-3">
              <Button className="w-100" type="primary" htmlType="submit">
                Change Password
              </Button>
            </Form.Item>
          </FormWrapper>
        </Col>
      </Row>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: #ffffff;
  height: 100%;
  /* padding: 1.5rem; */
`;

const FormWrapper = styled(Form)``;

export default ChangePassword;
