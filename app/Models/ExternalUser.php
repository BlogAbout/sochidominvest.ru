<?php

namespace App\Models;

use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExternalUser extends Model
{
    use HasFactory, SoftDeletes, HasCarbonDatesAttributes;

    protected $table = 'sdi_external_users';
    protected $guarded = false;
}
