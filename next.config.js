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
  webpack: (config, { dev, isServer }) => {
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

    return config;
  },
};

module.exports = nextConfig;
