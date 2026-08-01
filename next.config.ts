import type { NextConfig } from 'next'

const defaultHosts = ['lh3.googleusercontent.com', 'drive.google.com']
const envHosts = (process.env.IMAGE_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const hosts = Array.from(new Set([...defaultHosts, ...envHosts]))

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
