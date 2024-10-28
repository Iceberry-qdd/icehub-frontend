/** @type {import('tailwindcss').Config} */
module.exports = {
    important: false,
    content: [
        "./src/authApp/**/*.{vue,js,ts,jsx,tsx}",
        "./src/indexApp/**/*.{vue,js,ts,jsx,tsx}",
        "./src/components/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                '3xl': '1600px',
            },
            colors: {
                primary: {
                    DEFAULT: 'rgb(var(--color-primary) / 1)',
                    inActive: 'rgb(var(--color-primary) / 0.6)',
                    disable: 'rgb(var(--color-primary) / 0.38)'
                },
                onPrimary: {
                    DEFAULT: 'rgb(var(--color-on-primary) / 1)',
                    inActive: 'rgb(var(--color-on-primary) / 0.6)',
                    disable: 'rgb(var(--color-on-primary) / 0.38)'
                },
                primaryContainer: {
                    DEFAULT: 'rgb(var(--color-primary-container) / 1)',
                    inActive: 'rgb(var(--color-primary-container) / 0.6)',
                    disable: 'rgb(var(--color-primary-container) / 0.38)'
                },
                onPrimaryContainer: {
                    DEFAULT: 'rgb(var(--color-on-primary-container) / 1)',
                    inActive: 'rgb(var(--color-on-primary-container) / 0.6)',
                    disable: 'rgb(var(--color-on-primary-container) / 0.38)'
                },
                background: {
                    DEFAULT: 'rgb(var(--color-background) / 1)',
                    inActive: 'rgb(var(--color-background) / 0.6)',
                    disable: 'rgb(var(--color-background) / 0.38)'
                },
                onBackground: {
                    DEFAULT: 'rgb(var(--color-on-background) / 1)',
                    inActive: 'rgb(var(--color-on-background) / 0.6)',
                    disable: 'rgb(var(--color-on-background) / 0.38)'
                },
                surface: {
                    DEFAULT: 'rgb(var(--color-surface) / 1)',
                    inActive: 'rgb(var(--color-surface) / 0.6)',
                    disable: 'rgb(var(--color-surface) / 0.38)'
                },
                onSurface: {
                    DEFAULT: 'rgb(var(--color-on-surface) / 1)',
                    inActive: 'rgb(var(--color-on-surface) / 0.6)',
                    disable: 'rgb(var(--color-on-surface) / 0.38)'
                },
                error: {
                    DEFAULT: 'rgb(var(--color-error) / 1)',
                    inActive: 'rgb(var(--color-error) / 0.6)',
                    disable: 'rgb(var(--color-error) / 0.38)'
                },
                onError: {
                    DEFAULT: 'rgb(var(--color-on-error) / 1)',
                    inActive: 'rgb(var(--color-on-error) / 0.6)',
                    disable: 'rgb(var(--color-on-error) / 0.38)'
                },
                helper: {
                    DEFAULT: 'rgb(var(--color-helper) / 1)',
                    inActive: 'rgb(var(--color-helper) / 0.6)',
                    disable: 'rgb(var(--color-helper) / 0.38)' 
                },
                onHelper: {
                    DEFAULT: 'rgb(var(--color-on-helper) / 1)',
                    inActive: 'rgb(var(--color-on-helper) / 0.6)',
                    disable: 'rgb(var(--color-on-helper) / 0.38)'
                },
                border: {
                    DEFAULT: 'rgb(var(--color-border) / 1)',
                    inActive: 'rgb(var(--color-border) / 0.6)',
                    disable: 'rgb(var(--color-border) / 0.38)'
                }
            }
        },
    },
    darkMode: ['selector', '[theme="dark"]'],
}
