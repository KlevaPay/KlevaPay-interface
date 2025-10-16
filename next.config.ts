import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence Turbopack root warning by explicitly setting the project root
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
