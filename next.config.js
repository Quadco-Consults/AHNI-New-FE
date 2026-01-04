/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export configuration for Azure Static Web Apps (disabled for development)
  // output: 'export',
  // trailingSlash: true,
  // distDir: 'build',

  // Bundle optimization
  poweredByHeader: false,
  generateEtags: false,
  reactStrictMode: true, // Enable strict mode for better performance and debugging
  images: {
    unoptimized: false, // Enable image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ahni-erp-029252c2fbb9.herokuapp.com',
        port: '',
        pathname: '**',
      },
    ],
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
  webpack: (config, { isServer, dev }) => {
    // Fix Canvas issues for PDF generation (fallback for webpack builds)
    if (isServer) {
      config.externals.push('canvas');
    }

    // Bundle size optimizations
    if (!dev && !isServer) {
      // Reduce bundle size by excluding source maps from production
      config.devtool = false;

      // Split chunks more aggressively
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 244000, // ~240KB chunks
            },
            common: {
              minChunks: 2,
              chunks: 'all',
              enforce: true,
              maxSize: 244000,
            }
          }
        }
      };
    }

    return config;
  },
};

module.exports = nextConfig;
