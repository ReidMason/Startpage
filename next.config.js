/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  swcMinify: true,
  images: {
    domains: ["openweathermap.org"],
  },
};

module.exports = nextConfig;
