/** @type {import('next').NextConfig} */
const API_ENDPOINT = process.env.NEXT_PUBLIC_APP_API_URL;

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/v1/:path*",
        destination: `${API_ENDPOINT}/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
