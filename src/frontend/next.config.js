// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({
  webpack5: false,
})
