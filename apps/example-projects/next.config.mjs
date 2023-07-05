// @ts-check

/** @type {import("next").NextConfig} */
const config = {
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
    // TODO algorithm-visualizers as seperate app, currently it's a package only
    transpilePackages: ['ui', 'algorithm-visualizers', 'util']
};

export default config;
