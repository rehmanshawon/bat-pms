import { changeModule } from 'apsisEngine/helpers/helperService';
import { userService } from 'apsisEngine/helpers/userService';
import MockNotifications from 'components/libraries/notifications';
import {
	BellOutlined,
	DownOutlined,
	FullscreenOutlined,
	GroupOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Layout, List, Menu, Tooltip } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppState } from './shared/AppProvider';
import DashHeader, { Notification } from './styles/Header';

const { SubMenu } = Menu;
const { Header } = Layout;

const MainHeader = ({ socketTotalUnseen, socketNotifications, markAsRead }) => {
	const [state, dispatch] = useAppState();
	const [notifications] = useState(MockNotifications);
	const [modules, setModules] = useState([]);
	const userInfo = userService.userValue;
	function logout() {
		userService.logout();
	}

	const moduleChanger = (event) => {
		event.preventDefault();
		const moduleId = event.target.id;
		changeModule(moduleId);
	};

	const moduleInfo = JSON.parse(localStorage.getItem('module_info'));

	useEffect(() => {
		const module_list = JSON.parse(localStorage.getItem('module_list'));
		setModules(module_list);
	}, []);

	const CompactAvatar = ({ src }) => {
		return (
			<div className="avatar-area">
				<div className="avatar-info">
					<h2>{userInfo.full_name ?? ''}</h2>
					<p>{userInfo.email ?? ''}</p>
				</div>
				<Avatar src={src} />
			</div>
		);
	};

	return (
		<DashHeader>
			<Header
				style={{ padding: 0, margin: 0 }}
				className={`header_${state.darkSidebar ? 'dark' : 'light'}`}
			>
				<Menu mode="horizontal">
					{state.mobile && (
						<Menu.Item>
							<a
								onClick={() => dispatch({ type: 'mobileDrawer' })}
								className="trigger"
							>
								<svg
									width="1em"
									height="1em"
									fill="currentColor"
									xmlns="http://www.w3.org/2000/svg"
									x="0px"
									y="0px"
									viewBox="0 0 384.97 384.97"
									style={{ enableBackground: 'new 0 0 384.97 384.97' }}
									xmlSpace="preserve"
								>
									<g id="Menu_1_">
										<path
											d="M12.03,120.303h360.909c6.641,0,12.03-5.39,12.03-12.03c0-6.641-5.39-12.03-12.03-12.03H12.03
                      c-6.641,0-12.03,5.39-12.03,12.03C0,114.913,5.39,120.303,12.03,120.303z"
										/>
										<path
											d="M372.939,180.455H12.03c-6.641,0-12.03,5.39-12.03,12.03s5.39,12.03,12.03,12.03h360.909c6.641,0,12.03-5.39,12.03-12.03
                      S379.58,180.455,372.939,180.455z"
										/>
										<path
											d="M372.939,264.667H132.333c-6.641,0-12.03,5.39-12.03,12.03c0,6.641,5.39,12.03,12.03,12.03h240.606
                      c6.641,0,12.03-5.39,12.03-12.03C384.97,270.056,379.58,264.667,372.939,264.667z"
										/>
									</g>
								</svg>
							</a>
						</Menu.Item>
					)}
					<Menu.Item
						style={{ width: '220px' }}
						className={`companyLogo ${state.darkSidebar ? 'dark' : 'light'}`}
					>
						<Link href="/">
							<a className="brand">
								<img
									src={`/images/${
										state.darkSidebar ? 'DarkLogo.png' : 'logo.png'
									}`}
									width={100}
								/>
							</a>
						</Link>
					</Menu.Item>
					<span className="mr-auto" />
					<Menu.Item title="My Requisition">
						<Link href="/supply-chain/my-requisition">
							<a>
								<GroupOutlined style={{ fontSize: '20px', color: '#111' }} />
								My Requisition
							</a>
						</Link>
					</Menu.Item>
					<Menu.Item title="Delegation">
						<Link href="/delegation">
							<a>
								<GroupOutlined style={{ fontSize: '20px', color: '#111' }} />
								Delegation
							</a>
						</Link>
					</Menu.Item>
					<Menu.Item>
						<Dropdown
							overlay={
								<Menu>
									{modules &&
										modules.map((module) => {
											return (
												<Menu.Item key={module.module_id}>
													<Link href="#">
														<a
															id={module.module_id}
															onClick={moduleChanger}
														>
															{module.module_name}
														</a>
													</Link>
												</Menu.Item>
											);
										})}
								</Menu>
							}
							trigger={['click']}
						>
							<a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
								{moduleInfo?.module_name} <DownOutlined />
							</a>
						</Dropdown>
					</Menu.Item>

					{!state.mobile && (
						<Menu.Item onClick={() => dispatch({ type: 'fullscreen' })}>
							<FullscreenOutlined style={{ fontSize: '20px', color: '#111' }} />
						</Menu.Item>
					)}
					<Menu.Item onClick={() => dispatch({ type: 'options' })}>
						<SettingOutlined style={{ fontSize: '20px', color: '#111' }} />
					</Menu.Item>
					<SubMenu
						title={
							<Badge count={socketTotalUnseen}>
								<span className="submenu-title-wrapper">
									<BellOutlined style={{ fontSize: '20px', color: '#111' }} />
								</span>
							</Badge>
						}
					>
						<Menu.Item className="p-0 bg-transparent" style={{ height: 'auto' }}>
							<List
								className="header-notifications"
								itemLayout="horizontal"
								dataSource={socketNotifications}
								footer={<div>{socketTotalUnseen} Notifications</div>}
								renderItem={(item) => (
									<Notification>
										<List.Item>
											<List.Item.Meta
												// avatar={item.avatar}
												title={
													item.url ? (
														<Link href={item.url ? item.url : '#'}>
															{item.title}
														</Link>
													) : (
														<>{item.title}</>
													)
												}
												description={
													<small>
														<span>{item.body}</span>{' '}
														{item.status !== 'Seen' && (
															<Tooltip title="Mark as Seen">
																<i
																	onClick={() => {
																		markAsRead(
																			String(
																				item.event_action_id
																			)
																		);
																	}}
																	className="fa fa-dot-circle-o"
																></i>
															</Tooltip>
														)}
													</small>
												}
											/>
										</List.Item>
									</Notification>
								)}
							/>
						</Menu.Item>
					</SubMenu>
					<SubMenu title={<CompactAvatar src="/images/user.png" />}>
						<Menu.Item>Settings</Menu.Item>
						
						<Menu.Item  ><Link href='/profile'>Profile</Link></Menu.Item>
						<Menu.Item>Notifications</Menu.Item>
						<Menu.Divider />
						<Menu.Item>
							<Link href="#">
								<a>Help?</a>
							</Link>
						</Menu.Item>
						<Menu.Item onClick={logout}>Signout</Menu.Item>
					</SubMenu>
				</Menu>
			</Header>
		</DashHeader>
	);
};

export default MainHeader;
