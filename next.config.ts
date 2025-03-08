import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              frame-src 'self' 
                https://*.youtube.com https://youtube.com 
                https://*.vimeo.com https://vimeo.com 
                https://*.wistia.com https://wistia.com 
                https://*.loom.com https://loom.com 
                https://*.dailymotion.com https://dailymotion.com
                https://*.vidyard.com https://vidyard.com
                https://*.spotify.com https://spotify.com
                https://*.twitch.tv https://twitch.tv
                https://*.soundcloud.com https://soundcloud.com
                https://*.ted.com https://ted.com
                https://*.facebook.com https://facebook.com
                https://*.twitter.com https://twitter.com
                https://*.instagram.com https://instagram.com
                https://upload.wikimedia.org https://*.wikimedia.org;
              frame-ancestors 'self';
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
