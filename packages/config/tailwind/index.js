/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        '../../packages/ui/**/*.{js,ts,jsx,tsx}',
        '../../packages/algorithm-visualizers/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}'
    ],
    plugins: [],
    theme: {
        extend: {
            colors: {
                'theme-red': 'rgb(204, 18, 18)',
                'theme-dark-bg': '#1E1E23',
                'theme-light-bg': '#FAFAFA',
                'theme-dark-text': '#F0F0F0',
                'theme-light-text': '#232328'
            },
            borderRadius: {
                1: '0.25rem',
                2: '0.5rem',
                3: '0.75rem',
                4: '1rem'
            }
        }
    }
};
