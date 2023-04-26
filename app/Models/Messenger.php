<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Messenger extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sdi_messengers';
    protected $guarded = false;

    public function avatar()
    {
        return $this->belongsTo(Attachment::class, 'avatar_id', 'id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id')->without(['favorites']);
    }

    public function intervals()
    {
        return $this->hasMany(MessengerInterval::class, 'messenger_id', 'id');
    }

    public function members()
    {
        return $this->hasMany(MessengerMember::class, 'messenger_id', 'id');
    }

    public function getDateCreatedFormatAttribute(): string
    {
        return Carbon::parse($this->created_at)->diffForHumans();
    }

    public function getDateUpdatedFormatAttribute(): string
    {
        return Carbon::parse($this->updated_at)->diffForHumans();
    }
}
