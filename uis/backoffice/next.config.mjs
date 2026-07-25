/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@hito2-logic"],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
