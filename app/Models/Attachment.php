<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attachment extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_attachments';
    protected $guarded = false;

    protected $with = ['poster', 'author'];

    public function poster()
    {
        return $this->belongsTo(Attachment::class, 'poster_id', 'id')
            ->without(['poster', 'author']);
    }
}
