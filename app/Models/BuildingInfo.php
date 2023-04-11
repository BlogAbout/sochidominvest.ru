<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuildingInfo extends Model
{
    use HasFactory;

    protected $table = 'sdi_building_info';
    protected $guarded = false;
    public $timestamps = false;

    public function avatar()
    {
        return $this->belongsTo(Attachment::class, 'avatar_id', 'id');
    }
}
