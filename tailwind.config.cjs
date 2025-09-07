module.exports = {
    content: [
        './components/**/*.{ts,vue,js}',
        './slices/**/*.{ts,vue,js}',
        './slices/Hero/**/*.{ts,vue,js}',
    ],
    theme: {
        extend: {
            fontFamily: {
                body: ['MulishVariable', 'sans-serif'],
                heading: ['Marcellus', 'serif'],
            },
        },
    },
    plugins: [],
}