<?php

namespace App\Services;

use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Exception;
use Illuminate\Support\Facades\DB;

class ArticleService
{
    public function store(array $data)
    {
        try {
            DB::beginTransaction();

            $data['author_id'] = auth()->user()->id;

            if (isset($data['building_ids'])) {
                $buildingIds = $data['building_ids'];
                unset($data['building_ids']);
            }

            if (isset($data['image_ids'])) {
                $imageIds = $data['image_ids'];
                unset($data['image_ids']);
            }

            if (isset($data['video_ids'])) {
                $videoIds = $data['video_ids'];
                unset($data['video_ids']);
            }

            $article = Article::firstOrCreate($data);

            if (isset($buildingIds)) {
                $article->relationBuildings()->attach($buildingIds);
            }

            if (isset($imageIds)) {
                $article->images()->attach($imageIds);
            }

            if (isset($videoIds)) {
                $article->videos()->attach($videoIds);
            }

            DB::commit();

            return (new ArticleResource($article))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }

    public function update(array $data, Article $article)
    {
        try {
            DB::beginTransaction();

            if (isset($data['building_ids'])) {
                $buildingIds = $data['building_ids'];
                unset($data['building_ids']);
            }

            if (isset($data['image_ids'])) {
                $imageIds = $data['image_ids'];
                unset($data['image_ids']);
            }

            if (isset($data['video_ids'])) {
                $videoIds = $data['video_ids'];
                unset($data['video_ids']);
            }

            $article->update($data);

            if (isset($buildingIds)) {
                $article->buildings()->sync($buildingIds);
            }

            if (isset($imageIds)) {
                $article->images()->sync($imageIds);
            }

            if (isset($videoIds)) {
                $article->videos()->attach($videoIds);
            }

            DB::commit();

            return (new ArticleResource($article))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response($e->getMessage())->setStatusCode(500);
        }
    }
}
