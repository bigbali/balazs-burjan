/** @type {import("prettier").Config} */
module.exports = {
    jsxSingleQuote: true,
    singleQuote: true,
    trailingComma: 'none',
    plugins: [require.resolve('prettier-plugin-tailwindcss')]
};
