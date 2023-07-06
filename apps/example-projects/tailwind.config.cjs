/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [require('config/tailwind')],
    content: [
        './**/*.{jsx,ts,tsx}',
        '../../packages/algorithm-visualizers/**/*.{ts,tsx}',
        'ui/*.{ts,tsx}'
    ]
};
