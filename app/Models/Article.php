<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasAvatarAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, SoftDeletes, HasAvatarAttribute, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_articles';
    protected $guarded = false;

    protected $with = ['avatar', 'author', 'images', 'videos', 'relationBuildings'];

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
}
