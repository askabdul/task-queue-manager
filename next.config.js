/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {},
  env: {
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
    API_BASE_URL: process.env.API_BASE_URL || "http://localhost:3001",
    WEBSOCKET_URL: process.env.WEBSOCKET_URL || "ws://localhost:3001",
  },
};

module.exports = nextConfig;
