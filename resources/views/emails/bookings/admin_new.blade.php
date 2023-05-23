@component('mail::message')
    <p>В сервисе СОЧИДОМИНВЕСТ зарегистрирована новая бронь.</p>
    <p>Объект недвижимости: <strong>{{$building}}</strong></p>
    <p>Дата заезда: <strong>{{$dateStart}}</strong></p>
    <p>Дата выезда: <strong>{{$dateFinish}}</strong></p>
    <p>Пожалуйста, проверьте заявки и свяжитесь с клиентом!</p>

    @component('mail::button', ['url' => config('app.url')])
        Смотреть
    @endcomponent
@endcomponent
