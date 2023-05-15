<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasAvatarAttribute;
use App\Traits\HasCarbonDatesAttributes;
use App\Traits\HasEntityDecodeDescriptionAttribute;
use App\Traits\HasEntityDecodeMetaAttribute;
use App\Traits\HasEntityDecodeNameAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Partner extends Model
{
    use HasFactory, SoftDeletes, HasAvatarAttribute, HasAuthorAttribute, HasCarbonDatesAttributes,
        HasEntityDecodeNameAttribute, HasEntityDecodeDescriptionAttribute, HasEntityDecodeMetaAttribute;

    protected $table = 'sdi_partners';

    protected $fillable = [
        'name',
        'description',
        'info',
        'subtitle',
        'type',
        'author_id',
        'is_active',
        'avatar_id',
        'meta_title',
        'meta_description'
    ];

    protected $with = ['author', 'avatar'];

    public function getInfoAttribute($value): string
    {
        return html_entity_decode($value);
    }

    public function getSubtitleAttribute($value): string
    {
        return html_entity_decode($value);
    }
}
