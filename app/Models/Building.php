<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use App\Traits\HasEntityDecodeDescriptionAttribute;
use App\Traits\HasEntityDecodeMetaAttribute;
use App\Traits\HasEntityDecodeNameAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Building extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes, HasEntityDecodeNameAttribute,
        HasEntityDecodeDescriptionAttribute, HasEntityDecodeMetaAttribute;

    protected $table = 'sdi_buildings';

    protected $fillable = [
        'name',
        'description',
        'author_id',
        'address',
        'coordinates',
        'type',
        'status',
        'is_active',
        'is_publish',
        'is_rent',
        'area',
        'area_min',
        'area_max',
        'cost',
        'cost_min',
        'cost_max',
        'cost_min_unit',
        'meta_title',
        'meta_description',
        'views',
    ];

    protected $attributes = [
        'name' => '',
        'description' => '',
        'is_active' => 1,
        'is_publish' => 0,
        'is_rent' => 0,
        'meta_title' => '',
        'meta_description' => '',
        'views' => 0
    ];

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
        'articles',
        'tags'
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

    public function articles()
    {
        return $this->morphedByMany(Article::class, 'object', 'sdi_building_relations')->without(['author', 'images', 'videos', 'buildings']);
    }

    public function tags()
    {
        return $this->morphedByMany(Tag::class, 'object', 'sdi_building_relations');
    }
}
