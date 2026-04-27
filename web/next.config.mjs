/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint during `next build` is very slow on some Windows/OneDrive setups; run `npm run lint` in CI or locally.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "xbflxxcrneszarauxjeg.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
