/** @type {import('tailwindcss').Config} */
export default {
    plugins: [],
    theme: {
        extend: {
            colors: {
                theme: {
                    primary: '#cc1212',
                    bg: {

                    },
                    control: {
                        bg: {
                            light: '#DADDDD',
                            dark: '#262629'
                        }
                    },
                    border: {
                        light: '#CBD5E1',
                        dark: '#323538'
                    }
                }
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
