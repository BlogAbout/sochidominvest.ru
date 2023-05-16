<?php

namespace App\Models;

use App\Traits\HasAvatarAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuildingInfo extends Model
{
    use HasFactory, HasAvatarAttribute;

    protected $table = 'sdi_building_info';

    protected $fillable = [
        'id',
        'district',
        'district_zone',
        'house_class',
        'material',
        'house_type',
        'entrance_house',
        'parking',
        'territory',
        'ceiling_height',
        'maintenance_cost',
        'distance_sea',
        'gas',
        'heating',
        'electricity',
        'sewerage',
        'water_supply',
        'advantages',
        'payments',
        'formalization',
        'amount_contract',
        'surcharge_doc',
        'surcharge_gas',
        'is_sale_no_resident',
        'passed',
        'cadastral_number',
        'cadastral_cost',
        'avatar_id'
    ];

    public $timestamps = false;

    protected $casts = [
        'passed' => 'array'
    ];

    protected $with = ['avatar'];

    public function getAdvantagesAttribute($value)
    {
        return $value ? explode(',', $value) : [];
    }

    public function setAdvantagesAttribute($value)
    {
        $this->attributes['advantages'] = $value ? implode(',', $value) : '';
    }

    public function getPaymentsAttribute($value)
    {
        return $value ? explode(',', $value) : [];
    }

    public function setPaymentsAttribute($value)
    {
        $this->attributes['payments'] = $value ? implode(',', $value) : '';
    }

    public function getFormalizationAttribute($value)
    {
        return $value ? explode(',', $value) : [];
    }

    public function setFormalizationAttribute($value)
    {
        $this->attributes['formalization'] = $value ? implode(',', $value) : '';
    }
}
