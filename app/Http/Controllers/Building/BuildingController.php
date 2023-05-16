<?php

namespace App\Http\Controllers\Building;

use App\Http\Controllers\Controller;
use App\Http\Requests\Building\StoreRequest;
use App\Http\Requests\Building\UpdateRequest;
use App\Models\Building;
use App\Services\BuildingService;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
    public $service;

    public function __construct(BuildingService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function show(Building $building)
    {
        return $this->service->show($building);
    }

    public function store(StoreRequest $request)
    {
        return $this->service->store($request);
    }

    public function update(UpdateRequest $request, Building $building)
    {
        return $this->service->update($request, $building);
    }

    public function destroy(Building $building)
    {
        $this->service->destroy($building);
    }
}
