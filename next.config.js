/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  
  // CRITICAL: Disable source maps in production (saves 100-200MB)
  productionBrowserSourceMaps: false,
  
  // Optimize output
  compress: true,
  
  // Optimize images for static export
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ahni-erp-029252c2fbb9.herokuapp.com',
        port: '',
        pathname: '**',
      },
    ],
    formats: ['image/webp'],
    deviceSizes: [640, 828, 1200], // Reduced from 6 to 3 sizes
    imageSizes: [32, 64, 128], // Reduced from 8 to 3 sizes
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: [
      'lucide-react', 
      '@tanstack/react-query', 
      'recharts',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      'react-icons',
    ],
  },

  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Empty turbopack config to silence the warning
  // Turbopack handles most optimizations automatically
  turbopack: {},

  // Keep webpack config for fallback compatibility
  // Note: This won't be used when Turbopack is active
  webpack: (config, { dev, isServer }) => {
    if (isServer) {
      config.externals.push('canvas');
    }
    
    // Production optimizations (only applies when using webpack)
    if (!dev && !isServer) {
      // Minimize chunk size
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 40,
              enforce: true,
            },
            heavy: {
              name: 'heavy-libs',
              test: /[\\/]node_modules[\\/](jspdf|exceljs|html2canvas|react-pdf)[\\/]/,
              priority: 35,
              reuseExistingChunk: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )?.[1];
                return `npm.${packageName?.replace('@', '')}`;
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
              maxSize: 244000,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
              maxSize: 244000,
            },
          },
          maxInitialRequests: 25,
          minSize: 20000,
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;