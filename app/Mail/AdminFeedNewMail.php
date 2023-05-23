<?php

namespace App\Mail;

use App\Models\Feed;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminFeedNewMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    private $feed;

    public function __construct(Feed $feed)
    {
        $this->feed = $feed;
    }

    public function build()
    {
        return $this->from(config('mail.from.address', 'info@sochidominvest.ru'))
            ->subject('Заявка в техническую поддержку')
            ->markdown('emails.feeds.admin_new')
            ->text('emails.feeds.admin_feed_plain')
            ->with(['message' => $this->feed->title]);
    }
}
