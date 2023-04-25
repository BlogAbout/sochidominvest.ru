<?php

namespace App\Http\Controllers\Building;

use App\Http\Controllers\Controller;
use App\Http\Requests\Building\StoreRequest;
use App\Http\Requests\Building\UpdateRequest;
use App\Http\Resources\BuildingResource;
use App\Models\Building;
use App\Services\BuildingService;
use Illuminate\Http\Request;
use Symfony\Component\Console\Input\Input;

class BuildingController extends Controller
{
    public $service;

    public function __construct(BuildingService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filter = $request->all();

        $buildings = Building::query()
            ->when(isset($filter['id']), function($query) use($filter) {
                $query->whereIn('id', $filter['id']);
            })
            ->when(isset($filter['active']), function ($query) use ($filter) {
                $query->whereIn('is_active', $filter['active']);
            })
            ->when(isset($filter['publish']), function ($query) use ($filter) {
                $query->where('is_publish', '=', $filter['publish']);
            })
            ->when(isset($filter['rent']), function ($query) use ($filter) {
                $query->whereIn('is_rent', $filter['rent']);
            })
            ->when(isset($filter['author']), function ($query) use ($filter) {
                $query->whereIn('author', $filter['author']);
            })
            ->when(isset($filter['type']), function ($query) use ($filter) {
                $query->where('type', '=', $filter['type']);
            })
            ->get();

        return BuildingResource::collection($buildings)->response()->setStatusCode(200);
    }

    public function show(Building $building)
    {
        return (new BuildingResource($building))->response()->setStatusCode(200);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        return $this->service->store($data);
    }

    public function update(UpdateRequest $request, Building $building)
    {
        $data = $request->validated();

        return $this->service->update($data, $building);
    }

    public function destroy(Building $building)
    {
        $building->delete();

        return response([])->setStatusCode(200);
    }
}
