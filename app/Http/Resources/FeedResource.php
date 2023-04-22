<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FeedResource extends JsonResource
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
            'title' => $this->title,
            'type' => $this->type,
            'status' => $this->status,
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'author_id' => $this->author_id,
            'author' => new UserResource($this->whenLoaded('author')),
            'phone' => $this->phone,
            'name' => $this->name,
            'object_id' => $this->object_id,
            'object_type' => $this->object_type,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'date_created' => $this->dateCreatedFormat,
            'date_updated' => $this->dateCreatedFormat
        ];
    }
}
