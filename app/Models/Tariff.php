<?php

namespace App\Models;

use App\Traits\HasEntityDecodeNameAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tariff extends Model
{
    use HasFactory, SoftDeletes, HasEntityDecodeNameAttribute;

    protected $table = 'sdi_tariffs';

    protected $fillable = ['name', 'cost', 'privileges'];
}
