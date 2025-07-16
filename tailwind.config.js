/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
    darkMode: 'class', // Aktifkan mode gelap berbasis kelas
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#6366f1',
                    dark: '#4f46e5',
                },
                bg: {
                    light: '#f8fafc',
                    dark: '#111827',
                },
                sidebar: {
                    light: '#ffffff',
                    dark: '#1f2937',
                },
                text: {
                    light: '#1e293b',
                    dark: '#e2e8f0',
                },
                border: {
                    light: '#e2e8f0',
                    dark: '#374151',
                },
                message: {
                    sent: {
                        light: '#e0e7ff',
                        dark: '#4338ca',
                    },
                    received: {
                        light: '#ffffff',
                        dark: '#374151',
                    },
                },
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}