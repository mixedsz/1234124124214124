/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.tebex.io' },
      { protocol: 'https', hostname: '**.cfx-services.net' },
      { protocol: 'https', hostname: 'forum.cfx.re' },
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      { protocol: 'https', hostname: 'dunb17ur4ymx4.cloudfront.net' },
    ],
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
