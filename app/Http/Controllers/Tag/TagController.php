<?php

namespace App\Http\Controllers\Tag;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tag\StoreRequest;
use App\Http\Requests\Tag\UpdateRequest;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Exception;

class TagController extends Controller
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
            $data['author_id'] = auth()->user()->id;

            $tag = Tag::create($data);

            return (new TagResource($tag))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function update(UpdateRequest $request, Tag $tag)
    {
        try {
            $data = $request->validated();

            $tag->update($data);

            return (new TagResource($tag))->response()->setStatusCode(200);
        } catch (Exception $e) {
            return response($e->getMessage())->setStatusCode(400);
        }
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return response([])->setStatusCode(200);
    }
}
