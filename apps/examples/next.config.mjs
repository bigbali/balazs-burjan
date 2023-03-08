// @ts-check

// import { NextFederationPlugin } from '@module-federation/nextjs-mf';

const NextFederationPlugin = await import('@module-federation/nextjs-mf').then(
    (x) => x.NextFederationPlugin
);

/** @type {import("next").NextConfig} */
const config = {
    webpack(config, options) {
        const { isServer } = options;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        config.plugins.push(
            new NextFederationPlugin({
                // @ts-ignore
                name: 'examples',
                filename: 'static/chunks/remoteEntry.js',
                remotes: {
                    'example-messages': `example-messages@http://localhost:3001/_next/static/${
                        isServer ? 'ssr' : 'chunks'
                    }/remoteEntry.js`
                }
            })
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return config;
    },
    reactStrictMode: false,
    /**
     * If you have the "experimental: { appDir: true }" setting enabled, then you
     * must comment the below `i18n` config out.
     *
     * @see https://github.com/vercel/next.js/issues/41980
     */
    i18n: {
        locales: ['en'],
        defaultLocale: 'en'
    },
    experimental: {
        swcPlugins: [['next-superjson-plugin', {}]]
    },
    transpilePackages: ['ui', 'algorithm-visualizers', 'util']
};

export default config;
