<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TariffResource extends JsonResource
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
            'name' => $this->name,
            'cost' => $this->cost,
            'privileges' => $this->privileges ? explode(',', $this->privileges) : [],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
