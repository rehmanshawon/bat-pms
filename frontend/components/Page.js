import { envProducer } from '@/apsisEngine/helpers/helpers';
import { Layout, notification, Spin } from 'antd';
import { withRouter } from 'next/router';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ThemeProvider } from 'styled-components';
import { userService } from '../apsisEngine/helpers/userService';
import Header from './Header';
import { useAppState } from './shared/AppProvider';
import SidebarMenu from './SidebarMenu';
import { theme } from './styles/GlobalStyles';
import { Container, Inner } from './styles/Page';
import fetchWrapper from '@/apsisEngine/helpers/fetchWrapper';

const { Content } = Layout;
const NonDashboardRoutes = [
	'/signin',
	'/signup',
	'/forgot',
	'/lockscreen',
	'/_error',
	'/landing-page',
];

const Page = ({ router, children }) => {
	const [loading, setLoading] = useState(true);
	const [state] = useAppState();
	const isNotDashboard = NonDashboardRoutes.includes(router.pathname);

	const openNotificationWithIcon = (type, title, message) => {
		notification[type]({
			message: title ?? 'Title',
			description: message ?? 'Description',
			placement: 'topRight',
		});
	};

	const [socketNotifications, setSocketNotifications] = useState([]);
	const [socketTotalUnseen, setSocketTotalUnseen] = useState(0);

	const callSocket = () => {
		const user = JSON.parse(localStorage.getItem('user'));
		const path = envProducer('public');
		if (user && user.access_token) {
			const socket = io(path, {
				query: {
					token: user.access_token,
				},
			});

			socket.emit('notification', {
				event: 'notification',
				data: { test: true },
			});
			socket.on('notification', async (response) => {
				const res = JSON.parse(response);
				const { lastRecords, countTotalUnseen, notificationData } = res;
				if (notificationData) {
					openNotificationWithIcon(
						'success',
						notificationData.title,
						notificationData.message
					);
				}
				setSocketTotalUnseen(countTotalUnseen);
				if (lastRecords) {
					const eventActionIds = lastRecords.map((item) => String(item.event_action_id));
					await fetchWrapper.post('/apsisengine-notification/manager/acknowledgement', {
						eventActionIds: eventActionIds,
					});
					const recordsData = lastRecords.map((item) => {
						return {
							title: item.message_subject,
							body: item.message_body,
							url: item.action_url,
							status: item.notify_status,
							event_action_id: item.event_action_id,
						};
					});
					setSocketNotifications(recordsData);
				}
			});
			socket.on('exception', function (data) {
				console.log('notification', data);
			});
			socket.on('disconnect', function () {
				console.log('Disconnected');
			});
		}
	};

	const markAsRead = async (eventActionId) => {
		await fetchWrapper.post('apsisengine-notification/manager/mark-as-read', {
			eventActionIds: [eventActionId],
		});
	};

	useEffect(() => {
		callSocket();
	}, []);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	}, [loading]);

	return (
		<Spin tip="Loading..." size="large" spinning={loading}>
			<ThemeProvider theme={theme}>
				<Container
					className={`${state.weakColor ? 'weakColor' : ''} ${
						state.boxed ? 'boxed shadow-sm' : ''
					}`}
				>
					{!isNotDashboard && userService.userValue && (
						<Header
							socketNotifications={socketNotifications}
							socketTotalUnseen={socketTotalUnseen}
							markAsRead={markAsRead}
						/>
					)}

					<Layout className="workspace">
						{!isNotDashboard && userService.userValue && (
							<SidebarMenu
								sidebarTheme={state.darkSidebar ? 'dark' : 'light'}
								sidebarMode={state.sidebarPopup ? 'vertical' : 'inline'}
								sidebarIcons={state.sidebarIcons}
								collapsed={state.collapsed}
							/>
						)}

						{/* <Layout> */}
						<Content>
							{!isNotDashboard && userService.userValue ? (
								<Inner> {children}</Inner>
							) : (
								children
							)}
						</Content>
						{/* </Layout> */}
					</Layout>
				</Container>
			</ThemeProvider>
		</Spin>
	);
};
export default withRouter(Page);
