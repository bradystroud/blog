import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['color-string', 'color'],
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  transpilePackages: ['tinacms'],
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    qualities: [25, 50, 75, 80],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.tina.io",
        port: "",
      },
    ],
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // Handle CommonJS modules in TinaCMS dependencies
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'color-string': 'commonjs color-string',
        'color': 'commonjs color',
      });
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/home",
      },
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
    ];
  },
};

export default nextConfig;
