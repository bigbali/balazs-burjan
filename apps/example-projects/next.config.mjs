// @ts-check

import { NextFederationPlugin } from '@module-federation/nextjs-mf';
// @ts-ignore
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config = {
    webpack(config, options) {
        const { isServer } = options;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        config.plugins.push(
            new NextFederationPlugin({
                name: 'example-projects',
                filename: 'static/chunks/remoteEntry.js',
                remotes: {
                    messages: `messages@http://localhost:3001/_next/static/${
                        isServer ? 'ssr' : 'chunks'
                    }/remoteEntry.js`
                },
                extraOptions: {}
            }),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            new PrismaPlugin()
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
    transpilePackages: [
        '@local/ui',
        '@local/algorithm-visualizers',
        '@local/util'
        // '@local/messages'
    ]
};

export default config;
