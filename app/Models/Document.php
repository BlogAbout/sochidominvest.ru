<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sdi_documents';
    protected $guarded = false;

    protected $with = ['attachment', 'author', 'relationBuildings'];

    public function attachment()
    {
        return $this->belongsTo(Attachment::class, 'attachment_id', 'id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id')->without(['favorites']);
    }

    public function relationBuildings()
    {
        return $this->morphToMany(Building::class, 'object', 'sdi_building_relations')->without(['relationDocuments']);
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
