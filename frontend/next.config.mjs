/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Proxy these specific backend endpoints to FastAPI
      {
        source: '/api/chat',
        destination: 'http://127.0.0.1:8001/api/chat',
      },
      {
        source: '/api/conversations/:path*',
        destination: 'http://127.0.0.1:8001/api/conversations/:path*',
      },
      {
        source: '/health',
        destination: 'http://127.0.0.1:8001/health',
      }
      // Note: /api/auth remains handled natively by Next.js
    ];
  },
};

export default nextConfig;
