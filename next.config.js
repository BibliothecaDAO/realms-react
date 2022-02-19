/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  // Names of modules that need transpilation
]);

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["d23fdhqc1jb9no.cloudfront.net"],
  },
  webpack(config, _options) {
    config.module.rules.push(
      {
        test: /\.(glb|gltf)$/,
        use: {
          loader: "file-loader",
        },
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      }
    );

    return config;
  },
};

module.exports = withTM(nextConfig);
