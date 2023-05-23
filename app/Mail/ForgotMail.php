<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ForgotMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    private $name;
    private $code;

    public function __construct(string $name, string $code)
    {
        $this->name = $name;
        $this->code = $code;
    }

    public function build()
    {
        return $this->from(config('mail.from.address', 'info@sochidominvest.ru'))
            ->subject('Восстановление пароля')
            ->markdown('emails.users.forgot')
            ->text('emails.users.forgot_plain')
            ->with(['name' => $this->name, 'code' => $this->code]);
    }
}
