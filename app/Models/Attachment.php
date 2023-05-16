<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use App\Traits\HasEntityDecodeDescriptionAttribute;
use App\Traits\HasEntityDecodeNameAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attachment extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes, HasEntityDecodeNameAttribute,
        HasEntityDecodeDescriptionAttribute;

    protected $table = 'sdi_attachments';

    protected $fillable = ['name', 'description', 'content', 'author_id', 'type', 'extension', 'poster_id'];

    protected $with = ['poster', 'author'];

    public function poster()
    {
        return $this->belongsTo(Attachment::class, 'poster_id', 'id')
            ->without(['poster', 'author']);
    }
}
