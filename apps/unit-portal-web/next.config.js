/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@safepulse/shared'],
};

// Note: PWA disabled temporarily - next-pwa is incompatible with Next.js 16
// To re-enable, update next-pwa or use @ducanh2912/next-pwa
module.exports = nextConfig;
