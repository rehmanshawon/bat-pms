/** @type {import('next').NextConfig} */
const path = require('path')
const withAntdLess = require('next-plugin-antd-less');

module.exports = withAntdLess({
  reactStrictMode: true,
  swcMinify: true,
  // optional
  modifyVars: { '@primary-color': '#04f' },
  // optional
  lessVarsFilePath: './assets/styles.less',
  // optional
  lessVarsFilePathAppendToEndOfContent: false,
  // optional https://github.com/webpack-contrib/css-loader#object
  cssLoaderOptions: {},

  // Other Config Here...
  target: "server",
  distDir: '.next',
  cleanDistDir: true,
  output: !!process.env.NEXT_PRIVATE_STANDALONE ? 'standalone' : undefined,
  webpack(config) {
    config.resolve.modules.push(path.resolve('./'))
    return config;
  },

  // ONLY for Next.js 10, if you use Next.js 11, delete this block
  // future: {
  //   webpack5: true,
  // },
});

// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// }

//module.exports = nextConfig
