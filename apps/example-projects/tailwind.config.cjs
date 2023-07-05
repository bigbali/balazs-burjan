/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [require('config/tailwind')],
    content: [
        './**/*.{jsx,ts,tsx}',
        '../../packages/algorithm-visualizers/**/*.{ts,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                'theme-red': 'rgb(204, 18, 18)',
                'theme-dark-bg': '#1E1E23',
                'theme-light-bg': '#FAFAFA',
                'theme-dark-text': '#F0F0F0',
                'theme-light-text': '#232328'
            }
        }
    }
};
