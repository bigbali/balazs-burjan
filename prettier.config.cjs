/** @type {import("prettier").Config} */
module.exports = {
    jsxSingleQuote: true,
    singleQuote: true,
    plugins: [require.resolve('prettier-plugin-tailwindcss')]
};
