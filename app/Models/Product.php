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

    protected $with = ['category', 'avatar', 'author', 'images', 'videos'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function images()
    {
        return $this->morphToMany(Attachment::class, 'object', 'sdi_images');
    }

    public function videos()
    {
        return $this->morphToMany(Attachment::class, 'object', 'sdi_videos');
    }

    public function prices()
    {
        return $this->hasMany(Price::class, 'object_id', 'id')->where('object_type', 'like', 'product');
    }
}
