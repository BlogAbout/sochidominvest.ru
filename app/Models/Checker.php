<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use App\Traits\HasEntityDecodeMetaAttribute;
use App\Traits\HasEntityDecodeNameAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Checker extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes, HasEntityDecodeNameAttribute,
        HasEntityDecodeMetaAttribute;

    protected $table = 'sdi_checkers';

    protected $fillable = [
        'building_id',
        'name',
        'author_id',
        'area',
        'cost',
        'furnish',
        'housing',
        'stage',
        'rooms',
        'is_active',
        'status'
    ];

    protected $with = ['building', 'author'];

    public function building()
    {
        return $this->belongsTo(Building::class, 'building_id', 'id')->without(['checkers'])
            ->without(['rentInfo', 'author', 'images', 'videos', 'checkers', 'relationDevelopers',
                'relationAgents', 'relationContacts', 'relationDocuments', 'articles', 'tags']);
    }

    public function prices()
    {
        return $this->morphToMany(Price::class, 'object', 'sdi_prices');
    }
}
