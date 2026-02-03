/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#2c3e50',
                    dark: '#1a252f',
                },
                secondary: '#c0392b',
                accent: '#f1c40f',
                neutral: '#ecf0f1',
            }
        },
    },
    plugins: [],
}
