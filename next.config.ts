import type { NextConfig } from 'next';

/**
 * Site + back-office : application Next.js serveur (`next start` ou hébergeur Node).
 * Les images envoyées sont servies par la route /media, d'où `images.unoptimized`.
 */
const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: { unoptimized: true },
  // Ancre la racine du projet (un package-lock.json traîne dans le dossier utilisateur).
  turbopack: { root: process.cwd() },
  experimental: {
    // Galeries du back-office : plusieurs images de 8 Mo maximum par envoi.
    serverActions: { bodySizeLimit: '40mb' },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
