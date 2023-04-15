const mix = require('laravel-mix')

mix.ts('resources/js/index.tsx', 'public/js/app.js')
    .react()
    .sass('resources/sass/app.scss', 'public/css')
