<?php

namespace App\Services;

use App\Http\Requests\Post\StoreRequest;
use App\Http\Requests\Post\UpdateRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Exception;
use Illuminate\Support\Facades\Auth;

class PostService
{
    public function index()
    {
        $posts = Post::all();

        return PostResource::collection($posts)->response()->setStatusCode(200);
    }

    public function show(Post $post)
    {
        return (new PostResource($post))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $data = $request->validated();

            $post = new Post;
            $post->fill(
                array_merge($data, [
                    'author_id' => Auth::user()->id
                ])
            )->save();

            $post->refresh();

            return (new PostResource($post))->response()->setStatusCode(201);
        } catch (Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function update(UpdateRequest $request, Post $post)
    {
        try {
            $data = $request->validated();

            $post->update($data);

            $post->refresh();

            return (new PostResource($post))->response()->setStatusCode(200);
        } catch (\Exception $e) {
            return response(['message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return response([])->setStatusCode(200);
    }
}
