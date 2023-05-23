<?php

namespace App\Mail;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TransactionNewMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    private $transaction;
    private $link;

    public function __construct(Transaction $transaction, string $link)
    {
        $this->transaction = $transaction;
        $this->link = $link;
    }

    public function build()
    {
        return $this->from(config('mail.from.address', 'info@sochidominvest.ru'))
            ->subject('Оплата платежа')
            ->markdown('emails.transactions.new')
            ->text('emails.transactions.new_plain')
            ->with([
                'name' => $this->transaction->name,
                'cost' => $this->transaction->cost,
                'dateCreated' => $this->transaction->created_at,
                'link' => $this->link
            ]);
    }
}
