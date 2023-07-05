/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{ts,tsx}', './**/*.{ts,tsx}'],
    plugins: [],
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
