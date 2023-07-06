// @ts-check

/** @type {import("next").NextConfig} */
const config = {
    // eslint-disable-next-line @typescript-eslint/require-await
    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: '/project/messages',
                    destination: 'http://localhost:3002/project/messages',
                    basePath: false
                }
            ],
            afterFiles: [],
            fallback: []
        };
    },
    // TODO algorithm-visualizers as seperate app, currently it's a package only
    transpilePackages: ['ui', 'algorithm-visualizers', 'util']
};

export default config;
