import '../assets/styles.less';
import { MSalInstance } from '@/apsisEngine/helpers/msal';
import { MsalProvider } from '@azure/msal-react';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import Page from '../components/Page';
import { RouteGuard } from '../components/RouteGuard';
import AppProvider from '../components/shared/AppProvider';
import { GlobalStyles } from '../components/styles/GlobalStyles';
import { config, library  } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
// import { fa } from '@fortawesome/fontawesome-svg-core';
// import { fa } from '@fortawesome/fontawesome-free';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

//font awesome setup
config.autoAddCss = true;
library.add(fas, fab, far);


function MyApp({ Component, pageProps }) {

	const router = useRouter();
  
	useEffect(() => {
	  router.events.on('routeChangeStart', () =>  NProgress.start());
	  router.events.on('routeChangeComplete', () =>  NProgress.done());
	  router.events.on('routeChangeError', () =>  NProgress.done());
	}, []);
   
  
	return ( 
		<>
		<GlobalStyles />
		<Head>
			<meta
				name="viewport"
				content="user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height"
			/>
			<meta charSet="utf-8" />
			<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
			<title>IFIC - ERP</title>
			<link href="/app.css" rel="stylesheet" crossOrigin="anonymous" />
			<link href="/nprogress.css" rel="stylesheet" crossOrigin="anonymous" />
			<link
				href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
				rel="stylesheet"
				crossOrigin="anonymous"
			/>

			<link
				href="/css/font-awesome.min.css"
				rel="stylesheet"
				crossOrigin="anonymous"
			/>
			<link
				href="/css/grid-layout.css"
				rel="stylesheet"
				crossOrigin="anonymous"
			/>
			<link href="/css/bootstrap.min.css" rel="stylesheet" crossOrigin="anonymous" />
			<link
				href="/css/react-datepicker.css"
				rel="stylesheet"
				crossOrigin="anonymous"
			/>
			<link href="/css/FileUpload.css" rel="stylesheet" crossOrigin="anonymous" />
			<link href="/css/treetable.css" rel="stylesheet" crossOrigin="anonymous" />
			<link href="/css/codemirror.css" rel="stylesheet" crossOrigin="anonymous" />
		</Head>
		{/* <AppProvider>
		<Page>
			<RouteGuard> */}
				{/* <MsalProvider instance={MSalInstance}> */}
					<Component {...pageProps} />
				{/* </MsalProvider> */}
			{/* </RouteGuard>
		</Page>
		</AppProvider>		 */}
		</>
	)
	
  }

//   MyApp.getInitialProps = async ({ Component, ctx, req })=> {
// 	let pageProps = {};
// 	const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

// 	let ie = false;
// 	if (userAgent.match(/Edge/i) || userAgent.match(/Trident.*rv[ :]*11\./i)) {
// 		ie = true;
// 	}

// 	if (Component.getInitialProps) {
// 		pageProps = await Component.getInitialProps(ctx);
// 	}

// 	pageProps.query = ctx.query;
// 	pageProps.ieBrowser = ie;
// 	return { pageProps };
// }
  export default MyApp;

// class MyApp extends App {
// 	static async getInitialProps({ Component, ctx, req }) {
// 		let pageProps = {};
// 		const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;

// 		let ie = false;
// 		if (userAgent.match(/Edge/i) || userAgent.match(/Trident.*rv[ :]*11\./i)) {
// 			ie = true;
// 		}

// 		if (Component.getInitialProps) {
// 			pageProps = await Component.getInitialProps(ctx);
// 		}

// 		pageProps.query = ctx.query;
// 		pageProps.ieBrowser = ie;
// 		return { pageProps };
// 	}

// 	render() {
// 		const { Component, pageProps } = this.props;
// 		return (
// 			<>
// 				<GlobalStyles />
// 				<Head>
// 					<meta
// 						name="viewport"
// 						content="user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height"
// 					/>
// 					<meta charSet="utf-8" />
// 					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
// 					<title>IFIC - ERP</title>
// 					<link href="/app.css" rel="stylesheet" crossOrigin="anonymous" />
// 					<link href="/nprogress.css" rel="stylesheet" crossOrigin="anonymous" />
// 					<link
// 						href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
// 						rel="stylesheet"
// 						crossOrigin="anonymous"
// 					/>

// 					<link
// 						href="/css/font-awesome.min.css"
// 						rel="stylesheet"
// 						crossOrigin="anonymous"
// 					/>
// 					<link
// 						href="/css/grid-layout.css"
// 						rel="stylesheet"
// 						crossOrigin="anonymous"
// 					/>
// 					<link href="/css/bootstrap.min.css" rel="stylesheet" crossOrigin="anonymous" />
// 					<link
// 						href="/css/react-datepicker.css"
// 						rel="stylesheet"
// 						crossOrigin="anonymous"
// 					/>
// 					<link href="/css/FileUpload.css" rel="stylesheet" crossOrigin="anonymous" />
// 					<link href="/css/treetable.css" rel="stylesheet" crossOrigin="anonymous" />
// 					<link href="/css/codemirror.css" rel="stylesheet" crossOrigin="anonymous" />
// 				</Head>
// 				<AppProvider>
// 					<Page>
// 						<RouteGuard>
// 							{/* <MsalProvider instance={MSalInstance}> */}
// 								<Component {...pageProps} />
// 							{/* </MsalProvider> */}
// 						</RouteGuard>
// 					</Page>
// 				</AppProvider>
// 			</>
// 		);
// 	}
// }

// export default MyApp;
