<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessengerInterval extends Model
{
    use HasFactory;

    protected $table = 'sdi_messenger_intervals';

    protected $fillable = ['messenger_id', 'user_id', 'message_start_id', 'message_last_id'];

    public $timestamps = false;

    protected $with = ['messenger', 'user'];

    public function messenger()
    {
        return $this->belongsTo(Messenger::class, 'messenger_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id')
            ->without(['avatar', 'post', 'role', 'tariff', 'favorites', 'bpSorting']);
    }
}
