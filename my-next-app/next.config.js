/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false, // Temporary fix, use with caution
  },
  reactStrictMode: true, // Recommended for catching potential issues early
  swcMinify: true, // Enable SWC minification for faster builds
};

module.exports = nextConfig;
