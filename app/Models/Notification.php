<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sdi_notifications';
    protected $guarded = false;

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id')->without(['favorites']);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'sdi_notification_users', 'notification_id', 'user_id');
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
