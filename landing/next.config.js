/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_WORKOS_CLIENT_ID: process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID ?? "",
    WORKOS_REDIRECT_URI: process.env.WORKOS_REDIRECT_URI ?? "",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "",
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
  output: undefined, // Force SSR mode instead of static generation
};

module.exports = nextConfig;
