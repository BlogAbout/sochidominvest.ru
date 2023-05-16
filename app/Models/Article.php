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

    protected $fillable = [
        'name',
        'description',
        'author_id',
        'type',
        'is_active',
        'is_publish',
        'avatar_id',
        'meta_title',
        'meta_description'
    ];

    protected $attributes = [
        'name' => '',
        'description' => '',
        'type' => 'article',
        'is_active' => 1,
        'is_publish' => 0,
        'meta_title' => '',
        'meta_description' => '',
        'views' => 0
    ];

    protected $with = ['avatar', 'author', 'images', 'videos', 'buildings'];

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

    public function buildings()
    {
        return $this->morphToMany(Building::class, 'object', 'sdi_building_relations')
            ->without(['rentInfo', 'author', 'images', 'videos', 'checkers', 'relationDevelopers',
                'relationAgents', 'relationContacts', 'relationDocuments', 'articles', 'tags']);
    }
}
