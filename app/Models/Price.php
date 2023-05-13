<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    use HasFactory;

    protected $table = 'sdi_prices';

    protected $fillable = ['object_id', 'object_type', 'date_update', 'cost'];

    protected $dates = ['date_update'];

    public $timestamps = false;
}
