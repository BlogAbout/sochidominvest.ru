<?php

namespace App\Http\Controllers\Feed;

use App\Http\Controllers\Controller;
use App\Http\Requests\Feed\StoreRequest;
use App\Http\Requests\Feed\UpdateRequest;
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
        $this->service->index();
    }

    public function show(Feed $feed)
    {
        return $this->service->show($feed);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Feed $feed)
    {
        return $this->service->update($request, $feed);
    }

    public function destroy(Feed $feed)
    {
        return $this->service->destroy($feed);
    }
}
