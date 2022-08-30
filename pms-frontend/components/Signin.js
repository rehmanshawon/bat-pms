import {
  changeModule,
  getAuthorizedModules,
  getUomPrecision,
} from "apsisEngine/helpers/helperService";
import { EyeTwoTone, MailTwoTone } from "@ant-design/icons";
import { useMsal } from "@azure/msal-react";
import { Button, Col, Form, Input, message, Row, Spin } from "antd";
import Link from "next/link";
import { useState } from "react";
import fetchWrapper from "../apsisEngine/helpers/fetchWrapper";
const FormItem = Form.Item;
const Signin = () => {
  const [form] = Form.useForm();
  const { accounts, instance } = useMsal();
  const [loading, setLoading] = useState(false);
  const [submitType, setSubmitType] = useState("default");
  const onFinish = async (values) => {
    setLoading(true);
    const data = {
      user: values.email,
      password: values.password,
    };
    if (submitType === "ad") {
      await fetchWrapper
        .post(`auth/azure-ldap-login`, data)
        .then((response) => {
          if (!response.error) {
            const user = response.data;
            if (user) {
              afterSigninTasks(user);
            }
          }
        })
        .catch((error) => {
          message.error("Login Error!");
          console.log(error);
        });
    } else {
      await fetchWrapper
        .post(`auth/login`, data)
        .then((response) => {
          if (!response.error) {
            const user = response.data;
            console.log(response);
            if (user) {
              afterSigninTasks(user);
            }
          }
        })
        .catch((error) => {
          message.error("Login Error!");
          console.log(error);
        });
    }
    setLoading(false);
  };

  const afterSigninTasks = async (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    await getAuthorizedModules();
    await getUomPrecision();
    await changeModule(user.default_module_id);
  };

  const getMSToken = async () => {
    setLoading(true);
    try {
      const silentResult = await instance.acquireTokenSilent({
        account: accounts[0],
      });
      const msToken = silentResult.accessToken;
      await fetchWrapper
        .post(`auth/azure-login`, { adToken: msToken })
        .then((response) => {
          if (!response.error) {
            const user = response.data;
            if (user) {
              afterSigninTasks(user);
            }
          }
        })
        .catch((error) => {
          message.error("Login Error!");
          console.log(error);
        });
    } catch (err) {
      message.error("Login Error!");
    }
    setLoading(false);
  };

  const loginWithMS = async () => {
    try {
      await instance.loginPopup({
        scopes: ["User.Read"],
      });
      getMSToken();
    } catch (err) {
      message.error("Microsoft Login Closed");
    }
  };

  const adSubmit = () => {
    form.submit();
    setSubmitType("ad");
  };

  return (
    <>
      <Spin tip="Loading..." size="large" spinning={loading}>
        <Row className="login-area" >
          <Col span={24} className="text-center">
            <div className={`LoginSection`} style={{
              boxSizing: 'border-box',

             // position: 'absolute',
             // width: '480px',
             // height: '581px',
              //left: '720px',
             // top: '267px',
              
              /* Gradient 1 */
              
              background: 'linear-gradient(270deg, #004F9F 0%, #0088ff 100%)',
              /* White */
              
              border: '1px solid #FFFFFF',
              boxShadow: '0px 100px 142px -13px rgba(63, 130, 255, 0.07), 0px 66.7245px 85.8738px -13px rgba(63, 130, 255, 0.0531481), 0px 44.6296px 53.9074px -13px rgba(63, 130, 255, 0.0425185), 0px 30.3125px 37.7188px -13px rgba(63, 130, 255, 0.035), 0px 20.3704px 28.9259px -13px rgba(63, 130, 255, 0.0274815), 0px 11.4005px 19.147px -13px rgba(63, 130, 255, 0.0168519)',
              borderRadius: '20px',
            }}>
              <div className={`logoSection`}>
                <Link href="/signin">
                  <a className="brand-logo">
                    <img src="/images/BAT_Bangladesh_Logo.png" width={250} />
                  </a>
                </Link>
              </div>
              <div style={{
                width: '294px',
                height: '44px',
                left: '0px',
                top: '0px',
                
                fontfamily: 'Arial',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '36px',
                lineHeight: '44px',                
                color: '#FFFFFF',
              }}>Welcome to PMS</div> 

              <div style={{
                marginTop:20,
                width: '344px',
                height: '29px',
                left: '0px',
                top: '61px',
                
                fontfamily: 'Arial',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '24px',
                lineHeight: '29px',                
                color: '#E3F2FE',
              }}>Enter your credentials to login</div>             
              
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={(errors) => {
                  // console.log(errors);
                }}
              >
                <FormItem
                  //label="Email/Username"
                  name="email"
                  style={{ marginTop:40, marginBottom: 15 }}
                  rules={[
                    {
                      type: "string",
                      message: "The input is not valid!",
                    },
                    {
                      required: true,
                      message: "Please input your E-mail/Username!",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailTwoTone style={{
                      boxSizing: 'border-box',                            
                            height: '40px',
                            background: '#FFFFFF',
                            border: '1px solid #F2F2F2',
                            borderRadius: '10px',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            fontSize: '24px',
                           }} />}
                    type="text"
                    autoComplete={"off"}
                    placeholder="Email/Username"
                  />
                </FormItem>

                <FormItem
                  //label="Password"
                  name="password"
                  style={{marginTop:40, marginBottom: 15 }}
                  rules={[
                    { required: true, message: "Please input your Password!" },
                  ]}
                >
                  <Input
                          prefix={<EyeTwoTone style={{ 
                            boxSizing: 'border-box',                            
                            height: '40px',
                            background: '#FFFFFF',
                            border: '1px solid #F2F2F2',
                            borderRadius: '10px',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            fontSize: '24px',
                          }} />}
                    type="password"
                    placeholder="Password"
                  />
                </FormItem>

                <div className="mt-3 d-flex">
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    className="mr-2"
                    style={{
                      marginTop:20,
                      color: "white",
                      boxSizing: 'border-box',

                      //width: '404px',
                      height: '60px',

                      /* Mid Blue */

                      background: '#004F9F',
                      /* grey color */

                      border: '1px solid #F2F2F2',
                      borderRadius: '10px',

                      /* Inside auto layout */

                      flex: 'none',
                      order: 1,
                      flexGrow: 0,
                      marginBottom:10
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      width: '74px',
                      height: '29px',
                      left: '165px',
                      top: '16px',
                      
                      fontFamily: 'Arial',
                      fontStyle: 'bold',
                      fontWeight: 500,
                      fontSize: '24px',
                      lineHeight: '29px',
                      /* identical to box height */
                      
                      textTransform: 'uppercase',
                      
                      /* White */
                      
                      color: '#FFFFFF',
                    }}>Log in</div>
                  </Button>
                  {/* <Button
                    type="primary"
                    onClick={adSubmit}
                    block
                    className="mr-2"
                    style={{
                      background: "#dddddd",
                      borderColor: "#888888",
                      color: "#000000",
                    }}
                  >
                    Log in With AD
                  </Button> */}
                  {/* <Button
										type="primary"
										onClick={() => loginWithMS()}
										block
										className="ml-2"
										style={{
											background: '#00833d',
											borderColor: '#00833d',
										}}
									>
										Log in With Microsoft
									</Button> */}
                </div>

                <div className="text-center">
                  {/* <small className="text-muted"> */}
                    {/* <span>Don&apos;t have account access ? </span> */}
                    <Link href="/forgot" >
                      <a style={{color:'white',marginTop:10 }}>
                         Forgot password?
                      </a>
                    </Link>
                  {/* </small> */}
                </div>
                {/* <div className="text-center">
                  <small className="text-muted text-center">
                    <span>Don&apos;t have an account yet?</span>
                    <Link href="/signup">
                      <a>&nbsp;Create one now!</a>
                    </Link>
                  </small>
                </div> */}
              </Form>
            </div>
          </Col>
        </Row>
      </Spin>
    </>
  );
};

export default Signin;
