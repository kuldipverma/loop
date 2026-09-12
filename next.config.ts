import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Production build ke waqt TypeScript errors deployment block nahi karenge
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;