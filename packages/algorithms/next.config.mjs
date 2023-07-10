// @ts-check
import { BASEPATH, PORT } from './src/util/zone.mjs';

/** @type {import("next").NextConfig} */
const config = {
    transpilePackages: ['ui', 'util'],
    basePath: BASEPATH,
    assetPrefix: `http://localhost:${PORT}${BASEPATH}/`
};

export default config;
