import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['css-loader'],
      include: /node_modules/,
    });
    return config;
  },
};

export default nextConfig;