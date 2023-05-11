<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BuildingInfoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'district' => $this->district,
            'district_zone' => $this->district_zone,
            'house_class' => $this->house_class,
            'material' => $this->material,
            'house_type' => $this->house_type,
            'entrance_house' => $this->entrance_house,
            'parking' => $this->parking,
            'territory' => $this->territory,
            'ceiling_height' => $this->ceiling_height,
            'maintenance_cost' => $this->maintenance_cost,
            'distance_sea' => $this->distance_sea,
            'gas' => $this->gas,
            'heating' => $this->heating,
            'electricity' => $this->electricity,
            'sewerage' => $this->sewerage,
            'water_supply' => $this->water_supply,
            'advantages' => $this->advantages ? explode(',', $this->advantages) : [],
            'payments' => $this->payments ? explode(',', $this->payments) : [],
            'formalization' => $this->formalization ? explode(',', $this->formalization) : [],
            'amount_contract' => $this->amount_contract,
            'surcharge_doc' => $this->surcharge_doc,
            'surcharge_gas' => $this->surcharge_gas,
            'is_sale_no_resident' => $this->is_sale_no_resident,
            'passed' => $this->passed ? json_decode($this->passed) : null,
            'cadastral_number' => $this->cadastral_number,
            'cadastral_cost' => $this->cadastral_cost,
            'avatar_id' => $this->avatar_id,
            'avatar' => new AttachmentResource($this->whenLoaded('avatar'))
        ];
    }
}
