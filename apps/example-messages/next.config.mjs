// @ts-check

import { NextFederationPlugin } from '@module-federation/nextjs-mf';

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'));

/** @type {import("next").NextConfig} */
const config = {
    webpack(config, options) {
        const { isServer } = options;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        config.plugins.push(
            new NextFederationPlugin({
                // @ts-ignore
                name: 'examplemessages',
                remotes: {
                    examples: `examples@http://localhost:3000/_next/static/${
                        isServer ? 'ssr' : 'chunks'
                    }/remoteEntry.js`
                },
                filename: 'static/chunks/remoteEntry.js',
                exposes: {
                    './messages': './src/pages/index.tsx'
                },
                shared: {
                    // whatever else
                    'next-auth': {
                        singleton: true,
                        eager: true
                    },
                    '@trpc/client': {
                        singleton: true,
                        eager: true
                    },
                    '@trpc/next': {
                        singleton: true
                        // eager: true
                    },
                    '@trpc/react-query': {
                        singleton: true
                        // eager: true
                    },
                    '@trpc/server': {
                        singleton: true,
                        eager: true
                    }
                },
                extraOptions: {}
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
    transpilePackages: ['ui', 'util']
};

export default config;
