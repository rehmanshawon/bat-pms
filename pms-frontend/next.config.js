
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
//const webpack = require("webpack");
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
	reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
	webpack: ( config, { buildId, dev, isServer, defaultLoaders, webpack } ) => {
    if (!isServer) {
      config.resolve.fallback={            
            fs:false,   
    }
	}
		config.resolve.modules.push( path.resolve( './' ) )

    //regex for excluding .zip files from the bundle
    config.module.rules.push({
      test: /\.zip$/,
      use: "null-loader",
    });

    
		return config
	},
	
} ) )