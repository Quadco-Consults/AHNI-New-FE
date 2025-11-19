/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable strict mode for better performance and debugging
  swcMinify: true, // Enable SWC minification for better performance
  images: {
    domains: ["ahni-erp-029252c2fbb9.herokuapp.com"],
    formats: ['image/webp', 'image/avif'], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon sizes
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache for images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // forceSwcTransforms: true, // Use SWC for faster transforms - temporarily disabled
    scrollRestoration: true, // Better scroll performance
    serverComponentsExternalPackages: [], // Optimize external packages
    optimizePackageImports: ['lucide-react', '@tanstack/react-query', 'recharts'], // Tree shake these packages
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Remove console.logs in production
  },

  webpack: (config, { isServer }) => {
    // Disable filesystem cache temporarily to debug webpack issues
    // config.cache = {
    //   type: 'filesystem',
    // };

    // Fix Canvas issues for PDF generation
    if (isServer) {
      config.externals.push('canvas');
    }

    return config;
  },
};

module.exports = nextConfig;
