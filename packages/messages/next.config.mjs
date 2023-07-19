// @ts-check

import { PORT, BASEPATH } from './src/utils/zone.mjs';

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'));

/** @type {import("next").NextConfig} */
const config = {
    experimental: {
        swcPlugins: [['next-superjson-plugin', {}]]
    },
    transpilePackages: ['ui', 'util'],
    basePath: BASEPATH,
    assetPrefix: `http://localhost:${PORT}${BASEPATH}/`
};

export default config;
