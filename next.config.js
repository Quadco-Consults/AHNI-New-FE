/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export', // ← UNCOMMENT THIS LINE
  
  // CRITICAL: Disable source maps (saves 100-200MB)
  productionBrowserSourceMaps: false,
  
  compress: true,
  
  // Reduce trace file generation
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ahni-erp-029252c2fbb9.herokuapp.com',
        port: '',
        pathname: '**',
      },
    ],
    formats: ['image/webp'],
    deviceSizes: [640, 1080, 1920],
    imageSizes: [16, 32, 64],
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
      'framer-motion',
      'lodash',
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
      // Aggressive size optimization
      config.optimization = {
        ...config.optimization,
        minimize: true,
        usedExports: true,
        sideEffects: true,
        concatenateModules: true,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 200000,
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },
            pdf: {
              name: 'pdf-libs',
              test: /[\\/]node_modules[\\/](jspdf|jspdf-autotable|react-pdf)[\\/]/,
              priority: 39,
              reuseExistingChunk: true,
            },
            excel: {
              name: 'excel-libs',
              test: /[\\/]node_modules[\\/](exceljs|read-excel-file|write-excel-file)[\\/]/,
              priority: 38,
              reuseExistingChunk: true,
            },
            charts: {
              name: 'chart-libs',
              test: /[\\/]node_modules[\\/](recharts|html2canvas)[\\/]/,
              priority: 37,
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
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
          },
          maxInitialRequests: 25,
        },
      };

      config.optimization.minimizer.forEach((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions = {
            ...minimizer.options.terserOptions,
            compress: {
              ...minimizer.options.terserOptions?.compress,
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info'],
            },
            output: {
              ...minimizer.options.terserOptions?.output,
              comments: false,
            },
          };
        }
      });
    }
    
    return config;
  },
};

module.exports = nextConfig;