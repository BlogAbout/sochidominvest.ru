<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminBookingNewMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    private $building;
    private $dateStart;
    private $dateFinish;

    public function __construct($building, $dateStart, $dateFinish)
    {
        $this->building = $building;
        $this->dateStart = $dateStart;
        $this->dateFinish = $dateFinish;
    }

    public function build()
    {
        return $this->from(config('mail.from.address', 'info@sochidominvest.ru'))
            ->subject('Новая бронь')
            ->markdown('emails.bookings.admin_new')
            ->text('emails.bookings.admin_feed_plain')
            ->with(['building' => $this->building, 'dateStart' => $this->dateStart, 'dateFinish' => $this->dateFinish]);
    }
}
