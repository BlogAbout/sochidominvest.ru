<?php

namespace App\Models;

use App\Traits\HasCarbonDatesAttributes;
use App\Traits\HasEntityDecodeNameAttribute;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory, SoftDeletes, HasCarbonDatesAttributes, HasEntityDecodeNameAttribute;

    protected $table = 'sdi_transactions';

    protected $dates = ['paid_at'];

    protected $fillable = [
        'name',
        'status',
        'user_id',
        'email',
        'cost',
        'object_id',
        'object_type',
        'duration',
        'paid_at'
    ];

    protected $attributes = [
        'name' => '',
        'status' => 'new',
        'email' => '',
        'cost' => 0,
        'duration' => 0
    ];

    protected $with = ['user'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id')
            ->without(['avatar', 'post', 'role', 'tariff', 'favorites', 'bpSorting']);
    }

    public function getDatePaidFormatAttribute(): string
    {
        return Carbon::parse($this->paid_at)->diffForHumans();
    }
}
