<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;
use App\Http\Requests\Article\StoreRequest;
use App\Http\Requests\Article\UpdateRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Services\ArticleService;

class ArticleController extends Controller
{
    public $service;

    public function __construct()
    {
        $this->service = new ArticleService();
    }

    public function index()
    {
        $articles = Article::all();

        return ArticleResource::collection($articles)->response()->setStatusCode(200);
    }

    public function show(Article $article)
    {
        return (new ArticleResource($article))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        return $this->service->store($data);
    }

    public function update(UpdateRequest $request, Article $article)
    {
        $data = $request->validated();

        return $this->service->update($data, $article);
    }

    public function destroy(Article $article)
    {
        $article->delete();

        return response([])->setStatusCode(200);
    }
}
