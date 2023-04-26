<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sdi_products';
    protected $guarded = false;

    protected $with = ['category', 'avatar', 'author', 'images', 'videos'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function avatar()
    {
        return $this->belongsTo(Attachment::class, 'avatar_id', 'id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id')->without(['favorites']);
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

    public function getDateCreatedFormatAttribute(): string
    {
        return Carbon::parse($this->created_at)->diffForHumans();
    }

    public function getDateUpdatedFormatAttribute(): string
    {
        return Carbon::parse($this->updated_at)->diffForHumans();
    }
}
