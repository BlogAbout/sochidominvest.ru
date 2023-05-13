<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_posts';

    protected $fillable = ['post_id', 'name', 'description', 'type', 'author_id', 'is_active'];

    protected $with = ['postParent'];

    public function postParent()
    {
        return $this->belongsTo(Post::class, 'post_id', 'id');
    }
}
