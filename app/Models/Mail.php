<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use App\Traits\HasEntityDecodeNameAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mail extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes, HasEntityDecodeNameAttribute;

    protected $table = 'sdi_mails';

    protected $fillable = ['name', 'content', 'content_html', 'type', 'author_id', 'is_active', 'status', 'by_roles'];

    protected $with = ['author', 'recipients'];

    public function recipients()
    {
        return $this->belongsToMany(User::class, 'sdi_mail_recipients', 'mail_id', 'user_id')
            ->without(['avatar', 'post', 'role', 'tariff', 'favorites']);
    }

    public function getByRolesAttribute($value)
    {
        return $value ? array_map('intval', explode(',', $value)) : [];
    }

    public function setByRolesAttribute($value)
    {
        $this->attributes['by_roles'] = $value ? implode(',', $value) : '';
    }
}
