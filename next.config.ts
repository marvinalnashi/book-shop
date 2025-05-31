import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/lobby',
                permanent: false,
            },
        ]
    },
}

export default nextConfig;