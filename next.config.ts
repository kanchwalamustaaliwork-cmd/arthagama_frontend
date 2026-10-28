import type { NextConfig } from 'next'
import path from "node:path";

const defaultHosts = ['lh3.googleusercontent.com', 'drive.google.com']
const envHosts = (process.env.IMAGE_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const hosts = Array.from(new Set([...defaultHosts, ...envHosts]))

const nextConfig: NextConfig = {

  // Set the root directory to this Next.js project
  turbopack: {
    root: path.resolve(__dirname),
  },

  // Allow images from external domains used in the app
  images: {
    remotePatterns: hosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
}

export default nextConfig
