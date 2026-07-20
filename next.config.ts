import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow images from external domains used in the app
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'images.moneycontrol.com' },
      { protocol: 'https', hostname: 'img.etimg.com' },
    ],
  },
}

export default nextConfig
