<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BusinessProcessResource extends JsonResource
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
            'type' => $this->type,
            'step' => $this->step,
            'author_id' => $this->author_id,
            'author' => new UserResource($this->whenLoaded('author')),
            'responsible_id' => $this->responsible_id,
            'responsible' => new UserResource($this->whenLoaded('responsible')),
            'attendees' => UserResource::collection($this->whenLoaded('attendees')),
            'feeds' => FeedResource::collection($this->whenLoaded('feeds')),
            'buildings' => BuildingResource::collection($this->whenLoaded('buildings')),
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'date_created' => $this->dateCreatedFormat,
            'date_updated' => $this->dateCreatedFormat
        ];
    }
}
