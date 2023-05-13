<?php

namespace App\Models;

use App\Traits\HasAvatarAttribute;
use App\Traits\HasCarbonDatesAttributes;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasAvatarAttribute, HasCarbonDatesAttributes;

    protected $table = 'sdi_users';

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'last_active',
        'is_active',
        'is_block',
        'settings',
        'avatar_id',
        'role_id',
        'post_id',
        'tariff_id',
        'tariff_expired'
    ];

    protected $attributes = [
        'name' => '',
        'email' => '',
        'password' => '',
        'phone' => '',
        'is_active' => 1,
        'is_block' => 0,
        'role_id' => 1
    ];

    protected $with = ['avatar', 'post', 'role', 'tariff', 'favorites'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'settings' => 'array'
    ];

    protected $dates = ['last_active'];

    protected $appends = ['bp_sorting'];

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id', 'id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }

    public function tariff()
    {
        return $this->belongsTo(Tariff::class, 'tariff_id', 'id');
    }

    public function favorites()
    {
        return $this->belongsToMany(Building::class, 'sdi_favorites', 'user_id', 'building_id');
    }

    public function getBpSortingAttribute()
    {
        $sorting = DB::table('sdi_business_process_sorting')->where('user_id', '=', $this->id)->limit(1)->value('sorting');

        return $sorting ? json_decode($sorting) : [];
    }

    public function getDateLastActiveFormatAttribute(): string
    {
        return Carbon::parse($this->last_active)->diffForHumans();
    }
}
