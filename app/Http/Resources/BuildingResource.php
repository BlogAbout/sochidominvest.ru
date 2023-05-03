<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BuildingResource extends JsonResource
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
            'address' => $this->address,
            'coordinates' => $this->coordinates,
            'type' => $this->type,
            'status' => $this->status,
            'author_id' => $this->author_id,
            'author' => new UserResource($this->whenLoaded('author')),
            'is_active' => $this->is_active,
            'is_publish' => $this->is_publish,
            'is_rent' => $this->is_rent,
            'area' => $this->area,
            'area_min' => $this->area_min,
            'area_max' => $this->area_max,
            'cost' => $this->cost,
            'cost_min' => $this->cost_min,
            'cost_max' => $this->cost_max,
            'cost_min_unit' => $this->cost_min_unit,
            'meta_title' => html_entity_decode($this->meta_title),
            'meta_description' => html_entity_decode($this->meta_description),
            'info' => new BuildingInfoResource($this->whenLoaded('info')),
            'images' => AttachmentResource::collection($this->whenLoaded('images')),
            'videos' => AttachmentResource::collection($this->whenLoaded('videos')),
            'developers' => DeveloperResource::collection($this->whenLoaded('relationDevelopers')),
            'agents' => AgentResource::collection($this->whenLoaded('relationAgents')),
            'contacts' => ContactResource::collection($this->whenLoaded('relationContacts')),
            'documents' => DocumentResource::collection($this->whenLoaded('relationDocuments')),
            'articles' => ArticleResource::collection($this->whenLoaded('relationArticles')),
            'tags' => TagResource::collection($this->whenLoaded('relationTags')),
            'checkers' => CheckerResource::collection($this->whenLoaded('checkers')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'date_created' => $this->dateCreatedFormat,
            'date_updated' => $this->dateCreatedFormat
        ];
    }
}
