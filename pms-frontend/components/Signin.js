import {
	changeModule,
	getAuthorizedModules,
	getUomPrecision,
} from 'apsisEngine/helpers/helperService';
import { EyeTwoTone, MailTwoTone } from '@ant-design/icons';
import { useMsal } from '@azure/msal-react';
import { Button, Col, Form, Input, Message, Row, Spin } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import fetchWrapper from '../apsisEngine/helpers/fetchWrapper';
const FormItem = Form.Item;
const Signin = () => {
	const [form] = Form.useForm();
	const { accounts, instance } = useMsal();
	const [loading, setLoading] = useState(false);
	const [submitType, setSubmitType] = useState('default');
	const onFinish = async (values) => {
		setLoading(true);
		const data = {
			user: values.email,
			password: values.password,
		};
		if (submitType === 'ad') {
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
					Message.error('Login Error!');
					console.log(error);
				});
		}
		else {
			await fetchWrapper
				.post(`auth/login`, data)
				.then((response) => {
					if (!response.error) {
						const user = response.data;
						if (user) {
							afterSigninTasks(user);
						}
					}
				})
				.catch((error) => {
					Message.error('Login Error!');
					console.log(error);
				});
		}
		setLoading(false);
	};

	const afterSigninTasks = async (user) => {
		localStorage.setItem('user', JSON.stringify(user));
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
					Message.error('Login Error!');
					console.log(error);
				});
		} catch (err) {
			Message.error('Login Error!');
		}
		setLoading(false);
	};

	const loginWithMS = async () => {
		try {
			await instance.loginPopup({
				scopes: ['User.Read'],
			});
			getMSToken();
		} catch (err) {
			Message.error('Microsoft Login Closed');
		}
	};

	const adSubmit = () => {
		form.submit()
		setSubmitType('ad');
	}

	return (
		<>
			<Spin tip="Loading..." size="large" spinning={loading}>
				<Row className="login-area">
					<Col span={24} className="text-center">
						<div className={`LoginSection`}>
							<div className={`logoSection`}>
								<Link href="/signin">
									<a className="brand-logo">
										<img src="/images/BAT_Bangladesh_Logo.png" width={250} />
									</a>
								</Link>
							</div>
							<h2 className="login-title">Login Account</h2>
							<p className="login-sub">Enter your username and password</p>
							<Form
								form={form}
								layout="vertical"
								onFinish={onFinish}
								onFinishFailed={(errors) => {
									// console.log(errors);
								}}
							>
								<FormItem
									label="Email/Username"
									name="email"
									style={{ marginBottom: 15 }}
									rules={[
										{
											type: 'string',
											message: 'The input is not valid!',
										},
										{
											required: true,
											message: 'Please input your E-mail/Username!',
										},
									]}
								>
									<Input
										prefix={<MailTwoTone style={{ fontSize: '16px' }} />}
										type="text"
										autoComplete={'off'}
										placeholder="Email/Username"
									/>
								</FormItem>

								<FormItem
									label="Password"
									name="password"
									style={{ marginBottom: 15 }}
									rules={[
										{ required: true, message: 'Please input your Password!' },
									]}
								>
									<Input
										prefix={<EyeTwoTone style={{ fontSize: '16px' }} />}
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
											background: '#00833d',
											borderColor: '#00833d',
										}}
									>
										Log in
									</Button>
									<Button
										type="primary"
										onClick={adSubmit}
										block
										className="mr-2"
										style={{
											background: '#00833d',
											borderColor: '#00833d',
										}}
									>
										Log in With AD
									</Button>
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
									<small className="text-muted">
										<span>Don't have account access ? </span>
										<Link href="/forgot">
											<a className="text-xs-right">
												<small> Forgot password</small>
											</a>
										</Link>
									</small>
								</div>
							</Form>
						</div>
					</Col>
				</Row>
			</Spin>
		</>
	);
};

export default Signin;
