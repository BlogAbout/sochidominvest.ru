<?php

namespace App\Mail;

use App\Models\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MailDefault extends Mailable
{
    use Queueable, SerializesModels;

    private $mail;

    public function __construct(Mail $mail)
    {
        $this->mail = $mail;
    }

    public function build()
    {
        return $this->from(config('mail.from.address', 'info@sochidominvest.ru'))
            ->subject($this->mail->title)
            ->markdown('emails.mail.default')
            ->with(['content' => $this->mail->content_html]);
    }
}
