/** @type {import("prettier").Config} */
module.exports = {
    jsxSingleQuote: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'none',
    plugins: [require.resolve('prettier-plugin-tailwindcss')]
};
