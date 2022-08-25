import * as msal from '@azure/msal-browser';

const MSalConfig = {
	auth: {
		clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
		authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}`,
		redirectUri: '/',
	},
	cache: {
		cacheLocation: 'sessionStorage',
		storeAuthStateInCookie: true,
	},
};

const MSalInstance = new msal.PublicClientApplication(MSalConfig);

export { MSalInstance };
