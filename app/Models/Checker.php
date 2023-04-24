<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Checker extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sdi_checkers';
    protected $guarded = false;

    protected $with = ['building', 'author'];

    public function building()
    {
        return $this->belongsTo(Building::class, 'building_id', 'id')->without(['checkers']);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }

    public function prices()
    {
        return $this->morphToMany(Price::class, 'object', 'sdi_prices');
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
