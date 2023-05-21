<?php

namespace App\Services;

use App\Http\Requests\Article\StoreRequest;
use App\Http\Requests\Article\UpdateRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ArticleService
{
    public function index(Request $request)
    {
        $filter = $request->all();

        $articles = Article::query()
            ->when(isset($filter['id']), function ($query) use ($filter) {
                $query->whereIn('id', $filter['id']);
            })
            ->when(isset($filter['active']), function ($query) use ($filter) {
                $query->whereIn('is_active', $filter['active']);
            })
            ->when(isset($filter['publish']), function ($query) use ($filter) {
                $query->where('is_publish', '=', $filter['publish']);
            })
            ->when(isset($filter['author']), function ($query) use ($filter) {
                $query->whereIn('author_id', $filter['author']);
            })
            ->when(isset($filter['type']), function ($query) use ($filter) {
                $query->where('type', '=', $filter['type']);
            })
            ->when(isset($filter['text']), function ($query) use ($filter) {
                $query->where('name', 'like', '%' . $filter['text'] . '%');
            })
            ->limit($filter['limit'] ?? -1)
            ->get();

        return ArticleResource::collection($articles)->response()->setStatusCode(200);
    }

    public function show(Article $article)
    {
        $article->increment('views');

        return (new ArticleResource($article))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $article = new Article;
            $article->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            isset($data['building_ids']) && $article->buildings()->attach($data['building_ids']);
            isset($data['image_ids']) && $article->images()->attach($data['image_ids']);
            isset($data['video_ids']) && $article->videos()->attach($data['video_ids']);

            DB::commit();

            $article->refresh();

            return (new ArticleResource($article))->response()->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Article $article)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            $article->update($data);

            isset($data['building_ids']) && $article->buildings()->sync($data['building_ids']);
            isset($data['image_ids']) && $article->images()->sync($data['image_ids']);
            isset($data['video_ids']) && $article->videos()->sync($data['video_ids']);

            DB::commit();

            $article->refresh();

            return (new ArticleResource($article))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Article $article)
    {
        $article->delete();

        return response([])->setStatusCode(200);
    }
}
