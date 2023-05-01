<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_contacts';
    protected $guarded = false;

    protected $with = ['agent', 'author', 'relationBuildings'];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id', 'id')
            ->without(['avatar', 'author', 'relationBuildings', 'contacts']);
    }

    public function relationBuildings()
    {
        return $this->morphToMany(Building::class, 'object', 'sdi_building_relations')->without(['relationContacts']);
    }
}
