<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AttachmentResource extends JsonResource
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
            'description' => html_entity_decode($this->description),
            'content' => $this->content,
            'type' => $this->type,
            'extension' => $this->extension,
            'author_id' => $this->author_id,
            'author' => new UserResource($this->whenLoaded('author')),
            'is_active' => $this->is_active,
            'poster_id' => $this->poster_id,
            'poster' => new AttachmentResource($this->whenLoaded('poster')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'date_created' => $this->dateCreatedFormat,
            'date_updated' => $this->dateCreatedFormat
        ];
    }
}
