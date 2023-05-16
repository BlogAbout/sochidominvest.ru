<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use App\Traits\HasEntityDecodeNameAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes, HasEntityDecodeNameAttribute;

    protected $table = 'sdi_documents';

    protected $fillable = [
        'name',
        'content',
        'type',
        'author_id',
        'is_active',
        'attachment_id',
        'object_id',
        'object_type'
    ];

    protected $with = ['attachment', 'author', 'buildings'];

    public function attachment()
    {
        return $this->belongsTo(Attachment::class, 'attachment_id', 'id')
            ->without(['poster', 'author']);
    }

    public function buildings()
    {
        return $this->morphToMany(Building::class, 'object', 'sdi_building_relations')
            ->without(['rentInfo', 'author', 'images', 'videos', 'checkers', 'relationDevelopers',
                'relationAgents', 'relationContacts', 'relationDocuments', 'articles', 'tags']);
    }
}
