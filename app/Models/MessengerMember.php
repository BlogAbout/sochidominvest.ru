<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessengerMember extends Model
{
    use HasFactory;

    protected $table = 'sdi_messenger_members';
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

    public function messageRead()
    {
        return $this->belongsTo(Message::class, 'message_read_id', 'id');
    }

    public function messageDeleted()
    {
        return $this->belongsTo(Message::class, 'message_deleted_id', 'id');
    }
}
