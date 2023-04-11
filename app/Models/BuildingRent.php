<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuildingRent extends Model
{
    use HasFactory;

    protected $table = 'sdi_building_rent';
    protected $guarded = false;
    public $timestamps = false;
}
