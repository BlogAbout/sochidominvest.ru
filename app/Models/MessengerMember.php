<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessengerMember extends Model
{
    use HasFactory;

    protected $table = 'sdi_messenger_members';

    protected $fillable = ['messenger_id', 'user_id', 'message_read_id', 'message_deleted_id', 'is_active'];

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
