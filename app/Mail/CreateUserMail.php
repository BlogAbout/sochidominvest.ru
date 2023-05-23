<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CreateUserMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    private $login;
    private $password;

    public function __construct(string $login, string $password)
    {
        $this->login = $login;
        $this->password = $password;
    }

    public function build()
    {
        return $this->from(config('mail.from.address', 'info@sochidominvest.ru'))
            ->subject('Для Вас создан аккаунт')
            ->markdown('emails.users.create_user')
            ->text('emails.users.create_user_plain')
            ->with(['login' => $this->login, 'password' => $this->password]);
    }
}
