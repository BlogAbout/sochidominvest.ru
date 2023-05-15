<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use App\Traits\HasEntityDecodeDescriptionAttribute;
use App\Traits\HasEntityDecodeNameAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Compilation extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes, HasEntityDecodeNameAttribute,
        HasEntityDecodeDescriptionAttribute;

    protected $table = 'sdi_compilations';

    protected $fillable = ['author_id', 'name', 'description', 'is_active'];

    protected $with = ['author', 'buildings'];

    public function buildings()
    {
        return $this->belongsToMany(Building::class, 'sdi_compilation_buildings', 'compilation_id', 'building_id')
            ->without(['rentInfo', 'author', 'images', 'videos', 'checkers', 'relationDevelopers',
                'relationAgents', 'relationContacts', 'relationDocuments', 'relationArticles', 'relationTags']);
    }
}
