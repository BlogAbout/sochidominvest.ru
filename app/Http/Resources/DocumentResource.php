<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
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
            'name' => html_entity_decode($this->name),
            'content' => $this->content,
            'type' => $this->type,
            'author_id' => $this->author_id,
            'author' => new UserResource($this->whenLoaded('author')),
            'is_active' => $this->is_active,
            'attachment_id ' => $this->attachment_id,
            'attachment' => new AttachmentResource($this->whenLoaded('attachment')),
            'object_id' => $this->object_id,
            'object_type' => $this->object_type,
            'buildings' => BuildingResource::collection($this->whenLoaded('relationBuildings')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'date_created' => $this->dateCreatedFormat,
            'date_updated' => $this->dateCreatedFormat
        ];
    }
}
