/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode temporarily to avoid double rendering issues
  swcMinify: false, // Disable SWC minification since SWC is corrupted
  images: {
    domains: ["ahni-erp-029252c2fbb9.herokuapp.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    forceSwcTransforms: false, // Force using Babel instead of SWC
  },
  // Add proxy configuration for API calls to avoid CORS issues in development
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/:path*',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Enable caching back for better performance
    config.cache = {
      type: 'filesystem',
    };

    // Fix Canvas issues for PDF generation
    if (isServer) {
      config.externals.push('canvas');
    }

    return config;
  },
};

module.exports = nextConfig;
