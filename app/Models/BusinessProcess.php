<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BusinessProcess extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_business_processes';
    protected $guarded = false;

    protected $with = ['responsible', 'attendees', 'relationFeeds', 'buildings'];

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

    public function relationFeeds()
    {
        return $this->morphedByMany(Feed::class, 'object', 'sdi_business_process_relations')
            ->without(['author', 'user', 'messages']);
    }

    public function buildings()
    {
        return $this->morphedByMany(Building::class, 'object', 'sdi_business_process_relations')
            ->without(['rentInfo', 'author', 'images', 'videos', 'checkers', 'relationDevelopers', 'relationAgents', 'relationContacts', 'relationDocuments', 'relationArticles', 'relationTags']);
    }
}
