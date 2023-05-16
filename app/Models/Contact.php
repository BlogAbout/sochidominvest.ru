<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use App\Traits\HasEntityDecodeNameAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes, HasEntityDecodeNameAttribute;

    protected $table = 'sdi_contacts';

    protected $fillable = ['agent_id', 'post', 'name', 'phone', 'author_id', 'is_active'];

    protected $with = ['agent', 'author', 'buildings'];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id', 'id')
            ->without(['avatar', 'author', 'buildings', 'contacts']);
    }

    public function buildings()
    {
        return $this->morphToMany(Building::class, 'object', 'sdi_building_relations')
            ->without(['rentInfo', 'author', 'images', 'videos', 'checkers', 'relationDevelopers',
                'relationAgents', 'relationContacts', 'relationDocuments', 'articles', 'tags']);
    }

    public function getPostAttribute($value)
    {
        return html_entity_decode($value);
    }
}
