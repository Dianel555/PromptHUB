/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  images: {
    domains: ["images.unsplash.com", "avatars.githubusercontent.com"],
  },
}

export default nextConfig