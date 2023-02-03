// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'));

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    sassOptions: {
        additionalData: (/** @type {string} */ content) => {
            // put something in here and all .scss files will have it
            const importAutomatically = [
                '@import "src/style/mixin.scss";',
                '@import "src/style/function.scss";',
            ];

            return importAutomatically.join('').concat(content);
        }
    },

    /**
     * If you have the "experimental: { appDir: true }" setting enabled, then you
     * must comment the below `i18n` config out.
     *
     * @see https://github.com/vercel/next.js/issues/41980
     */
    i18n: {
        locales: ['en'],
        defaultLocale: 'en',
    },
};

export default config;
