<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WidgetItem extends Model
{
    use HasFactory;

    protected $table = 'sdi_widget_items';
    protected $guarded = false;
    public $timestamps = false;
}
