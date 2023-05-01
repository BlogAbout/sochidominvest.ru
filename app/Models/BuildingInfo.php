<?php

namespace App\Models;

use App\Traits\HasAvatarAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuildingInfo extends Model
{
    use HasFactory, HasAvatarAttribute;

    protected $table = 'sdi_building_info';
    protected $guarded = false;
    public $timestamps = false;

    protected $with = ['avatar'];
}
