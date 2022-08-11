import '../styles/globals.css'
import '../assets/styles.less';

import React,{useEffect,useState} from 'react';
import Head from 'next/head';
import Router from 'next/router';
import dynamic from 'next/dynamic'
import { Suspense } from 'react';
import NProgress from 'nprogress';
import Page from '../components/Page';
import { RouteGuard } from '../components/RouteGuard';
import AppProvider from '../components/shared/AppProvider';
import { GlobalStyles } from '../components/styles/GlobalStyles';

// const Page = dynamic(() => import('../components/Page'), {
//   suspense: true,
// })

// const RouteGuard = dynamic(() => import('../components/RouteGuard'), {
//   suspense: true,
// })

// const AppProvider = dynamic(() => import('../components/shared/AppProvider'), {
//   suspense: true,
// })



function MyApp({ Component, pageProps }) {

  useEffect(()=>{
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    Router.events.on("routeChangeStart", handleRouteStart);
    Router.events.on("routeChangeComplete", handleRouteDone);
    Router.events.on("routeChangeError", handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      Router.events.off("routeChangeStart", handleRouteStart);
      Router.events.off("routeChangeComplete", handleRouteDone);
      Router.events.off("routeChangeError", handleRouteDone);
    };
  },[])
  
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
					
					
				</Head>
        <AppProvider>
        
					<Page>
          
						<RouteGuard>
							{/* <MsalProvider instance={MSalInstance}> */}
								<Component {...pageProps} />
							{/* </MsalProvider> */}
						</RouteGuard>
					</Page>
         
				</AppProvider>
    </>
  )
}

export default MyApp
