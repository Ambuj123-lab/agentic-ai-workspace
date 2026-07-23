/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // /api/chat is handled by a custom Next.js API route (src/app/api/chat/route.js)
      // that properly streams SSE without buffering
      {
        source: '/api/conversations/:path*',
        destination: 'http://127.0.0.1:8000/api/conversations/:path*',
      },
      {
        source: '/health',
        destination: 'http://127.0.0.1:8000/health',
      }
      // Note: /api/auth remains handled natively by Next.js
    ];
  },
};

export default nextConfig;
