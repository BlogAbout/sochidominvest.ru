<?php

namespace App\Http\Controllers\Feed;

use App\Http\Controllers\Controller;
use App\Http\Requests\Feed\StoreRequest;
use App\Http\Requests\Feed\UpdateRequest;
use App\Http\Resources\FeedResource;
use App\Models\Feed;
use App\Services\FeedService;

class FeedController extends Controller
{
    public $service;

    public function __construct(FeedService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $feeds = Feed::all();

        return FeedResource::collection($feeds)->response()->setStatusCode(200);
    }

    public function show(Feed $feed)
    {
        return (new FeedResource($feed))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();
        dd($data);

        return $this->service->store($data);
    }

    public function update(UpdateRequest $request, Feed $feed)
    {
        $data = $request->validated();

        return $this->service->update($data, $feed);
    }

    public function destroy(Feed $feed)
    {
        $feed->delete();

        return response([])->setStatusCode(200);
    }
}
