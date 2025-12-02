import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  // Turbopack configuration (empty config to use Turbopack explicitly)
  turbopack: {},
};

export default nextConfig;
