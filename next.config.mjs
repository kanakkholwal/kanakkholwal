/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  crossOrigin: "anonymous",
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { hostname: 'visitor-badge.laobi.icu' },
    ],
  },
};

export default nextConfig;
