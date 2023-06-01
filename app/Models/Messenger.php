<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasAvatarAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Messenger extends Model
{
    use HasFactory, SoftDeletes, HasAvatarAttribute, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_messengers';

    protected $fillable = ['name', 'type', 'author_id', 'avatar_id'];

    protected $with = ['avatar', 'author', 'intervals', 'members'];

    public function intervals()
    {
        return $this->hasMany(MessengerInterval::class, 'messenger_id', 'id')
            ->without(['messenger', 'user']);
    }

    public function members()
    {
        return $this->hasMany(MessengerMember::class, 'messenger_id', 'id')
            ->without(['messenger', 'user']);
    }
}
