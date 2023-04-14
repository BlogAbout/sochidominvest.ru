<?php

namespace App\Http\Controllers\Building;

use App\Http\Controllers\Controller;
use App\Http\Requests\Building\StoreRequest;
use App\Http\Requests\Building\UpdateRequest;
use App\Http\Resources\BuildingResource;
use App\Models\Building;
use App\Services\BuildingService;

class BuildingController extends Controller
{
    public $service;

    public function __construct(BuildingService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $buildings = Building::all();

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
