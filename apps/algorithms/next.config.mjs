// @ts-check
import { BASEPATH, PORT } from './src/util/zone.mjs';
// import MillionLint from '@million/lint';

const pathfinder = BASEPATH + '/' + 'pathfinder';

/** @type {import("next").NextConfig} */
const config = {
    transpilePackages: ['ui-react19', 'util-react19'],
    basePath: BASEPATH,
    assetPrefix: `http://localhost:${PORT}${BASEPATH}/`,
    experimental: {
        reactCompiler: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    typescript: {
        ignoreBuildErrors: true
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: pathfinder,
                basePath: false,
                permanent: true
            },
            {
                source: BASEPATH,
                destination: pathfinder,
                basePath: false,
                permanent: true
            }
        ];
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
