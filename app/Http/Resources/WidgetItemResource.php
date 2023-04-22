<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class WidgetItemResource extends JsonResource
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
            'widget_id' => $this->widget_id,
            'object_id' => $this->object_id,
            'object_type' => $this->object_type,
            'ordering' => $this->ordering
        ];
    }
}
