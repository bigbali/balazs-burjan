// @ts-check
import { BASEPATH, PORT } from './src/util/zone.mjs';
import MillionLint from '@million/lint';

/** @type {import("next").NextConfig} */
const config = {
    transpilePackages: ['ui-react19', 'util-react19'],
    basePath: BASEPATH,
    assetPrefix: `http://localhost:${PORT}${BASEPATH}/`,
    experimental: {
        reactCompiler: false
    },
    webpack: (config) => {
        config.externals = [...config.externals, { canvas: 'canvas' }];
        return config;
    }
};

export default MillionLint.next()(config);
// export default config;
