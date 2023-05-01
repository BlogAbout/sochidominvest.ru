<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Checker extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_checkers';
    protected $guarded = false;

    protected $with = ['building', 'author'];

    public function building()
    {
        return $this->belongsTo(Building::class, 'building_id', 'id')->without(['checkers']);
    }

    public function prices()
    {
        return $this->morphToMany(Price::class, 'object', 'sdi_prices');
    }
}
