<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Compilation extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_compilations';
    protected $guarded = false;

    protected $with = ['buildings'];

    public function buildings()
    {
        return $this->belongsToMany(Building::class, 'sdi_compilation_buildings', 'compilation_id', 'building_id');
    }
}
