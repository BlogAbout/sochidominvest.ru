<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Feed extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sdi_feeds';
    protected $guarded = false;

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id')->without(['favorites']);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id')->without(['favorites'])->without(['favorites']);
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
