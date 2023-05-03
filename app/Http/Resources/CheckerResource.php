<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CheckerResource extends JsonResource
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
            'building_id' => $this->building_id,
            'building' => new BuildingResource($this->whenLoaded('building')),
            'name' => html_entity_decode($this->name),
            'author_id' => $this->author_id,
            'author' => new UserResource($this->whenLoaded('author')),
            'area' => $this->area,
            'cost' => $this->cost,
            'furnish' => $this->furnish,
            'housing' => $this->housing,
            'stage' => $this->stage,
            'rooms' => $this->rooms,
            'status' => $this->status,
            'is_active' => $this->is_active,
            'meta_title' => html_entity_decode($this->meta_title),
            'meta_description' => html_entity_decode($this->meta_description),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'date_created' => $this->dateCreatedFormat,
            'date_updated' => $this->dateCreatedFormat
        ];
    }
}
