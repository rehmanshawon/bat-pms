// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// }

// module.exports = nextConfig
const MS_PER_SECOND = 1000;
const SECONDS_PER_DAY = 86400;

if (typeof require !== "undefined") {
  require.extensions[".less"] = (file) => {};
}
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withLess = require("next-with-less"),
fs = require("fs"),
path=require("path"),
lessToJS = require("less-vars-to-js"),
themeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, './assets/styles.less'),
    'utf8'
  )
),
  nextConfig = {
    publicRuntimeConfig: {
      apiUrl:
        process.env.NODE_ENV === "development"
          ? "http://192.168.0.27:4000/api/v1" // development api
          : "http://192.168.0.27:4000/api/v1", // production api
    },
    output: !!process.env.NEXT_PRIVATE_STANDALONE ? 'standalone' : undefined,
    target: 'server',
    env: {
      weatherApi: "YOUR_WEATHER_API_KEY",
      mapBoxApi: "YOUR_MAP_BOX_API_KEY",
    },
    onDemandEntries: {
      // period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: SECONDS_PER_DAY * MS_PER_SECOND,
      // number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 100,
    },
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables,
    },

    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback.fs = false;
      }

       config.plugins.push(
         new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery",
         })
       );

      //regex for excluding .zip files from the bundle
      config.module.rules.push({
        test: /\.zip$/,
        use: "null-loader",
      });

     //config.plugins.push(new webpack.IgnorePlugin(/pages.*\/test.*\.bck$/));

      config.module.rules.push(
        {
          test: /\.md$/,
          use: "raw-loader",
        },
        { test: /\.txt$/, use: "raw-loader" },
        // {
        //   test: /\.css$/,
        //   use: ["css-loader"],
        // },
        // { test: /\.scss$/, use: "raw-loader" },
        {
          test: /\.(sass|scss)$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-sass-loader', 'sass-loader','postcss-reporter']
        },
      );

      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === "function") {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === "function" ? [] : origExternals),
        ];

        config.module.rules.unshift({
          test: antStyles,
          use: "null-loader",
        });
      }
      return config;
    },
  };

module.exports = withBundleAnalyzer(withLess(nextConfig));
