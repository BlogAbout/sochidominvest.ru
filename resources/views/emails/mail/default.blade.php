@component('mail::message')
    {!! $content !!}

    @component('mail::button', ['url' => config('app.url')])
        Перейти на сайт
    @endcomponent
@endcomponent
