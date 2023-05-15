<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Feed extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_feeds';

    protected $fillable = [
        'title',
        'type',
        'status',
        'user_id',
        'author_id',
        'phone',
        'name',
        'object_id',
        'object_type',
        'is_active'
    ];

    protected $with = ['author', 'user', 'messages'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id')
            ->without(['avatar', 'post', 'role', 'tariff', 'favorites']);
    }

    public function messages()
    {
        return $this->hasMany(FeedMessage::class, 'feed_id', 'id')->without(['feed']);
    }

    public function getTitleAttribute($value)
    {
        return html_entity_decode($value);
    }
}
