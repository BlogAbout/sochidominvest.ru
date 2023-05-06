<?php

namespace App\Services;

use App\Http\Resources\BuildingResource;
use App\Models\Building;
use Exception;
use Illuminate\Support\Facades\DB;

class BuildingService
{
    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            $data['author_id'] = auth()->user()->id;

            if (isset($data['info'])) {
                $info = $data['info'];
                unset($data['info']);
            }

            if (isset($data['image_ids'])) {
                $imageIds = $data['image_ids'];
                unset($data['image_ids']);
            }

            if (isset($data['video_ids'])) {
                $videoIds = $data['video_ids'];
                unset($data['video_ids']);
            }

            if (isset($data['developer_ids'])) {
                $developerIds = $data['developer_ids'];
                unset($data['developer_ids']);
            }

            if (isset($data['agent_ids'])) {
                $agentIds = $data['agent_ids'];
                unset($data['agent_ids']);
            }

            if (isset($data['contact_ids'])) {
                $contactIds = $data['contact_ids'];
                unset($data['contact_ids']);
            }

            if (isset($data['document_ids'])) {
                $documentIds = $data['document_ids'];
                unset($data['document_ids']);
            }

            if (isset($data['article_ids'])) {
                $articleIds = $data['article_ids'];
                unset($data['article_ids']);
            }

            if (isset($data['tag_ids'])) {
                $tagIds = $data['tag_ids'];
                unset($data['tag_ids']);
            }

            $building = Building::firstOrCreate($data);

            if (isset($info)) {
                // Todo: сохранить информацию
                // advantages payments formalization в include
            }

            if (isset($imageIds)) {
                $building->images()->attach($imageIds);
            }

            if (isset($videoIds)) {
                $building->videos()->attach($videoIds);
            }

            if (isset($developerIds)) {
                $building->relationDevelopers()->attach($developerIds);
            }

            if (isset($agentIds)) {
                $building->relationAgents()->attach($agentIds);
            }

            if (isset($contactIds)) {
                $building->relationContacts()->attach($contactIds);
            }

            if (isset($documentIds)) {
                $building->relationDocuments()->attach($documentIds);
            }

            if (isset($articleIds)) {
                $building->relationArticles()->attach($articleIds);
            }

            if (isset($tagIds)) {
                $building->relationTags()->attach($tagIds);
            }

            DB::commit();

            return (new BuildingResource($building))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }

    public function update(array $data, Building $building)
    {
        try {
            DB::beginTransaction();

            if (isset($data['info'])) {
                $info = $data['info'];
                unset($data['info']);
            }

            if (isset($data['image_ids'])) {
                $imageIds = $data['image_ids'];
                unset($data['image_ids']);
            }

            if (isset($data['video_ids'])) {
                $videoIds = $data['video_ids'];
                unset($data['video_ids']);
            }

            if (isset($data['developer_ids'])) {
                $developerIds = $data['developer_ids'];
                unset($data['developer_ids']);
            }

            if (isset($data['agent_ids'])) {
                $agentIds = $data['agent_ids'];
                unset($data['agent_ids']);
            }

            if (isset($data['contact_ids'])) {
                $contactIds = $data['contact_ids'];
                unset($data['contact_ids']);
            }

            if (isset($data['document_ids'])) {
                $documentIds = $data['document_ids'];
                unset($data['document_ids']);
            }

            if (isset($data['article_ids'])) {
                $articleIds = $data['article_ids'];
                unset($data['article_ids']);
            }

            if (isset($data['tag_ids'])) {
                $tagIds = $data['tag_ids'];
                unset($data['tag_ids']);
            }

            $building->update($data);

            if (isset($info)) {
                // Todo: сохранить информацию
            }

            if (isset($imageIds)) {
                $building->images()->sync($imageIds);
            }

            if (isset($videoIds)) {
                $building->videos()->sync($videoIds);
            }

            if (isset($developerIds)) {
                $building->relationDevelopers()->sync($developerIds);
            }

            if (isset($agentIds)) {
                $building->relationAgents()->sync($agentIds);
            }

            if (isset($contactIds)) {
                $building->relationContacts()->sync($contactIds);
            }

            if (isset($documentIds)) {
                $building->relationDocuments()->sync($documentIds);
            }

            if (isset($articleIds)) {
                $building->relationArticles()->sync($articleIds);
            }

            if (isset($tagIds)) {
                $building->relationTags()->sync($tagIds);
            }

            DB::commit();

            return (new BuildingResource($building))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }
}
