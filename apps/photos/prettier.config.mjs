import config from 'config/prettier.config.mjs';

/** @type {import('prettier').Config} */
export default {
    ...config,
    plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
    svelteSelfCloseElements: 'always',
    svelteBracketNewLine: true,
    htmlWhitespaceSensitivity: 'strict'
};
