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
        },
    },
    darkMode: ['selector', '[theme="dark"]'],
}
