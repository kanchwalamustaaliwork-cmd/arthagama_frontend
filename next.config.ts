import type { NextConfig } from 'next'

const hosts = (process.env.IMAGE_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  // Allow images from external domains used in the app
  images: {
    remotePatterns: hosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
}

export default nextConfig
