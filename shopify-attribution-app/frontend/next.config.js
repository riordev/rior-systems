/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL + '/api/:path*' || 'http://localhost:3001/api/:path*'
      }
    ];
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001'
  }
};

module.exports = nextConfig;
