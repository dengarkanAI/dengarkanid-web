import type { NextConfig } from "next";

const cmsUrl = process.env.NODE_ENV === 'production' ? 'http://cms:1337' : 'http://127.0.0.1:1337';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/upload/:path*',
        destination: `${cmsUrl}/upload/:path*`,
      },
      {
        source: '/upload',
        destination: `${cmsUrl}/upload`,
      },
      {
        source: '/uploads/:path*',
        destination: `${cmsUrl}/uploads/:path*`,
      },
      {
        source: '/export-csv/:path*',
        destination: `${cmsUrl}/export-csv/:path*`,
      },
    ];
  },
};

export default nextConfig;
