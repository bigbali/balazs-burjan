// @ts-check
import { BASEPATH, PORT } from './src/util/zone.mjs';
// import MillionLint from '@million/lint';

/** @type {import("next").NextConfig} */
const config = {
    transpilePackages: ['ui-react19', 'util-react19'],
    basePath: BASEPATH,
    assetPrefix: `http://localhost:${PORT}${BASEPATH}/`,
    experimental: {
        reactCompiler: true
    },
    webpack: (config) => {
        config.externals = [...config.externals, { canvas: 'canvas' }];
        return config;
    }
};

// doesn't work with yarn pnp

// export default process.env.NODE_ENV === 'development'
//     ? MillionLint.next()(config)
//     : config;

export default config;
