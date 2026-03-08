import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn1.epicgames.com',
            },
            {
                protocol: 'https',
                hostname: '**.epicgames.com',
            },
            {
                protocol: 'https',
                hostname: 'shared.akamai.steamstatic.com',
            },
            {
                protocol: 'https',
                hostname: '**.steamstatic.com',
            },
            {
                protocol: 'https',
                hostname: 'www.indiegalacdn.com',
            },
            {
                protocol: 'https',
                hostname: 'images.gog-statics.com',
            },
            {
                protocol: 'https',
                hostname: '**.gog-statics.com',
            },
        ],
    },
};

export default nextConfig;