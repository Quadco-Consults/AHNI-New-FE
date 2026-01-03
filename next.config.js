/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable strict mode for better performance and debugging
  output: 'export',
  distDir: 'out',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ahni-erp-029252c2fbb9.herokuapp.com',
        port: '',
        pathname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon sizes
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache for images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: [], // Moved from experimental.serverComponentsExternalPackages
  experimental: {
    // forceSwcTransforms: true, // Use SWC for faster transforms - temporarily disabled
    scrollRestoration: true, // Better scroll performance
    optimizePackageImports: ['lucide-react', '@tanstack/react-query', 'recharts'], // Tree shake these packages
  },
  // Turbopack configuration (empty to acknowledge usage and silence warnings)
  turbopack: {},

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Remove console.logs in production
  },

  // Keep webpack config for Pages Router compatibility and fallback
  webpack: (config, { isServer }) => {
    // Fix Canvas issues for PDF generation (fallback for webpack builds)
    if (isServer) {
      config.externals.push('canvas');
    }
    return config;
  },
};


module.exports = nextConfig;
