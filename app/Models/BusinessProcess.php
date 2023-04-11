<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BusinessProcess extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sdi_business_processes';
    protected $guarded = false;

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }

    public function responsible()
    {
        return $this->belongsTo(User::class, 'responsible_id', 'id');
    }

    public function attendees()
    {
        return $this->belongsToMany(User::class, 'sdi_business_process_attendees', 'business_process_id', 'user_id');
    }

    public function relationFeeds()
    {
        return $this->belongsToMany(Feed::class, 'sdi_business_process_relations', 'business_process_id', 'object_id')->wherePivot('object_type', 'feed');
    }

    public function relationBuildings()
    {
        return $this->belongsToMany(Building::class, 'sdi_business_process_relations', 'business_process_id', 'object_id')->wherePivot('object_type', 'building');
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
