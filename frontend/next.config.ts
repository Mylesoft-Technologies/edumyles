import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverActions: {
    allowedOrigins: [
      "localhost:3000",
      "edumyles.vercel.app",
      "edumyles-app.vercel.app",
    ],
  },
  env: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL ?? "",
    NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "edumyles.com",
    MASTER_ADMIN_EMAIL: process.env.MASTER_ADMIN_EMAIL ?? "",
    MASTER_TENANT_ID: process.env.MASTER_TENANT_ID ?? "PLATFORM",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.convex.cloud" },
      { protocol: "https", hostname: "**.cloudinary.com" },
    ],
  },
};

export default nextConfig;
