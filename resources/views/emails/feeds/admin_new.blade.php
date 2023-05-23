@component('mail::message')
    <p>В сервисе СОЧИДОМИНВЕСТ появилось новое обращение в техническую поддержку.</p>
    <p>Тема: <strong>{{$message}}</strong></p>
    <p>Пожалуйста, проверьте заявки и свяжитесь с клиентом!</p>

    @component('mail::button', ['url' => config('app.url')])
        Смотреть
    @endcomponent
@endcomponent
