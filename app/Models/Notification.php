<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use App\Traits\HasEntityDecodeDescriptionAttribute;
use App\Traits\HasEntityDecodeNameAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes, HasEntityDecodeNameAttribute,
        HasEntityDecodeDescriptionAttribute;

    protected $table = 'sdi_notifications';

    protected $fillable = [
        'name',
        'description',
        'type',
        'author_id',
        'is_active',
        'object_id',
        'object_type'
    ];

    protected $with = ['author'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'sdi_notification_users', 'notification_id', 'user_id')
            ->without(['avatar', 'post', 'role', 'tariff', 'favorites']);
    }
}
