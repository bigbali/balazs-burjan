import twBaseConfig from 'config/tailwind';

export default {
    presets: [twBaseConfig],
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        '../../packages/ui-react19/src/**/*.{js,ts,jsx,tsx}'
    ]
};
