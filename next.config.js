/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning instead of error for ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning instead of error for TypeScript
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
  images: {
    domains: ['images.unsplash.com', 'assets.aceternity.com'],
  },
  // Add performance optimizations
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
