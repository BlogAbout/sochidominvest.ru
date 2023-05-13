<?php

namespace App\Services;

use App\Http\Requests\Tag\StoreRequest;
use App\Http\Requests\Tag\UpdateRequest;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Exception;
use Illuminate\Support\Facades\Auth;

class TagService
{
    public function index()
    {
        $tags = Tag::all();

        return TagResource::collection($tags)->response()->setStatusCode(200);
    }

    public function show(Tag $tag)
    {
        return (new TagResource($tag))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            $tag = new Tag;
            $tag->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            $tag->refresh();

            return (new TagResource($tag))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Tag $tag)
    {
        try {
            $data = $request->validated();

            $tag->update($data);

            $tag->refresh();

            return (new TagResource($tag))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return response([])->setStatusCode(200);
    }
}
