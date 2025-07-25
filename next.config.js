/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      's3-alpha-sig.figma.com',
      'skillicons.dev',
      'lh3.googleusercontent.com'
    ],
  },
};

module.exports = nextConfig;
