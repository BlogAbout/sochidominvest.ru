<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Building extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_buildings';
    protected $guarded = false;

    protected $with = [
        'info',
        'rentInfo',
        'author',
        'images',
        'videos',
        'checkers',
        'relationDevelopers',
        'relationAgents',
        'relationContacts',
        'relationDocuments',
        'relationArticles',
        'relationTags'
    ];

    public function info()
    {
        return $this->hasOne(BuildingInfo::class, 'id');
    }

    public function rentInfo()
    {
        return $this->hasOne(BuildingRent::class, 'id');
    }

    public function images()
    {
        return $this->morphToMany(Attachment::class, 'object', 'sdi_images')->without(['author']);
    }

    public function videos()
    {
        return $this->morphToMany(Attachment::class, 'object', 'sdi_videos')->without(['author']);
    }

    public function prices()
    {
        return $this->morphToMany(Price::class, 'object', 'sdi_prices');
    }

    public function checkers()
    {
        return $this->hasMany(Checker::class, 'building_id', 'id')->without(['author', 'building']);
    }

    public function relationDevelopers()
    {
        return $this->morphedByMany(Developer::class, 'object', 'sdi_building_relations')->without(['author', 'avatar', 'buildings']);
    }

    public function relationAgents()
    {
        return $this->morphedByMany(Agent::class, 'object', 'sdi_building_relations')->without(['author', 'avatar', 'buildings', 'contacts']);
    }

    public function relationContacts()
    {
        return $this->morphedByMany(Contact::class, 'object', 'sdi_building_relations')->without(['agent', 'avatar', 'buildings']);
    }

    public function relationDocuments()
    {
        return $this->morphedByMany(Document::class, 'object', 'sdi_building_relations')->without(['author', 'buildings']);
    }

    public function relationArticles()
    {
        return $this->morphedByMany(Article::class, 'object', 'sdi_building_relations')->without(['author', 'images', 'videos', 'buildings']);
    }

    public function relationTags()
    {
        return $this->morphedByMany(Tag::class, 'object', 'sdi_building_relations');
    }
}
