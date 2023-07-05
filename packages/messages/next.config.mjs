// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import million from 'million/compiler';
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'));

/** @type {import("next").NextConfig} */
const config = {
    // reactStrictMode: true,
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

// export default config;
export default million.next(config);
