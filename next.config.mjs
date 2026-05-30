/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.flakedev.com' }],
        destination: 'https://flakedev.com/:path*',
        permanent: true,
      },
    ];
  },
}

export default nextConfig
