@component('mail::message')
    <p>Здравствуйте, {{$name}}!</p>
    <p>Кто-то запросил восстановление пароля для аккаунта в сервисе СОЧИДОМИНВЕСТ.</p>
    <p>Для завершения процесса восстановления пароля укажите проверочный код:</p>
    <h3>{{$code}}</h3>
    <p>Если Вы этого не делали, просто проигнорируйте это письмо.</p>
@endcomponent