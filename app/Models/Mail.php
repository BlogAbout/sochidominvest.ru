<?php

namespace App\Models;

use App\Traits\HasAuthorAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mail extends Model
{
    use HasFactory, SoftDeletes, HasAuthorAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_mails';
    protected $guarded = false;

    protected $with = ['recipients'];

    public function recipients()
    {
        return $this->belongsToMany(User::class, 'sdi_mail_recipients', 'mail_id', 'user_id')
            ->without(['avatar', 'post', 'role', 'tariff', 'favorites']);
    }
}
