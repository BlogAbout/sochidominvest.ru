<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'phone' => $this->phone,
            'is_active' => $this->is_active,
            'is_block' => $this->is_block,
            'settings' => $this->settings,
            'avatar_id' => $this->avatar_id,
            'role_id' => $this->role_id,
            'post_id' => $this->post_id,
            'tariff_id' => $this->tariff_id,
            'tariff_expired' => $this->tariff_expired,
            'last_active' => $this->last_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'date_last_active' => $this->dateLastActiveFormat,
            'date_created' => $this->dateCreatedFormat,
            'date_updated' => $this->dateCreatedFormat
        ];
    }
}
