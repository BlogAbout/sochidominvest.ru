<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sdi_articles';
    protected $guarded = false;

    public function avatar()
    {
        return $this->belongsTo(Attachment::class, 'avatar_id', 'id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }

    public function images()
    {
        return $this->belongsToMany(Attachment::class, 'sdi_images', 'attachment_id', 'object_id')->wherePivot('object_type', 'article');
    }

    public function videos()
    {
        return $this->belongsToMany(Attachment::class, 'sdi_videos', 'attachment_id', 'object_id')->wherePivot('object_type', 'article');
    }

    public function relationBuildings()
    {
        return $this->belongsToMany(Building::class, 'sdi_building_relations', 'object_id', 'building_id')->wherePivot('object_type', 'article');
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
