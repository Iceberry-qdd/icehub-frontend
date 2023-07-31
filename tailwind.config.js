/** @type {import('tailwindcss').Config} */
module.exports = {
    important: false,
    content: [
        "./index.html",
        "./src/**/tailwind/*.{vue,js,ts,jsx,tsx}",
        "./src/**/menus/*.{vue,js,ts,jsx,tsx}",
        "./src/**/setting/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
