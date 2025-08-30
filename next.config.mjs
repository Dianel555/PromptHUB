/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
  images: {
    domains: ["images.unsplash.com", "avatars.githubusercontent.com"],
  },
  webpack: (config, { isServer }) => {
    // 确保路径别名正确解析
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': new URL('.', import.meta.url).pathname.slice(0, -1),
    }
    return config
  },
}

export default nextConfig
