/** @type {import('next').NextConfig} */

const withPlugins = require("next-compose-plugins");
const withSvgr = require('next-plugin-svgr');
const withTM = require("next-transpile-modules")([
  "three",
  "react-three-fiber",
  "drei",
]);

module.exports = withPlugins([withSvgr, [withTM, {
  reactStrictMode: true,
  images: {
    domains: ['d23fdhqc1jb9no.cloudfront.net']
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
}]]);