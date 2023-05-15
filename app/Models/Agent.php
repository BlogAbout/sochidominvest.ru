<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasAvatarAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Agent extends Model
{
    use HasFactory, SoftDeletes, HasAvatarAttribute, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_agents';
    protected $guarded = false;

    protected $with = ['avatar', 'author', 'buildings', 'contacts'];

    public function buildings()
    {
        return $this->morphToMany(Building::class, 'object', 'sdi_building_relations')
            ->without(['rentInfo', 'author', 'images', 'videos', 'checkers', 'relationDevelopers',
                'relationAgents', 'relationContacts', 'relationDocuments', 'relationArticles', 'relationTags']);
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class, 'agent_id', 'id')
            ->without(['agent', 'author', 'buildings']);
    }
}
