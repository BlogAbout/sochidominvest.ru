<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'name' => html_entity_decode($this->name),
            'description' => html_entity_decode($this->description),
            'cost' => $this->cost,
            'cost_old' => $this->cost_old,
            'author_id' => $this->author_id,
            'author' => new UserResource($this->whenLoaded('author')),
            'is_active' => $this->is_active,
            'avatar_id' => $this->avatar_id,
            'avatar' => new AttachmentResource($this->whenLoaded('avatar')),
            'images' => AttachmentResource::collection($this->whenLoaded('images')),
            'videos' => AttachmentResource::collection($this->whenLoaded('videos')),
            'fields' => $this->fields ? json_decode($this->fields) : [],
            'meta_title' => html_entity_decode($this->meta_title),
            'meta_description' => html_entity_decode($this->meta_description),
            'views' => 0,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'date_created' => $this->dateCreatedFormat,
            'date_updated' => $this->dateCreatedFormat
        ];
    }
}
