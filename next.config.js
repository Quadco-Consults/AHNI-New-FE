/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export', // REMOVED - Can't use with API routes
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  compress: true,
  
  images: {
    // For non-static builds, you can use optimized images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'salmon-coast-041522903.6.azurestaticapps.net',
        port: '',
        pathname: '**',
      },
    ],
    formats: ['image/webp'],
    deviceSizes: [640, 828, 1200],
    imageSizes: [32, 64, 128],
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
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  turbopack: {},

  webpack: (config, { dev, isServer }) => {
    if (isServer) {
      config.externals.push('canvas');
    }
    
    if (!dev && !isServer) {
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