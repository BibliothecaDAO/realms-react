/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "three",
  "react-three-fiber",
  "drei",
]);
const withSvgr = require('next-plugin-svgr');

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ['d23fdhqc1jb9no.cloudfront.net'],
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: "file-loader",
      },
    },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      });

    return config;
  },
});

module.exports = withSvgr();
