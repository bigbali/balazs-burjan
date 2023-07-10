// @ts-check

/** @type {import("next").NextConfig} */
const config = {
    // eslint-disable-next-line @typescript-eslint/require-await
    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: '/project/algorithms/:path*',
                    destination:
                        'http://localhost:3001/project/algorithms/:path*',
                    basePath: false
                },
                {
                    source: '/project/messages/:path*',
                    destination:
                        'http://localhost:3002/project/messages/:path*',
                    basePath: false
                }
            ],
            afterFiles: [],
            fallback: []
        };
    },
    transpilePackages: ['ui', 'util']
};

export default config;
