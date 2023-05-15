<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_messenger_messages';

    protected $fillable = ['messenger_id', 'message_id', 'type', 'text', 'author_id', 'user_id', 'is_active'];

    protected $with = ['author', 'messenger', 'messageParent', 'user'];

    public function messenger()
    {
        return $this->belongsTo(Messenger::class, 'messenger_id', 'id')
            ->without(['avatar', 'author', 'intervals', 'members']);
    }

    public function messageParent()
    {
        return $this->belongsTo(Message::class, 'message_id', 'id')
            ->without(['author', 'messenger', 'messageParent', 'user']);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id')
            ->without(['avatar', 'post', 'role', 'tariff', 'favorites']);
    }
}
