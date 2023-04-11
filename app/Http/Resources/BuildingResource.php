<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BuildingResource extends JsonResource
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
            'description' => $this->description,
            'address' => $this->address,
            'coordinates' => $this->coordinates,
            'type' => $this->type,
            'status' => $this->status,
            'author_id' => $this->author_id,
            'is_active' => $this->is_active,
            'is_publish' => $this->is_publish,
            'is_rent' => $this->is_rent,
            'area' => $this->area,
            'area_min' => $this->area_min,
            'area_max' => $this->area_max,
            'cost' => $this->cost,
            'cost_min' => $this->cost_min,
            'cost_max' => $this->cost_max,
            'cost_min_unit' => $this->cost_min_unit,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'date_created' => $this->dateCreatedFormat,
            'date_updated' => $this->dateCreatedFormat
        ];
    }
}
