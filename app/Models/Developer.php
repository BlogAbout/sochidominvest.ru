<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Developer extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sdi_developers';
    protected $guarded = false;

    protected $with = ['avatar', 'author', 'relationBuildings'];

    public function avatar()
    {
        return $this->belongsTo(Attachment::class, 'avatar_id', 'id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }

    public function relationBuildings()
    {
        return $this->morphToMany(Building::class, 'object', 'sdi_building_relations')->without(['relationDevelopers']);
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
