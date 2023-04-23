<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Building extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sdi_buildings';
    protected $guarded = false;

    public function info()
    {
        return $this->hasOne(BuildingInfo::class, 'id');
    }

    public function rentInfo()
    {
        return $this->hasOne(BuildingRent::class, 'id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }

    public function images()
    {
        return $this->belongsToMany(Attachment::class, 'sdi_images', 'attachment_id', 'object_id')->wherePivot('object_type', 'building');
    }

    public function videos()
    {
        return $this->belongsToMany(Attachment::class, 'sdi_videos', 'attachment_id', 'object_id')->wherePivot('object_type', 'building');
    }

    public function prices()
    {
        return $this->hasMany(Price::class, 'object_id', 'id')->where('object_type', 'like', 'building');
    }

    public function checkers()
    {
        return $this->hasMany(Checker::class, 'building_id', 'id');
    }

    public function relationDevelopers()
    {
        return $this->belongsToMany(Article::class, 'sdi_building_relations', 'building_id', 'object_id')->wherePivot('object_type', 'developer');
    }

    public function relationAgents()
    {
        return $this->belongsToMany(Agent::class, 'sdi_building_relations', 'building_id', 'object_id')->wherePivot('object_type', 'agent');
    }

    public function relationContacts()
    {
        return $this->belongsToMany(Article::class, 'sdi_building_relations', 'building_id', 'object_id')->wherePivot('object_type', 'contact');
    }

    public function relationDocuments()
    {
        return $this->belongsToMany(Article::class, 'sdi_building_relations', 'building_id', 'object_id')->wherePivot('object_type', 'document');
    }

    public function relationArticles()
    {
        return $this->belongsToMany(Article::class, 'sdi_building_relations', 'building_id', 'object_id')->wherePivot('object_type', 'article');
    }

    public function relationTags()
    {
        return $this->belongsToMany(Article::class, 'sdi_building_relations', 'building_id', 'object_id')->wherePivot('object_type', 'tag');
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
