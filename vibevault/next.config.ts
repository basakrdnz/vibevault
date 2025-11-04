import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  eslint: {
    // Build sırasında ESLint kontrolünü devre dışı bırak
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Build sırasında TypeScript kontrolünü devre dışı bırak (opsiyonel)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
