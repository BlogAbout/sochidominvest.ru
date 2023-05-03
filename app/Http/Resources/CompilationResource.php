<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CompilationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => html_entity_decode($this->name),
            'description' => html_entity_decode($this->description),
            'author_id' => $this->author_id,
            'author' => new UserResource($this->whenLoaded('author')),
            'buildings' => BuildingResource::collection($this->whenLoaded('buildings')),
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'date_created' => $this->dateCreatedFormat,
            'date_updated' => $this->dateCreatedFormat
        ];
    }
}
