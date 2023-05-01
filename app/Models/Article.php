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

    protected $with = ['avatar', 'author', 'images', 'videos', 'relationBuildings'];

    public function avatar()
    {
        return $this->belongsTo(Attachment::class, 'avatar_id', 'id')
            ->without(['poster', 'author']);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id')
            ->without(['avatar', 'post', 'role', 'tariff', 'favorites', 'bpSorting']);
    }

    public function images()
    {
        return $this->morphToMany(Attachment::class, 'object', 'sdi_images')
            ->without(['poster', 'author']);
    }

    public function videos()
    {
        return $this->morphToMany(Attachment::class, 'object', 'sdi_videos')
            ->without(['author']);
    }

    public function relationBuildings()
    {
        return $this->morphToMany(Building::class, 'object', 'sdi_building_relations')
            ->without(['rentInfo', 'author', 'images', 'videos', 'checkers', 'relationDevelopers',
                'relationAgents', 'relationContacts', 'relationDocuments', 'relationArticles', 'relationTags']);
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
