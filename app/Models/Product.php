<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasAvatarAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes, HasAvatarAttribute, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_products';
    protected $guarded = false;

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
