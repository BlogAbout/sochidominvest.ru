<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
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
            'status' => $this->status,
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'email' => $this->email,
            'cost' => $this->cost,
            'object_id' => $this->object_id,
            'object_type' => $this->object_type,
            'duration' => $this->duration,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'paid_at' => $this->paid_at,
            'date_created' => $this->dateCreatedFormat,
            'date_updated' => $this->dateCreatedFormat,
            'date_paid' => $this->datePaidFormat,
        ];
    }
}
