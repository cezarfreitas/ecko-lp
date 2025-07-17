/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
  // Disable static generation for admin pages that use localStorage
  async generateStaticParams() {
    return []
  }
}

export default nextConfig
