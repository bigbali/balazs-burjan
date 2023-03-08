/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [require('config/tailwind')],
    content: [
        './**/*.{jsx,ts,tsx}',
        // for some not very sensible reason, we can't simply do `algorithm-visualizers/...`
        '../../packages/algorithm-visualizers/**/*.{ts,tsx}'
    ]
};
