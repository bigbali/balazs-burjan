/** @type {import("prettier").Config} */
export default {
    jsxSingleQuote: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'none',
    plugins: [import('prettier-plugin-tailwindcss'), import('prettier-plugin-svelte')]
};
