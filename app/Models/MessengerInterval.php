<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessengerInterval extends Model
{
    use HasFactory;

    protected $table = 'sdi_messenger_intervals';
    protected $guarded = false;
    public $timestamps = false;

    public function messenger()
    {
        return $this->belongsTo(Messenger::class, 'messenger_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function messageStart()
    {
        return $this->belongsTo(Message::class, 'message_start_id', 'id');
    }

    public function messageLast()
    {
        return $this->belongsTo(Message::class, 'message_last_id', 'id');
    }
}
