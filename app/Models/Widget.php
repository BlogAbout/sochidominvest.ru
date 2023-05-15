<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use App\Traits\HasEntityDecodeNameAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Widget extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes, HasEntityDecodeNameAttribute;

    protected $table = 'sdi_widgets';

    protected $fillable = ['name', 'type', 'style', 'page', 'author_id', 'is_active', 'ordering'];

    protected $with = ['items'];

    public function items()
    {
        return $this->hasMany(WidgetItem::class, 'widget_id', 'id');
    }
}
