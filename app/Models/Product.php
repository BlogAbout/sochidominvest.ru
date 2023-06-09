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

class Product extends Model
{
    use HasFactory, SoftDeletes, HasAvatarAttribute, HasAuthorAttribute, HasCarbonDatesAttributes,
        HasEntityDecodeNameAttribute, HasEntityDecodeDescriptionAttribute, HasEntityDecodeMetaAttribute;

    protected $table = 'sdi_products';

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'cost',
        'cost_old',
        'author_id',
        'is_active',
        'avatar_id',
        'fields',
        'meta_title',
        'meta_description'
    ];

    protected $attributes = [
        'name' => '',
        'description' => '',
        'cost' => 0,
        'is_active' => 1,
        'meta_title' => '',
        'meta_description' => '',
        'views' => 0
    ];

    protected $casts = [
        'fields' => 'array'
    ];

    protected $with = ['category', 'avatar', 'author', 'images', 'videos', 'prices'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id')
            ->without(['avatar', 'author', 'products']);
    }

    public function images()
    {
        return $this->morphToMany(Attachment::class, 'object', 'sdi_images')
            ->without(['poster', 'author']);
    }

    public function videos()
    {
        return $this->morphToMany(Attachment::class, 'object', 'sdi_videos')
            ->without(['author']);
    }

    public function prices()
    {
        return $this->morphMany(Price::class, 'object')
            ->orderBy('date_update', 'DESC')
            ->limit(20);
    }
}
