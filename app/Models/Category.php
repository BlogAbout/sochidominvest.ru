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

class Category extends Model
{
    use HasFactory, SoftDeletes, HasAvatarAttribute, HasAuthorAttribute, HasCarbonDatesAttributes,
        HasEntityDecodeNameAttribute, HasEntityDecodeDescriptionAttribute, HasEntityDecodeMetaAttribute;

    protected $table = 'sdi_categories';

    protected $fillable = [
        'name',
        'description',
        'author_id',
        'is_active',
        'avatar_id',
        'fields',
        'meta_title',
        'meta_description'
    ];

    protected $casts = [
        'fields' => 'array'
    ];

    protected $with = ['avatar', 'author', 'products'];

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id', 'id')
            ->without(['category', 'avatar', 'author', 'images', 'videos', 'prices']);
    }
}
