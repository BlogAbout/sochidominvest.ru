<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
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
            'type' => $this->type,
            'author_id' => $this->author_id,
            'author' => new UserResource($this->whenLoaded('author')),
            'is_active' => $this->is_active,
            'is_publish' => $this->is_publish,
            'avatar_id' => $this->avatar_id,
            'avatar' => new AttachmentResource($this->whenLoaded('avatar')),
            'images' => AttachmentResource::collection($this->whenLoaded('images')),
            'videos' => AttachmentResource::collection($this->whenLoaded('videos')),
            'buildings' => BuildingResource::collection($this->whenLoaded('buildings')),
            'meta_title' => html_entity_decode($this->meta_title),
            'meta_description' => html_entity_decode($this->meta_description),
            'views' => $this->views,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'date_created' => $this->dateCreatedFormat,
            'date_updated' => $this->dateCreatedFormat
        ];
    }
}
