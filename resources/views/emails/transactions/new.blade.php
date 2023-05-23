@component('mail::message')
    <p>В сервисе СОЧИДОМИНВЕСТ для Вас был выставлен счёт.</p>
    <p>Наименование услуги: <strong>{{$name}}</strong></p>
    <p>Сумма: <strong>{{$cost}} руб.</strong></p>
    <p>Дата выставления счета: <strong>{{$dateCreated}}</strong></p>
    <p>Для проведения платежа перейдите на форму оплаты</p>

    @component('mail::button', ['url' => $link])
        Оплатить
    @endcomponent
@endcomponent
