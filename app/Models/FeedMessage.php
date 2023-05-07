<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeedMessage extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_feed_messages';
    protected $guarded = false;

    protected $with = ['author', 'feed'];

    public function feed()
    {
        return $this->belongsTo(Feed::class, 'feed_id', 'id');
    }
}
