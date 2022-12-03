/** @type {import('tailwindcss').Config} */
module.exports = {
    important: true,
    content: [
        "./index.html",
        "./src/**/tailwind/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
