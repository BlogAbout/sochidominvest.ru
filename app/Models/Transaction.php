<?php

namespace App\Models;

use App\Traits\HasCarbonDatesAttributes;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory, SoftDeletes, HasCarbonDatesAttributes;

    protected $table = 'sdi_transactions';
    protected $guarded = false;

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
