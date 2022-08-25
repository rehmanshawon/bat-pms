// /** @type {import('next').NextConfig} */
// const path = require("path");
// //const withAntdLess = require("next-plugin-antd-less");
// const withLess = require("next-with-less");
// const pathToLessFileWithVariables = path.resolve(
//   "./assets/styles.less"
// );
// module.exports = withLess({    
//   reactStrictMode: true,
//   swcMinify: true,
//   // optional
//   //modifyVars: { "@primary-color": "#04f" },
//   // optional
//   //lessVarsFilePath: "./assets/styles.less",
//   // optional
//  // lessVarsFilePathAppendToEndOfContent: false,
//   // optional https://github.com/webpack-contrib/css-loader#object
//   //cssLoaderOptions: {},

//   // Other Config Here...
//  // target: "server",
//  lessLoaderOptions: {
//   /* ... */
//   additionalData: (content) =>
//     `${content}\n\n@import '${pathToLessFileWithVariables}';`,
// },
//   distDir: ".next",
//   cleanDistDir: true,
//   // experimental: {
//   //   forceSwcTransforms: true,
//   // },
//   output: !!process.env.NEXT_PRIVATE_STANDALONE ? "standalone" : undefined,
//   webpack(config) {
//     config.resolve.modules.push(path.resolve("./"));
//     return config;
//   },

//   // ONLY for Next.js 10, if you use Next.js 11, delete this block
//   // future: {
//   //   webpack5: true,
//   // },
// });

// // const nextConfig = {
// //   reactStrictMode: true,
// //   swcMinify: true,
// // }

// //module.exports = nextConfig
const lessToJS = require( 'less-vars-to-js' )
const fs = require( 'fs' )
const path = require( 'path' )
const withLess = require("next-with-less");
//const MomentLocalesPlugin = require( 'moment-locales-webpack-plugin' )

// Where your antd-custom.less file lives
const theme = lessToJS(
	fs.readFileSync( path.resolve( __dirname, './assets/styles.less' ), 'utf8' )
)

const withBundleAnalyzer = require( '@next/bundle-analyzer' )( {
	enabled: process.env.ANALYZE === 'true',
} )

module.exports = withBundleAnalyzer( withLess( {
	lessLoaderOptions: {
		lessOptions: {
			javascriptEnabled: true,
			modifyVars: theme,
		}
	},
	productionBrowserSourceMaps: false,
	publicRuntimeConfig: { theme },
	webpack: ( config, { buildId, dev, isServer, defaultLoaders, webpack } ) => {
		config.resolve.modules.push( path.resolve( './' ) )

		// config.plugins.push(
		// 	new MomentLocalesPlugin( {
		// 		localesToKeep: [ 'en' ]
		// 	} ) )

		return config
	},
	// i18n: {
	// 	locales: [ 'en' ],
	// 	defaultLocale: 'en'
	// },
	future: {
		webpack5: true
	}
} ) )