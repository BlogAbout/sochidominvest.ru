<?php

namespace App\Services;

use App\Models\Price;

class PriceService
{
    public function store(array $data)
    {
        $price = Price::where('object_id', $data['object_id'])
            ->where('object_type', $data['object_type'])
            ->where('date_update', $data['date_update'])
            ->first();

        if ($price) {
            Price::where('object_id', $data['object_id'])
                ->where('object_type', $data['object_type'])
                ->where('date_update', $data['date_update'])
                ->update(['cost' => $data['cost']]);
        } else {
            $price = new Price;
            $price->fill($data)->save();
        }
    }
}
