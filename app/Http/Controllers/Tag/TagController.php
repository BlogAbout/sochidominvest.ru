<?php

namespace App\Http\Controllers\Tag;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tag\StoreRequest;
use App\Http\Requests\Tag\UpdateRequest;
use App\Models\Tag;
use App\Services\TagService;

class TagController extends Controller
{
    public $service;

    public function __construct(TagService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return $this->service->index();
    }

    public function show(Tag $tag)
    {
        return $this->service->show($tag);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Tag $tag)
    {
        return $this->service->update($request, $tag);
    }

    public function destroy(Tag $tag)
    {
        return $this->service->destroy($tag);
    }
}
