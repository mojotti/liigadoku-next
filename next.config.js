/** @type {import('next').NextConfig} */
const path = require("path");
const { createCSPHeaders } = require("./next.csp");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = async (phase, { defaultConfig }) =>
  withBundleAnalyzer({
    reactStrictMode: true,
    webpack(config, { webpack }) {
      if (process.env.VERCEL_URL != null) {
        config.plugins.push(
          new webpack.DefinePlugin({
            "process.env.VERCEL_URL": `"${process.env.VERCEL_URL}"`,
          })
        );
      }
      if (process.env.BASE_URL != null) {
        config.plugins.push(
          new webpack.DefinePlugin({
            "process.env.BASE_URL": `"${process.env.BASE_URL}"`,
          })
        );
      }
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      });
      return config;
    },
    poweredByHeader: false,
    async headers() {
      return createCSPHeaders(phase);
    },
  });
