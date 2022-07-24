/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // assetPrefix: './', // support IPFS hosting
  experimental: {
    images: {
      unoptimized: true,
    },
  },
};

module.exports = nextConfig;
