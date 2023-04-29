const mix = require('laravel-mix')

mix.ts('resources/js/index.tsx', 'public/js/app.js')
    .react()
    .extract([
        'axios', 'react', 'react-dom', 'moment', 'react-beautiful-dnd', 'react-mde',
        'react-redux', 'react-router-dom', 'react-toastify', 'react-yandex-maps',
        'redux', 'redux-thunk', 'video-react', 'showdown'
    ])
    .sourceMaps()
    .sass('resources/sass/app.scss', 'public/css')
