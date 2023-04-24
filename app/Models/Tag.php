<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tag extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sdi_tags';
    protected $guarded = false;

    protected $with = ['author'];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
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
