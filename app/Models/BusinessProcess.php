<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use App\Traits\HasEntityDecodeDescriptionAttribute;
use App\Traits\HasEntityDecodeNameAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BusinessProcess extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes, HasEntityDecodeNameAttribute,
        HasEntityDecodeDescriptionAttribute;

    protected $table = 'sdi_business_processes';

    protected $fillable = ['name', 'description', 'type', 'step', 'author_id', 'responsible_id', 'is_active'];

    protected $with = ['responsible', 'attendees', 'feeds', 'buildings'];

    public function responsible()
    {
        return $this->belongsTo(User::class, 'responsible_id', 'id')
            ->without(['avatar', 'post', 'role', 'tariff', 'favorites', 'bpSorting']);
    }

    public function attendees()
    {
        return $this->belongsToMany(User::class, 'sdi_business_process_attendees', 'business_process_id', 'user_id')
            ->without(['avatar', 'post', 'role', 'tariff', 'favorites', 'bpSorting']);
    }

    public function feeds()
    {
        return $this->morphedByMany(Feed::class, 'object', 'sdi_business_process_relations')
            ->without(['author', 'user', 'messages']);
    }

    public function buildings()
    {
        return $this->morphedByMany(Building::class, 'object', 'sdi_business_process_relations')
            ->without(['rentInfo', 'author', 'images', 'videos', 'checkers', 'relationDevelopers', 'relationAgents',
                'relationContacts', 'relationDocuments', 'articles', 'tags', 'prices']);
    }
}
