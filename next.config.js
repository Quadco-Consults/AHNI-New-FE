/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["ahni-erp-029252c2fbb9.herokuapp.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Ignore PDF worker files for now to avoid build issues
    config.resolve.alias = {
      ...config.resolve.alias,
      "pdfjs-dist/build/pdf.worker.min.js": false,
      "pdfjs-dist/build/pdf.worker.min.mjs": false,
    };

    // Ignore .mjs files that cause issues
    config.module.rules.push({
      test: /\.mjs$/,
      type: "javascript/auto",
    });

    // Fix for Vite to Next.js migration - better ESM/CJS handling
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".jsx": [".tsx", ".jsx"],
    };

    // Ensure proper module resolution for react-hook-form and other ESM packages
    config.resolve.fallback = {
      ...config.resolve.fallback,
    };

    // Disable cache to avoid stale module resolution from Vite
    config.cache = false;

    // Force ESM resolution for problematic packages
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        'react-hook-form': 'commonjs react-hook-form',
      });
    }

    return config;
  },
};

module.exports = nextConfig;
