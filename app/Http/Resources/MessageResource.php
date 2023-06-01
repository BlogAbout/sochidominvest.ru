<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
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
            'messenger_id' => $this->messenger_id,
            'message_id' => $this->message_id,
            'type' => $this->type,
            'text' => $this->text,
            'author_id' => $this->author_id,
            'author' => new UserResource($this->whenLoaded('author')),
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'date_created' => $this->dateCreatedFormat,
            'date_updated' => $this->dateCreatedFormat
        ];
    }
}
