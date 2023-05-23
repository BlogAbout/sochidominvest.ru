@component('mail::message')
    <p>Здравствуйте!</p>
    <p>Для Вас был создан аккаунт в сервисе СОЧИДОМИНВЕСТ.</p>
    <p>Ваши данные для входа:</p>
    <p><strong>Логин:</strong> {{$login}}<br/><strong>Пароль:</strong> {{$password}}</p>
    @component('mail::button', ['url' => config('app.url')])
        Войти
    @endcomponent
@endcomponent
